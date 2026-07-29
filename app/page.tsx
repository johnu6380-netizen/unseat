import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const DYSFUNCTION_LABELS: Record<string, string> = {
  UPPER_CROSSED: "Upper Crossed Syndrome",
  LOWER_CROSSED: "Lower Crossed Syndrome",
  PRONATION_DISTORTION: "Pronation Distortion Syndrome",
  NONE: "No Dominant Pattern",
};

const PHASE_LABELS: Record<string, string> = {
  INHIBIT: "Inhibit",
  LENGTHEN: "Lengthen",
  ACTIVATE: "Activate",
  INTEGRATE: "Integrate",
};

// ─── Landing page (unauthenticated) ────────────────────────────────────────

function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <span className="text-[#2F3B2F] font-bold text-lg tracking-tight">
          Unseat
        </span>
        <Link
          href="/login"
          className="text-sm text-[#6B7A63] hover:text-[#2F3B2F] transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-24">

        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A9A7E] mb-5">
          Corrective exercise · Built for desk workers
        </p>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#2F3B2F] leading-tight max-w-xl mb-5">
          Your body is holding patterns
          <br />
          <span className="text-[#7C9A6B]">you haven&apos;t noticed yet.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-[#6B7A63] text-lg max-w-md mb-10 leading-relaxed">
          Answer 6 quick questions about how you move. We&apos;ll build a
          personalized corrective routine and put it on your calendar
          automatically — no gym required.
        </p>

        {/* Primary CTA */}
        <Link
          href="/assessment"
          className="inline-block rounded-xl bg-[#7C9A6B] px-10 py-4 text-white text-lg font-semibold shadow-md hover:bg-[#6B8A5B] hover:shadow-lg active:scale-[0.98] transition-all duration-150"
        >
          Start moving better
        </Link>

        <p className="text-xs text-[#A9B89E] mt-4">
          Takes about 90 seconds. No equipment needed.
        </p>
      </section>

      {/* Three-point trust strip */}
      <section className="bg-white border-t border-[#E8EDE4] py-10 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-2xl mb-2">🧠</p>
            <p className="text-sm font-semibold text-[#2F3B2F] mb-1">
              NASM-based protocols
            </p>
            <p className="text-xs text-[#8A9A7E] leading-relaxed">
              Exercise selection follows the NASM Corrective Exercise
              Continuum — the same framework used by certified personal
              trainers.
            </p>
          </div>
          <div>
            <p className="text-2xl mb-2">📅</p>
            <p className="text-sm font-semibold text-[#2F3B2F] mb-1">
              Auto-scheduled sessions
            </p>
            <p className="text-xs text-[#8A9A7E] leading-relaxed">
              Tell us when you&apos;re free. We&apos;ll create calendar events
              so your sessions are already planned before you have a chance
              to skip them.
            </p>
          </div>
          <div>
            <p className="text-2xl mb-2">🏠</p>
            <p className="text-sm font-semibold text-[#2F3B2F] mb-1">
              No equipment required
            </p>
            <p className="text-xs text-[#8A9A7E] leading-relaxed">
              Every exercise can be done at a desk, on a floor, or against a
              wall. Designed for people who don&apos;t have a gym.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 px-6 text-center border-t border-[#E8EDE4]">
        <p className="text-xs text-[#A9B89E]">
          © {new Date().getFullYear()} Unseat &nbsp;·&nbsp;
          <Link href="/terms" className="hover:text-[#6B7A63] transition-colors">
            Terms
          </Link>
          &nbsp;·&nbsp;
          <Link href="/privacy" className="hover:text-[#6B7A63] transition-colors">
            Privacy
          </Link>
        </p>
      </footer>

    </main>
  );
}

