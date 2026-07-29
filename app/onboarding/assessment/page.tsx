import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const QUESTIONS = [
  {
    name: "kneesCaveIn",
    label: "Do your knees cave inward (toward each other)?",
  },
  {
    name: "feetTurnOut",
    label: "Do your feet turn outward?",
  },
  {
    name: "armsFallForward",
    label: "Do your arms fall forward (below shoulder height)?",
  },
  {
    name: "excessiveLeanForward",
    label: "Do you lean excessively forward at the torso?",
  },
  {
    name: "heelsRise",
    label: "Do your heels rise off the floor?",
  },
  {
    name: "lowBackArches",
    label: "Does your lower back arch excessively?",
  },
] as const;

export default async function AssessmentPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quick movement check
        </h1>
        <p className="text-gray-500 mb-6">
          Answer based on what you notice during a bodyweight squat. There's
          no wrong answer — just be honest.
        </p>

        <form action="/api/assessment" method="POST" className="space-y-5">
          {QUESTIONS.map((q) => (
            <fieldset
              key={q.name}
              className="rounded-lg border border-gray-200 px-4 py-3"
            >
              <legend className="text-gray-800 font-medium mb-2">
                {q.label}
              </legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={q.name}
                    value="true"
                    required
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={q.name}
                    value="false"
                    className="h-4 w-4 text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </fieldset>
          ))}

          <button
            type="submit"
            className="w-full mt-4 rounded-lg bg-gray-900 px-4 py-2.5 text-white font-medium hover:bg-gray-800 transition-colors"
          >
            See my results
          </button>
        </form>
      </div>
    </main>
  );
}