// components/assessment/DiagnosisCard.tsx

// Updated to accept dysfunctionTypes: DysfunctionType[] (array).

// Renders one block per detected syndrome, or the NONE explanation if empty.

import { DysfunctionType } from "@prisma/client";

type DiagnosisCopy = {

title: string;

explanation: string;

};

export const DIAGNOSIS: Record<DysfunctionType, DiagnosisCopy> = {

UPPER_CROSSED: {

title: "Upper Crossed Syndrome",

explanation:

"Forward head posture and protracted, rounded shoulders. " +

"Overactive chest and neck muscles are pulling your shoulders forward " +

"and your head out of alignment.",

},

LOWER_CROSSED: {

title: "Lower Crossed Syndrome",

explanation:

"An anterior pelvic tilt and excessive lumbar lordosis. " +

"Tight hip flexors and lower back are pulling your pelvis forward, " +

"switching off your glutes and core.",

},

PRONATION_DISTORTION: {

title: "Pronation Distortion Syndrome",

explanation:

"Flat feet, collapsed arches, and knee valgus. " +

"Your feet roll inward under load, driving your knees to cave — " +

"a pattern rooted in tight calves and weak hips.",

},

NONE: {

title: "No Dominant Pattern",

explanation:

"We did not detect a strong compensation pattern. " +

"A general mobility routine will help keep things that way.",

},

};

type DiagnosisCardProps = {

dysfunctionTypes: DysfunctionType[];

};

export default function DiagnosisCard({ dysfunctionTypes }: DiagnosisCardProps) {

// No syndromes detected — show the NONE fallback

if (dysfunctionTypes.length === 0) {

const { title, explanation } = DIAGNOSIS[DysfunctionType.NONE];

return (

<div className="rounded-2xl border border-[#DCE5D5] bg-white p-6 shadow-sm">

<p className="text-sm text-[#8A9A7E] mb-1">Based on your answers</p>

<h1 className="text-2xl font-bold text-[#2F3B2F] mb-3">{title}</h1>

<p className="text-[#5C6B54]">{explanation}</p>

</div>

);

}

return (

<div className="rounded-2xl border border-[#DCE5D5] bg-white p-6 shadow-sm">

<p className="text-sm text-[#8A9A7E] mb-3">Based on your answers</p>

<div className="space-y-4">

{dysfunctionTypes.map((dt) => {

const { title, explanation } = DIAGNOSIS[dt];

return (

<div key={dt}>

<h2 className="text-xl font-bold text-[#2F3B2F] mb-1">

{title}

</h2>

<p className="text-[#5C6B54] text-sm">{explanation}</p>

</div>

);

})}

</div>

</div>

);

}

