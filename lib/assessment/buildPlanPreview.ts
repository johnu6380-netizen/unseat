// lib/assessment/buildPlanPreview.ts

// Read-only preview — NO database writes.

//

// Changes from previous version:

// - Accepts DysfunctionType[] instead of single DysfunctionType

// - Uses hasSome (not has) to match any detected syndrome

// - Deduplicates exercises by exercise.id (prevents double-listing shared exercises)

// - Groups into "Stretch" and "Strengthen" instead of 4 NASM phases:

// INHIBIT + LENGTHEN -> Stretch (releasing and elongating overactive muscles)

// ACTIVATE + INTEGRATE -> Strengthen (activating and loading underactive muscles)

import { DysfunctionType, PhaseType } from "@prisma/client";

import { db } from "@/lib/db";

type BuildPlanPreviewInput = {

dysfunctionTypes: DysfunctionType[];

};

type PreviewExercise = {

id: string;

name: string;

description: string;

videoUrl: string | null;

sets: number | null;

reps: number | null;

holdSeconds: number | null;

};

export type PreviewGroup = {

label: "Stretch" | "Strengthen";

exercises: PreviewExercise[];

};

export type PlanPreview = {

dysfunctionTypes: DysfunctionType[];

groups: PreviewGroup[];

};

const STRETCH_PHASES: PhaseType[] = [PhaseType.INHIBIT, PhaseType.LENGTHEN];

const STRENGTHEN_PHASES: PhaseType[] = [PhaseType.ACTIVATE, PhaseType.INTEGRATE];

export async function buildPlanPreview({

dysfunctionTypes,

}: BuildPlanPreviewInput): Promise<PlanPreview> {

// If no syndromes detected, query NONE exercises (general mobility plan).

const targetsToQuery: string[] =

dysfunctionTypes.length > 0

? dysfunctionTypes.map((d) => d.toString())

: [DysfunctionType.NONE.toString()];

const exercises = await db.exercise.findMany({

where: {

dysfunctionTargets: {

hasSome: targetsToQuery,

},

},

});

// Deduplicate by exercise.id.

// Exercises tagged for multiple syndromes (e.g. glute bridge tagged for

// both LOWER_CROSSED and NONE) must appear only once in the final plan.

const seen = new Set<string>();

const unique = exercises.filter((ex) => {

if (seen.has(ex.id)) return false;

seen.add(ex.id);

return true;

});

const toPreviewExercise = (

ex: (typeof unique)[number]

): PreviewExercise => ({

id: ex.id,

name: ex.name,

description: ex.description,

videoUrl: ex.videoUrl,

sets: ex.sets,

reps: ex.reps,

holdSeconds: ex.holdSeconds,

});

const stretchExercises = unique

.filter((ex) => STRETCH_PHASES.includes(ex.phaseType))

.map(toPreviewExercise);

const strengthenExercises = unique

.filter((ex) => STRENGTHEN_PHASES.includes(ex.phaseType))

.map(toPreviewExercise);

return {

dysfunctionTypes,

groups: [

{ label: "Stretch", exercises: stretchExercises },

{ label: "Strengthen", exercises: strengthenExercises },

],

};

}