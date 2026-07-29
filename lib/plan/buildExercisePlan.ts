import { DysfunctionType, PhaseType } from "@prisma/client";
import { db } from "@/lib/db";

type BuildExercisePlanInput = {
  userId: string;
  assessmentId: string;
  dysfunctionType: DysfunctionType;
};

// Display order for phases within a plan, per the NASM Corrective
// Exercise Continuum: Inhibit -> Lengthen -> Activate -> Integrate.
const PHASE_ORDER: PhaseType[] = [
  PhaseType.INHIBIT,
  PhaseType.LENGTHEN,
  PhaseType.ACTIVATE,
  PhaseType.INTEGRATE,
];

/**
 * Deterministically builds an ExercisePlan for a user based on their
 * assessed DysfunctionType. No AI involved — exercises are pulled
 * directly from the seeded Exercise library by dysfunctionTargets,
 * then grouped into the four NASM phases.
 *
 * Returns the created plan's id.
 */
export async function buildExercisePlan({
  userId,
  assessmentId,
  dysfunctionType,
}: BuildExercisePlanInput): Promise<string> {
  await db.workSession.deleteMany({
  where: { userId },
});

await db.planExercise.deleteMany({
  where: {
    phase: {
      plan: {
        userId,
      },
    },
  },
});

await db.phase.deleteMany({
  where: {
    plan: {
      userId,
    },
  },
});

await db.exercisePlan.deleteMany({
  where: { userId },
});

  const exercises = await db.exercise.findMany({
    where: {
      dysfunctionTargets: {
        has: dysfunctionType,
      },
    },
  });

  // Group exercises by their NASM phase.
  const byPhase = new Map<PhaseType, typeof exercises>();
  for (const phase of PHASE_ORDER) {
    byPhase.set(
      phase,
      exercises.filter((ex) => ex.phaseType === phase)
    );
  }

  const planId = await db.$transaction(async (tx) => {
    const plan = await tx.exercisePlan.create({
      data: {
        userId,
        assessmentId,
      },
    });

    for (let i = 0; i < PHASE_ORDER.length; i++) {
      const phaseType = PHASE_ORDER[i];
      const phaseExercises = byPhase.get(phaseType) ?? [];

      const phase = await tx.phase.create({
        data: {
          planId: plan.id,
          type: phaseType,
          order: i + 1,
        },
      });

      for (let j = 0; j < phaseExercises.length; j++) {
        await tx.planExercise.create({
          data: {
            phaseId: phase.id,
            exerciseId: phaseExercises[j].id,
            order: j + 1,
          },
        });
      }
    }

    return plan.id;
  });

  return planId;
}