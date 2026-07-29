import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const workSessionId = formData.get("workSessionId") as string | null;

  if (!workSessionId) {
    return NextResponse.json(
      { error: "Missing workSessionId" },
      { status: 400 }
    );
  }

  const workSession = await db.workSession.findFirst({
    where: { id: workSessionId, userId: session.user.id },
  });

  if (!workSession) {
    return NextResponse.json(
      { error: "Session not found" },
      { status: 404 }
    );
  }

  await db.workSession.update({
    where: { id: workSessionId },
    data: {
      completed: true,
      completedAt: new Date(),
    },
  });

  return NextResponse.redirect(new URL("/", request.url));
}