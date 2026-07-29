import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DysfunctionType } from "@prisma/client";
import { buildPlanPreview } from "@/lib/assessment/buildPlanPreview";
import DiagnosisCard, { DIAGNOSIS } from "@/components/assessment/DiagnosisCard";
import PlanPreview from "@/components/assessment/PlanPreview";
import ConsentCheckbox from "@/components/legal/ConsentCheckbox";

const COOKIE_NAME = "unseat_pending_assessment";

type PendingAssessment = {
  answers: Record<string, boolean>;
  dysfunctionType: DysfunctionType;
  dysfunctionTypes?: DysfunctionType[];
};

export default async function AssessmentPreviewPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;

  if (!raw) {
    redirect("/assessment");
  }

  let pending: PendingAssessment;
  try {
    pending = JSON.parse(raw);
  } catch {
    redirect("/assessment");
  }

  const dysfunctionTypes: DysfunctionType[] =
    pending.dysfunctionTypes && pending.dysfunctionTypes.length > 0
      ? pending.dysfunctionTypes
      : pending.dysfunctionType !== DysfunctionType.NONE
      ? [pending.dysfunctionType]
      : [];

  // No database writes — read-only preview from the Exercise library.
  const preview = await buildPlanPreview({ dysfunctionTypes });

  // Build a friendly label for the consent checkbox copy.
  const dysfunctionLabel =
    dysfunctionTypes.length === 0
      ? "general mobility"
      : dysfunctionTypes.length === 1
      ? DIAGNOSIS[dysfunctionTypes[0]].title
      : dysfunctionTypes.map((d) => DIAGNOSIS[d].title).join(" + ");

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <DiagnosisCard dysfunctionTypes={dysfunctionTypes} />
        <PlanPreview groups={preview.groups} />
        <ConsentCheckbox dysfunctionLabel={dysfunctionLabel} />
      </div>
    </main>
  );
}
