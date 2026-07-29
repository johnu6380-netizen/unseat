import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Goal } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const selectedGoals = formData.getAll("goals") as string[];

  const validGoals = selectedGoals.filter(
    (goal): goal is Goal => goal in Goal
  );

  await Promise.all(
    validGoals.map((goal) =>
      db.userGoal.upsert({
        where: {
          userId_goal: {
            userId: session.user.id,
            goal,
          },
        },
        update: {},
        create: {
          userId: session.user.id,
          goal,
        },
      })
    )
  );



  return NextResponse.redirect(
    new URL("/onboarding/availability", request.url)
  );
}