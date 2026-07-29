import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const GOALS = [
  { value: "IMPROVE_MOBILITY", label: "Improve mobility" },
  { value: "REDUCE_STIFFNESS", label: "Reduce stiffness" },
  { value: "IMPROVE_POSTURE", label: "Improve posture" },
  { value: "INCREASE_DAILY_MOVEMENT", label: "Increase daily movement" },
  { value: "IMPROVE_ENERGY", label: "Improve energy" },
] as const;

export default async function OnboardingPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          What brings you here?
        </h1>
        <p className="text-gray-500 mb-6">
          Choose one or more goals. This helps shape your plan.
        </p>

        <form action="/api/onboarding" method="POST" className="space-y-3">
          {GOALS.map((goal) => (
            <label
              key={goal.value}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                name="goals"
                value={goal.value}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-gray-800 font-medium">{goal.label}</span>
            </label>
          ))}

          <button
            type="submit"
            className="w-full mt-6 rounded-lg bg-gray-900 px-4 py-2.5 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}