// app/api/assessment/preview/route.ts

// No auth required.

// Parses OHSA answers, runs determineDysfunctions (returns array),

// confirms exercise library has matches, then saves to cookie and redirects.

//

// Cookie stores BOTH:

// dysfunctionType (singular, DysfunctionType) — backward compat for

// app/api/availability/route.ts

// which hasn't been updated yet

// dysfunctionTypes (array, DysfunctionType[]) — used by preview page

//

// This dual-storage approach means the availability route keeps working

// unchanged while the preview flow uses the full multi-syndrome array.

import { NextRequest, NextResponse } from "next/server";

import { DysfunctionType } from "@prisma/client";

import {

determineDysfunctions,

type AssessmentAnswers,

} from "@/lib/assessment/determineDysfunctions";

import { buildPlanPreview } from "@/lib/assessment/buildPlanPreview";

const COOKIE_NAME = "unseat_pending_assessment";

export async function POST(request: NextRequest) {

const formData = await request.formData();

const answers: AssessmentAnswers = {

feetTurnOut: formData.get("feetTurnOut") === "true",

kneesCaveIn: formData.get("kneesCaveIn") === "true",

excessiveLeanForward: formData.get("excessiveLeanForward") === "true",

lowBackArches: formData.get("lowBackArches") === "true",

armsFallForward: formData.get("armsFallForward") === "true",

roundedShoulders: formData.get("roundedShoulders") === "true",

headJutsForward: formData.get("headJutsForward") === "true",

};

// Returns DysfunctionType[] — can be empty, one, two, or all three syndromes.

const dysfunctionTypes = determineDysfunctions(answers);

// Read-only preview query — confirms exercises exist before committing to cookie.

await buildPlanPreview({ dysfunctionTypes });

// Primary syndrome for backward compat with the availability route.

// Picks the first detected syndrome, or NONE if nothing was flagged.

const primaryDysfunction: DysfunctionType =

dysfunctionTypes[0] ?? DysfunctionType.NONE;

const cookiePayload = JSON.stringify({

answers,

dysfunctionType: primaryDysfunction, // availability route reads this

dysfunctionTypes, // preview page reads this

});

const response = NextResponse.redirect(

new URL("/assessment/preview", request.url)

);

response.cookies.set(COOKIE_NAME, cookiePayload, {

httpOnly: true,

secure: process.env.NODE_ENV === "production",

sameSite: "lax",

path: "/",

maxAge: 60 * 30, // 30 minutes — survives the Google OAuth round-trip

});

return response;

}

