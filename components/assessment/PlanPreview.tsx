// components/assessment/PlanPreview.tsx

// Renders the corrective routine as two groups: Stretch and Strengthen.

// Props updated from phases[] to groups[] to match buildPlanPreview output.

type PreviewExercise = {

id: string;

name: string;

sets: number | null;

reps: number | null;

holdSeconds: number | null;

};

type PreviewGroup = {

label: "Stretch" | "Strengthen";

exercises: PreviewExercise[];

};

type PlanPreviewProps = {

groups: PreviewGroup[];

};

export default function PlanPreview({ groups }: PlanPreviewProps) {

return (

<div className="rounded-2xl border border-[#DCE5D5] bg-white p-6 shadow-sm">

<h2 className="text-sm font-semibold uppercase tracking-wide text-[#8A9A7E] mb-4">

Your corrective routine

</h2>

<div className="space-y-6">

{groups.map((group) => (

<div key={group.label}>

<p className="text-sm font-semibold text-[#5C7A52] mb-2">

{group.label}

</p>

{group.exercises.length === 0 ? (

<p className="text-xs text-[#8A9A7E]">

No exercises for this category.

</p>

) : (

<ul className="space-y-2">

{group.exercises.map((ex) => (

<li key={ex.id} className="flex items-start gap-2">

<span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#A9C29A] flex-shrink-0" />

<div>

<p className="text-sm text-[#3D4A37]">{ex.name}</p>

<p className="text-xs text-[#8A9A7E]">

{ex.sets != null &&

`${ex.sets} set${ex.sets > 1 ? "s" : ""}`}

{ex.sets != null &&

(ex.reps != null || ex.holdSeconds != null) &&

" · "}

{ex.reps != null && `${ex.reps} reps`}

{ex.reps == null &&

ex.holdSeconds != null &&

`${ex.holdSeconds} sec hold`}

</p>

</div>

</li>

))}

</ul>

)}

</div>

))}

</div>

</div>

);

}