// ─── Dashboard (authenticated + onboarding complete) ───────────────────────

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <LandingPage />;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.onboardingDone) {
    redirect("/assessment");
  }

  const [nextSession, totalSessions, completedSessions, latestAssessment] =
    await Promise.all([
      db.workSession.findFirst({
        where: { userId: user.id, completed: false },
        orderBy: { scheduledAt: "asc" },
      }),
      db.workSession.count({ where: { userId: user.id } }),
      db.workSession.count({ where: { userId: user.id, completed: true } }),
      db.assessment.findFirst({
        where: { userId: user.id },
        orderBy: { completedAt: "desc" },
      }),
    ]);

  const nextSessionExercises =
    nextSession && nextSession.exerciseIds.length > 0
      ? await db.exercise.findMany({
          where: { id: { in: nextSession.exerciseIds } },
        })
      : [];

  // Preserve phase order — exerciseIds was stored in phase order at generation
  // time, so re-sorting by that array gives the correct sequence back.
  const orderedNextSessionExercises = nextSession
    ? nextSession.exerciseIds
        .map((id) => nextSessionExercises.find((ex) => ex.id === id))
        .filter((ex): ex is NonNullable<typeof ex> => Boolean(ex))
    : [];

  // Group by phaseType. Using a typed initial value instead of a generic
  // annotation on .reduce to avoid Turbopack's JSX/generic parser ambiguity.
  type ExerciseGroup = typeof orderedNextSessionExercises;
  const groupedByPhase = orderedNextSessionExercises.reduce(
    (acc: Record<string, ExerciseGroup>, ex) => {
      if (!acc[ex.phaseType]) acc[ex.phaseType] = [];
      acc[ex.phaseType].push(ex);
      return acc;
    },
    {}
  );

  const dysfunctionLabel = latestAssessment
    ? (DYSFUNCTION_LABELS[latestAssessment.dysfunctionType] ??
      latestAssessment.dysfunctionType)
    : null;

  const progressPercent =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2F3B2F] mb-1">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}.
          </h1>
          {dysfunctionLabel && (
            <p className="text-[#6B7A63]">
              Focus area: {dysfunctionLabel}
            </p>
          )}
        </div>

        {/* Next session card */}
        <div className="mb-6 rounded-2xl border border-[#DCE5D5] bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8A9A7E] mb-4">
            Next session
          </h2>

          {nextSession ? (
            <div>
              <p className="text-xl font-semibold text-[#2F3B2F] mb-1">
                {nextSession.scheduledAt.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-[#6B7A63] mb-4">
                {nextSession.scheduledAt.toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "2-digit",
                })}{" "}
                · {nextSession.durationMins} min
              </p>

              <div className="rounded-xl bg-[#EEF3E8] px-4 py-3 mb-4">
                <p className="text-sm text-[#4A5A42]">{nextSession.message}</p>
              </div>

              {Object.keys(groupedByPhase).length > 0 && (
                <div className="space-y-4 mb-5">
                  {Object.entries(groupedByPhase).map(([phaseType, exs]) => (
                    <div key={phaseType}>
                      <p className="text-xs font-semibold text-[#5C7A52] uppercase tracking-wide mb-1">
                        {PHASE_LABELS[phaseType] ?? phaseType}
                      </p>
                      <ul className="space-y-1">
                        {exs.map((ex) => (
                          <li
                            key={ex.id}
                            className="text-sm text-[#3D4A37] flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#A9C29A] flex-shrink-0" />
                            {ex.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <form action="/api/session/complete" method="POST">
                <input
                  type="hidden"
                  name="workSessionId"
                  value={nextSession.id}
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#7C9A6B] px-4 py-2.5 text-white font-medium hover:bg-[#6B8A5B] transition-colors"
                >
                  Mark session complete
                </button>
              </form>
            </div>
          ) : (
            <p className="text-[#8A9A7E]">No upcoming sessions scheduled.</p>
          )}
        </div>

        {/* Progress card */}
        <div className="rounded-2xl border border-[#DCE5D5] bg-white p-6 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#8A9A7E] mb-4">
            Progress
          </h2>

          <div className="flex items-center justify-between mb-3">
            <p className="text-[#2F3B2F] font-medium">
              {completedSessions} of {totalSessions} sessions completed
            </p>
            <p className="text-[#6B7A63] text-sm">{progressPercent}%</p>
          </div>

          <div className="h-2 w-full rounded-full bg-[#EEF3E8]">
            <div
              className="h-2 rounded-full bg-[#8FAE7B] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>
    </main>
  );
}