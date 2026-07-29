import { db } from "@/lib/db";

type GenerateWorkSessionsInput = {
  userId: string;
  planId: string;
};

const MIN_BUFFER_MINS = 10; // always leave at least this much free time in the window
const MAX_SESSION_MINS = 15; // sessions never exceed this length
const EXERCISES_PER_5_MIN = 4; // exercise cap scales with duration

/**
 * Computes session duration from an availability window.
 *
 * Rule: duration = window length minus a 10-minute buffer, capped at 15.
 *   10:30-10:45 (15 min window) -> 15 - 10 = 5 min session
 *   3:00-4:00   (60 min window) -> capped at 15 min session
 *   10:00-10:08 (8 min window)  -> 0 min session (too short to use)
 */
function computeSessionDuration(windowMins: number): number {
  const duration = windowMins - MIN_BUFFER_MINS;
  return Math.max(0, Math.min(duration, MAX_SESSION_MINS));
}

/**
 * Computes how many exercises a session of a given duration should include.
 * Rule: every 5 minutes of session time allows 4 exercises.
 *   5 min  -> 4 exercises
 *   15 min -> 12 exercises
 */
function computeExerciseCap(durationMins: number): number {
  return Math.floor(durationMins / 5) * EXERCISES_PER_5_MIN;
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Deterministically generates WorkSession rows for a user's ExercisePlan,
 * based on their weekly Availability windows. No AI, no Google Calendar
 * calls — this only writes to the local database.
 *
 * Each session's duration is derived from its own availability window
 * (not a fixed global value), and each session is assigned its own subset
 * of exercise IDs from the plan's full exercise library, sized to fit that
 * duration. Availability windows too short to produce a usable session
 * (after the 10-minute buffer) are skipped entirely.
 */
export async function generateWorkSessions({
  userId,
  planId,
}: GenerateWorkSessionsInput): Promise<number> {
  const availability = await db.availability.findMany({
    where: { userId },
    orderBy: { dayOfWeek: "asc" },
  });

  if (availability.length === 0) {
    return 0;
  }

  const plan = await db.exercisePlan.findFirst({
    where: { id: planId, userId },
    include: {
      phases: {
        orderBy: { order: "asc" },
        include: {
          exercises: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!plan) {
    throw new Error("ExercisePlan not found for this user");
  }

  // Flatten the full plan into an ordered exercise-id list, preserving
  // phase order (INHIBIT -> LENGTHEN -> ACTIVATE -> INTEGRATE) so slicing
  // the first N always yields a phase-ordered subset, not a random one.
  const orderedExerciseIds: string[] = plan.phases.flatMap((phase) =>
    phase.exercises.map((pe) => pe.exerciseId)
  );

  await db.workSession.deleteMany({
    where: { planId },
  });

  const now = new Date();

  const sessionsToCreate = availability
    .map((slot) => {
      const windowMins =
        parseTimeToMinutes(slot.endTime) - parseTimeToMinutes(slot.startTime);
      const durationMins = computeSessionDuration(windowMins);

      if (durationMins <= 0) {
        return null; // window too short to produce a usable session
      }

      const exerciseCap = computeExerciseCap(durationMins);
      const exerciseIds = orderedExerciseIds.slice(0, exerciseCap);

      const scheduledAt = nextOccurrenceOfWeekday(
        now,
        slot.dayOfWeek,
        slot.startTime
      );

      return {
        userId,
        planId,
        scheduledAt,
        durationMins,
        exerciseIds,
        message: buildPlaceholderMessage(),
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  if (sessionsToCreate.length === 0) {
    return 0;
  }

  await db.workSession.createMany({
    data: sessionsToCreate,
  });

  return sessionsToCreate.length;
}

function nextOccurrenceOfWeekday(
  from: Date,
  dayOfWeek: number,
  startTime: string
): Date {
  const [hours, minutes] = startTime.split(":").map(Number);

  const result = new Date(from);
  result.setHours(hours, minutes, 0, 0);

  const currentDay = result.getDay();
  let daysToAdd = (dayOfWeek - currentDay + 7) % 7;

  if (daysToAdd === 0 && result.getTime() <= from.getTime()) {
    daysToAdd = 7;
  }

  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function buildPlaceholderMessage(): string {
  return "A quick movement session today. Let's get started.";
}