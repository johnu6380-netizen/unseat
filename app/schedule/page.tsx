import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const PHASE_LABELS: Record<string, string> = {
  INHIBIT: "Inhibit",
  LENGTHEN: "Lengthen",
  ACTIVATE: "Activate",
  INTEGRATE: "Integrate",
};

export default async function SchedulePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const workSessions = await db.workSession.findMany({
    where: { userId: session.user.id },
    orderBy: { scheduledAt: "asc" },
  });

  const allExerciseIds = Array.from(
    new Set(workSessions.flatMap((ws) => ws.exerciseIds))
  );

  const exercises = await db.exercise.findMany({
    where: { id: { in: allExerciseIds } },
  });

  const exerciseById = new Map(exercises.map((ex) => [ex.id, ex]));

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-[#2F3B2F] mb-6">
          Your Schedule
        </h1>

        {workSessions.length === 0 ? (
          <p className="text-[#8A9A7E]">No sessions scheduled yet.</p>
        ) : (
          <div className="space-y-4">
            {workSessions.map((ws) => {
              const date = ws.scheduledAt.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
              });
              const time = ws.scheduledAt.toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              });

              const sessionExercises = ws.exerciseIds
                .map((id) => exerciseById.get(id))
                .filter((ex): ex is NonNullable<typeof ex> => ex !== undefined);

              // Group by phaseType using typed initial value to avoid
              // Turbopack's JSX/generic parser ambiguity on .reduce<T>().
              type ExGroup = typeof sessionExercises;
              const groupedByPhase = sessionExercises.reduce(
                (acc: Record<string, ExGroup>, ex) => {
                  if (!acc[ex.phaseType]) acc[ex.phaseType] = [];
                  acc[ex.phaseType].push(ex);
                  return acc;
                },
                {}
              );

              return (
                <div
                  key={ws.id}
                  className="rounded-2xl border border-[#DCE5D5] bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-[#2F3B2F]">{date}</p>
                      <p className="text-sm text-[#6B7A63]">
                        {time} · {ws.durationMins} min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {ws.googleEventId ? (
                        <span className="rounded-full bg-[#EEF3E8] px-3 py-1 text-xs font-medium text-[#5C7A52]">
                          On calendar
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
                          Pending sync
                        </span>
                      )}
                      {ws.completed && (
                        <span className="rounded-full bg-[#EEF3E8] px-3 py-1 text-xs font-medium text-[#5C7A52]">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {Object.keys(groupedByPhase).length > 0 ? (
                    <div className="space-y-3">
                      {Object.entries(groupedByPhase).map(([phaseType, exs]) => (
                        <div key={phaseType}>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#8A9A7E] mb-1">
                            {PHASE_LABELS[phaseType] ?? phaseType}
                          </p>
                          <ul className="space-y-0.5">
                            {exs.map((ex) => (
                              <li key={ex.id} className="text-sm text-[#3D4A37]">
                                {ex.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#A9B89E]">
                      No exercises assigned — re-run availability to regenerate.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
