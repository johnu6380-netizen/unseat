import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  determineDysfunction,
  type AssessmentAnswers,
} from "@/lib/assessment/determineDysfunction";
import { buildExercisePlan } from "@/lib/plan/buildExercisePlan";
import { generateWorkSessions } from "@/lib/schedule/generateWorkSessions";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const answers: AssessmentAnswers = {
    kneesCaveIn: formData.get("kneesCaveIn") === "true",
    feetTurnOut: formData.get("feetTurnOut") === "true",
    armsFallForward: formData.get("armsFallForward") === "true",
    excessiveLeanForward: formData.get("excessiveLeanForward") === "true",
    heelsRise: formData.get("heelsRise") === "true",
    lowBackArches: formData.get("lowBackArches") === "true",
  };

  const dysfunctionType = determineDysfunction(answers);

  // 1. Save the assessment.
  const assessment = await db.assessment.create({
    data: {
      userId: session.user.id,
      answers,
      dysfunctionType,
    },
  });

  // 2. Build the deterministic exercise plan from the diagnosis.
  const planId = await buildExercisePlan({
    userId: session.user.id,
    assessmentId: assessment.id,
    dysfunctionType,
  });

  // 3. Generate work sessions from the user's availability.
  await generateWorkSessions({
    userId: session.user.id,
    planId,
  });

  // 4. Onboarding is now genuinely complete — goals, availability,
  //    assessment, plan, and sessions all exist.
  await db.user.update({
    where: { id: session.user.id },
    data: { onboardingDone: true },
  });

  // 5. No intermediate screens. Straight to the dashboard.
  return NextResponse.redirect(new URL("/", request.url));
}