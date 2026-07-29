import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AvailabilityGrid from "@/components/onboarding/AvailabilityGrid";

const COOKIE_NAME = "unseat_pending_assessment";

export default async function AvailabilityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const pendingAssessment = cookieStore.get(COOKIE_NAME)?.value;

  if (!pendingAssessment) {
    redirect("/assessment");
  }

  return (
    <main className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-[#DCE5D5] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#2F3B2F] mb-2">
          When are you free?
        </h1>
        <p className="text-[#6B7A63] mb-1">
          Set one or more time windows for each day you&apos;re available.
        </p>
        <p className="text-xs text-[#8A9A7E] mb-6">
          Each window becomes its own short session. Leave all windows blank for
          a day to skip it.
        </p>

        <form action="/api/availability" method="POST">
          <AvailabilityGrid />

          <button
            type="submit"
            className="w-full mt-6 rounded-lg bg-[#7C9A6B] px-4 py-2.5 text-white font-medium hover:bg-[#6B8A5B] transition-colors"
          >
            Build my plan
          </button>
        </form>
      </div>
    </main>
  );
}
