import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AvailabilityGrid from "@/components/onboarding/AvailabilityGrid";

export default async function AvailabilityPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          When are you free?
        </h1>
        <p className="text-gray-500 mb-6">
          Set a time window for each day you're available. Leave a day blank
          to skip it.
        </p>

        <form action="/api/availability" method="POST">
          <AvailabilityGrid />

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