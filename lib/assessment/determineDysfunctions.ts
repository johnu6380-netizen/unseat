// lib/assessment/determineDysfunctions.ts

// NEW FILE — replaces determineDysfunction (singular).

// Returns ALL detected dysfunction patterns, not just one.

// This is clinically correct: a client can present with multiple syndromes simultaneously.

import { DysfunctionType } from "@prisma/client";

export type AssessmentAnswers = {

feetTurnOut: boolean;

kneesCaveIn: boolean;

excessiveLeanForward: boolean;

lowBackArches: boolean;

armsFallForward: boolean;

roundedShoulders: boolean;

headJutsForward: boolean;

};

/**

* NASM CPT OHSA dysfunction rules — deterministic, no AI.

*

* PRONATION_DISTORTION (flat feet, collapsed arches, knee valgus)

* Signs: feetTurnOut OR kneesCaveIn

* Overactive: Gastrocnemius, soleus, peroneals, adductors, TFL, IT-band

* Underactive: Anterior tibialis, posterior tibialis, gluteus medius, gluteus maximus

*

* LOWER_CROSSED (anterior pelvic tilt, excessive lumbar lordosis)

* Signs: excessiveLeanForward OR lowBackArches

* Overactive: Iliopsoas, rectus femoris, erector spinae, TFL, piriformis, adductors

* Underactive: Gluteus maximus, gluteus medius, rectus abdominis, internal obliques

*

* UPPER_CROSSED (forward head posture, protracted rounded shoulders)

* Signs: armsFallForward OR roundedShoulders OR headJutsForward

* Overactive: Pectoralis major/minor, latissimus dorsi, upper trapezius, levator scapulae, SCM

* Underactive: Deep cervical flexors, rhomboids, mid/lower trapezius, serratus anterior

*

* Returns an empty array if no compensations noted.

* Callers should treat [] the same as [NONE] for exercise selection purposes.

*/

export function determineDysfunctions(

answers: AssessmentAnswers

): DysfunctionType[] {

const result: DysfunctionType[] = [];

if (answers.feetTurnOut || answers.kneesCaveIn) {

result.push(DysfunctionType.PRONATION_DISTORTION);

}

if (answers.excessiveLeanForward || answers.lowBackArches) {

result.push(DysfunctionType.LOWER_CROSSED);

}

if (answers.armsFallForward || answers.roundedShoulders || answers.headJutsForward) {

result.push(DysfunctionType.UPPER_CROSSED);

}

return result;

}