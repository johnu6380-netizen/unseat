// app/assessment/page.tsx

// No auth required — this is the public entry point to the app.

// 7 questions matching the exact NASM OHSA compensation signs a CPT checks.

// heelsRise removed entirely.

const QUESTIONS = [

{

name: "feetTurnOut",

label: "Do your feet turn outward?",

},

{

name: "kneesCaveIn",

label: "Do your knees cave inward?",

},

{

name: "excessiveLeanForward",

label: "Do you lean forward excessively?",

},

{

name: "lowBackArches",

label: "Does your lower back arch excessively?",

},

{

name: "armsFallForward",

label: "Do your arms fall forward?",

},

{

name: "roundedShoulders",

label: "Are your shoulders rounded?",

},

{

name: "headJutsForward",

label: "Does your head jut forward?",

},

] as const;

export default function AssessmentPage() {

return (

<main className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4 py-12">

<div className="w-full max-w-lg rounded-2xl border border-[#DCE5D5] bg-white p-8 shadow-sm">

<h1 className="text-2xl font-bold text-[#2F3B2F] mb-2">

Quick movement check

</h1>

<p className="text-[#6B7A63] mb-6">

Answer based on what you notice during a bodyweight squat.

There is no wrong answer — just be honest.

</p>

<form

action="/api/assessment/preview"

method="POST"

className="space-y-5"

>

{QUESTIONS.map((q) => (

<fieldset

key={q.name}

className="rounded-xl border border-[#DCE5D5] px-4 py-3"

>

<legend className="text-[#2F3B2F] font-medium mb-2">

{q.label}

</legend>

<div className="flex gap-4">

<label className="flex items-center gap-2 cursor-pointer">

<input

type="radio"

name={q.name}

value="true"

required

className="h-4 w-4 accent-[#7C9A6B]"

/>

<span className="text-[#3D4A37]">Yes</span>

</label>

<label className="flex items-center gap-2 cursor-pointer">

<input

type="radio"

name={q.name}

value="false"

className="h-4 w-4 accent-[#7C9A6B]"

/>

<span className="text-[#3D4A37]">No</span>

</label>

</div>

</fieldset>

))}

<button

type="submit"

className="w-full mt-4 rounded-lg bg-[#7C9A6B] px-4 py-2.5 text-white font-medium hover:bg-[#6B8A5B] transition-colors"

>

See my results

</button>

</form>

</div>

</main>

);

}

