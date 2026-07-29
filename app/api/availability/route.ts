import { NextRequest, NextResponse } from "next/server";
import { DysfunctionType } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildExercisePlan } from "@/lib/plan/buildExercisePlan";
import { generateWorkSessions } from "@/lib/schedule/generateWorkSessions";
import { syncWorkSessions } from "@/lib/calendar/syncWorkSessions";

const COOKIE_NAME = "unseat_pending_assessment";

type PendingAssessment = {
  answers: Record<string, boolean>;
  dysfunctionType: DysfunctionType;
  dysfunctionTypes?: DysfunctionType[];
};

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pendingCookie = request.cookies.get(COOKIE_NAME)?.value;

  if (!pendingCookie) {
    return NextResponse.redirect(new URL("/assessment", request.url));
  }

  let pending: PendingAssessment;
  try {
    pending = JSON.parse(pendingCookie);
  } catch {
    return NextResponse.redirect(new URL("/assessment", request.url));
  }

  const formData = await request.formData();

  // Parse multi-window availability.
  // AvailabilityGrid names fields as startTime-{dayOfWeek}-{windowId}
  // and endTime-{dayOfWeek}-{windowId}. We scan all form keys for the
  // startTime- prefix and pair each with its endTime counterpart.
  const availabilityRows: {
    userId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[] = [];

  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("startTime-")) continue;

    const suffix = key.slice("startTime-".length);
    const dashIdx = suffix.indexOf("-");
    if (dashIdx === -1) continue;

    const dayOfWeek = parseInt(suffix.slice(0, dashIdx), 10);
    const windowId = suffix.slice(dashIdx + 1);
    const startTime = value as string;
    const endTime = formData.get(`endTime-${dayOfWeek}-${windowId}`) as string;

    // Skip windows where the user left the time blank.
    if (!startTime || !endTime) continue;

    availabilityRows.push({
      userId: session.user.id,
      dayOfWeek,
      startTime,
      endTime,
    });
  }

  const userId = session.user.id;

  // Delete and recreate everything in a transaction.
  // Ordering: WorkSession → PlanExercise → Phase → ExercisePlan → Assessment → Availability
  // (children before parents to satisfy foreign key constraints).
  let assessmentId: string;
  try {
    assessmentId = await db.$transaction(async (tx) => {
      await tx.workSession.deleteMany({ where: { userId } });

      const existingPlan = await tx.exercisePlan.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (existingPlan) {
        const phases = await tx.phase.findMany({
          where: { planId: existingPlan.id },
          select: { id: true },
        });
        const phaseIds = phases.map((p) => p.id);
        if (phaseIds.length > 0) {
          await tx.planExercise.deleteMany({ where: { phaseId: { in: phaseIds } } });
          await tx.phase.deleteMany({ where: { id: { in: phaseIds } } });
        }
        await tx.exercisePlan.delete({ where: { id: existingPlan.id } });
      }

      await tx.assessment.deleteMany({ where: { userId } });
      await tx.availability.deleteMany({ where: { userId } });

      if (availabilityRows.length > 0) {
        await tx.availability.createMany({ data: availabilityRows });
      }

      const assessment = await tx.assessment.create({
        data: {
          userId,
          answers: pending.answers,
          dysfunctionType: pending.dysfunctionType,
        },
      });

      return assessment.id;
    });
  } catch (err) {
    console.error("[availability] DB transaction failed:", err);
    return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
  }

  let planId: string;
  try {
    planId = await buildExercisePlan({
      userId,
      assessmentId,
      dysfunctionType: pending.dysfunctionType,
    });
  } catch (err) {
    console.error("[availability] buildExercisePlan failed:", err);
    return NextResponse.json({ error: "Failed to build exercise plan" }, { status: 500 });
  }

  let sessionCount = 0;
  try {
    sessionCount = await generateWorkSessions({ userId, planId });
  } catch (err) {
    console.error("[availability] generateWorkSessions failed:", err);
    return NextResponse.json({ error: "Failed to generate sessions" }, { status: 500 });
  }

  console.log(`[availability] Generated ${sessionCount} WorkSessions for user ${userId}`);

  await db.user.update({
    where: { id: userId },
    data: { onboardingDone: true },
  });

  // Calendar sync runs last. Log the outcome explicitly so failures
  // are visible in Railway logs, not silently swallowed.
  let calendarError: string | null = null;
  try {
    await syncWorkSessions(userId);
    console.log(`[availability] Calendar sync succeeded for user ${userId}`);
  } catch (err) {
    calendarError = err instanceof Error ? err.message : String(err);
    console.error(`[availability] Calendar sync failed for user ${userId}:`, calendarError);
  }

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(COOKIE_NAME);

  if (calendarError) {
    // Short-lived readable cookie so the dashboard can show a banner.
    response.cookies.set("unseat_cal_error", "1", {
      httpOnly: false,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}
