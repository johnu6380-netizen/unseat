// lib/calendar/syncWorkSessions.ts
// Syncs all unsynced WorkSessions to Google Calendar.
// Resolves each session's exerciseIds to Exercise rows directly.
//
// IMPORTANT: Always called inside try/catch in the availability route.
// A calendar failure must never block onboarding from completing.

import { db } from "@/lib/db";
import { createCalendarEvent } from "./createEvent";
import { buildEventDescription } from "./buildEventDescription";

// ---------------------------------------------------------------------------
// Token management
// ---------------------------------------------------------------------------

async function getValidAccessToken(userId: string): Promise<string> {
  const account = await db.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account) {
    throw new Error(
      `No Google account linked for user ${userId}. User must sign in with Google.`
    );
  }

  if (!account.access_token) {
    throw new Error(
      `Google account for user ${userId} has no access token stored.`
    );
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const isExpiredOrNearExpiry =
    account.expires_at !== null && account.expires_at - nowSeconds < 300;

  if (!isExpiredOrNearExpiry) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    throw new Error(
      `Access token for user ${userId} is expired and no refresh token is stored.`
    );
  }

  const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: account.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!refreshRes.ok) {
    const text = await refreshRes.text();
    throw new Error(`Google token refresh failed (${refreshRes.status}): ${text}`);
  }

  const refreshData = (await refreshRes.json()) as {
    access_token: string;
    expires_in?: number;
  };

  const newExpiresAt =
    Math.floor(Date.now() / 1000) + (refreshData.expires_in ?? 3600);

  await db.account.update({
    where: { id: account.id },
    data: {
      access_token: refreshData.access_token,
      expires_at: newExpiresAt,
    },
  });

  return refreshData.access_token;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function syncWorkSessions(userId: string): Promise<void> {
  const accessToken = await getValidAccessToken(userId);

  const unsyncedSessions = await db.workSession.findMany({
    where: { userId, googleEventId: null },
    orderBy: { scheduledAt: "asc" },
  });

  if (unsyncedSessions.length === 0) {
    console.log(`[syncWorkSessions] No unsynced sessions for user ${userId}`);
    return;
  }

  console.log(`[syncWorkSessions] Found ${unsyncedSessions.length} unsynced sessions for user ${userId}`);

  // Collect all unique exercise IDs across all sessions.
  const allIds = Array.from(
    new Set(unsyncedSessions.flatMap((ws) => ws.exerciseIds))
  );

  console.log(`[syncWorkSessions] Resolving ${allIds.length} unique exercise IDs`);

  // Guard: Prisma generates invalid SQL for `id IN ()` — skip the query if empty.
  const exerciseById = new Map<string, { id: string; name: string; phaseType: string; videoUrl: string | null }>();

  if (allIds.length > 0) {
    const exercises = await db.exercise.findMany({
      where: { id: { in: allIds } },
      select: { id: true, name: true, phaseType: true, videoUrl: true },
    });
    for (const ex of exercises) {
      exerciseById.set(ex.id, ex);
    }
    console.log(`[syncWorkSessions] Resolved ${exercises.length} exercises from DB`);
  }

  let successCount = 0;
  let skipCount = 0;

  for (const ws of unsyncedSessions) {
    const sessionExercises = ws.exerciseIds
      .map((id) => exerciseById.get(id))
      .filter((ex): ex is NonNullable<typeof ex> => ex !== undefined);

    // Skip sessions with no exercises — these are stale rows from before
    // the exerciseIds migration. They'll never have valid content to sync.
    // The user needs to re-run the availability flow to regenerate them.
    if (sessionExercises.length === 0 && ws.exerciseIds.length > 0) {
      console.warn(`[syncWorkSessions] Session ${ws.id} has exerciseIds but none resolved — skipping`);
      skipCount++;
      continue;
    }

    const description = buildEventDescription({
      message: ws.message,
      durationMins: ws.durationMins,
      exercises: sessionExercises,
    });

    const googleEventId = await createCalendarEvent({
      accessToken,
      summary: "Corrective Exercise Session — Unseat",
      description,
      startDateTime: ws.scheduledAt,
      durationMins: ws.durationMins,
    });

    await db.workSession.update({
      where: { id: ws.id },
      data: { googleEventId },
    });

    successCount++;
    console.log(`[syncWorkSessions] Created calendar event ${googleEventId} for session ${ws.id}`);
  }

  console.log(`[syncWorkSessions] Done — ${successCount} synced, ${skipCount} skipped`);
}
