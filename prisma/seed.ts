// prisma/seed.ts

// YouTube links added for 9 confirmed exercises (searched live).

// All other videoUrl fields remain null.

// Run with: npx prisma db seed

import { PrismaClient, PhaseType } from "@prisma/client";

const prisma = new PrismaClient();

type ExerciseSeed = {

nasmKey: string;

name: string;

description: string;

videoUrl: string | null;

phaseType: PhaseType;

dysfunctionTargets: string[];

sets: number | null;

reps: number | null;

holdSeconds: number | null;

};

const exercises: ExerciseSeed[] = [

// ── UPPER CROSSED — INHIBIT ────────────────────────────────────────────

{

nasmKey: "UC_SMR_UPPER_TRAP",

name: "Upper trapezius SMR",

description:

"Place a foam roller or massage ball at the base of your neck, just above the shoulder. " +

"Slowly tilt your head away from the ball to increase pressure. " +

"Hold any tender spot for 30-45 seconds until you feel the tissue release. " +

"Do not roll aggressively — sustained gentle pressure is the goal.",

videoUrl: "https://www.youtube.com/watch?v=PTyuyiRF34g",

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "UC_SMR_LEVATOR_SCAP",

name: "Levator scapulae SMR",

description:

"Place a massage ball between your shoulder blade and spine, just below the neck. " +

"Lean into a wall to apply pressure. Gently rotate your head away from the ball. " +

"Hold any tender point for 30 seconds. " +

"This muscle runs from the top of the shoulder blade to the upper cervical spine.",

videoUrl: "https://www.youtube.com/watch?v=PTyuyiRF34g",

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "UC_SMR_PEC_MINOR",

name: "Pectoralis minor SMR",

description:

"Place a massage ball just below your collarbone, near the front of your shoulder. " +

"Lean gently into a wall or doorframe. Let your arm hang relaxed. " +

"Hold tender spots for 30 seconds. " +

"Pec minor is a primary driver of rounded shoulders and anterior shoulder tipping.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "UC_SMR_THORACIC_SPINE",

name: "Thoracic spine SMR",

description:

"Place a foam roller perpendicular to your spine at mid-back (T4-T8). " +

"Support your head with your hands, keep your hips on the floor. " +

"Slowly extend over the roller, pausing 1-2 seconds at each segment. " +

"Work from the bottom of the shoulder blades up to the base of the neck. " +

"Avoid rolling the lumbar spine.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["UPPER_CROSSED", "NONE"],

sets: 1,

reps: null,

holdSeconds: 60,

},

// ── UPPER CROSSED — LENGTHEN ───────────────────────────────────────────

{

nasmKey: "UC_STR_UPPER_TRAP",

name: "Upper trapezius static stretch",

description:

"Sit or stand tall. Reach one hand behind your back (or hold the edge of a chair). " +

"With your free hand, gently pull your ear toward your opposite shoulder. " +

"You should feel a stretch along the side of your neck. " +

"Hold 20-30 seconds each side. Do not shrug the elevated shoulder.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "UC_STR_PEC_MAJOR",

name: "Pectoralis major doorway stretch",

description:

"Stand in a doorway. Place both forearms on the door frame at 90 degrees. " +

"Step one foot forward and gently lean your chest through the doorway. " +

"You should feel a stretch across your chest and the front of your shoulders. " +

"Hold 20-30 seconds. Keep your chin tucked — do not let your head jut forward.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["UPPER_CROSSED", "NONE"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "UC_STR_CERVICAL_EXTENSORS",

name: "Cervical flexion stretch (suboccipital release)",

description:

"Sit tall. Perform a gentle chin tuck (draw chin straight back, not down). " +

"Then gently nod your head forward until you feel a stretch at the base of your skull. " +

"Place both hands lightly at the back of your head for a small overpressure if needed. " +

"Hold 20 seconds. This lengthens overactive cervical extensors and suboccipitals.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 20,

},

// ── UPPER CROSSED — ACTIVATE ───────────────────────────────────────────

{

nasmKey: "UC_ACT_CHIN_TUCK",

name: "Supine chin tuck",

description:

"Lie on your back with knees bent. Without lifting your head off the floor, " +

"draw your chin straight back (as if making a double chin). " +

"You should feel a gentle activation at the front of the deep neck. " +

"Hold 5 seconds, release fully, repeat. " +

"This directly activates the deep cervical flexors — the primary underactive muscle in Upper Crossed.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 2,

reps: 10,

holdSeconds: 5,

},

{

nasmKey: "UC_ACT_LOWER_TRAP_Y",

name: "Floor Y-raise (lower trapezius activation)",

description:

"Lie face down with arms extended overhead in a Y position, thumbs pointing up. " +

"Gently lift both arms a few inches off the floor by squeezing your shoulder blades " +

"down and together — not by shrugging. " +

"Hold 2 seconds at the top, lower with control. " +

"The movement is small. If you feel your upper traps dominating, reduce the range.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 2,

reps: 12,

holdSeconds: null,

},

{

nasmKey: "UC_ACT_WALL_ANGEL",

name: "Wall angel",

description:

"Stand with your back, head, and both arms against a wall. " +

"Bend elbows to 90 degrees so your arms form a goalpost shape. " +

"Slowly slide your arms up the wall overhead, then back down — " +

"keeping your wrists, elbows, and back of hands in contact with the wall throughout. " +

"Do not allow your lower back to arch away from the wall. " +

"This trains serratus anterior and lower trapezius simultaneously.",

videoUrl: "https://www.youtube.com/watch?v=1UU4VvklQ44",

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["UPPER_CROSSED", "NONE"],

sets: 2,

reps: 10,

holdSeconds: null,

},

{

nasmKey: "UC_ACT_BAND_ER",

name: "Banded external rotation",

description:

"Anchor a light resistance band at elbow height. Stand side-on to the anchor. " +

"Hold the band with your inside arm, elbow bent 90 degrees, tucked at your side. " +

"Keeping your elbow pinned, rotate your forearm outward away from your body. " +

"Return slowly with control. " +

"This isolates the infraspinatus and teres minor — key underactive muscles in Upper Crossed.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 2,

reps: 15,

holdSeconds: null,

},

// ── UPPER CROSSED — INTEGRATE ──────────────────────────────────────────

{

nasmKey: "UC_INT_FLOOR_IYT",

name: "Floor I-Y-T raise",

description:

"Lie face down with arms extended. Perform three movements in sequence: " +

"I — raise arms straight overhead (thumbs up); " +

"Y — raise arms at 45 degrees to form a Y; " +

"T — raise arms out to the side to form a T. " +

"Each position: lift 2 seconds, hold 1 second, lower 2 seconds. " +

"Focus on initiating each movement from the shoulder blades, not the neck.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["UPPER_CROSSED"],

sets: 2,

reps: 10,

holdSeconds: null,

},

{

nasmKey: "UC_INT_BAND_PULL_APART",

name: "Banded pull-apart with chin tuck",

description:

"Hold a light resistance band at shoulder height with both hands, palms down, " +

"arms extended in front of you. " +

"Perform a chin tuck, then pull the band apart horizontally until your arms are " +

"fully extended to each side. Squeeze the shoulder blades together at end range. " +

"Return slowly. Maintain the chin tuck throughout. " +

"This integrates deep cervical flexors with mid/lower trapezius in one movement.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["UPPER_CROSSED", "NONE"],

sets: 2,

reps: 12,

holdSeconds: null,

},

// ── LOWER CROSSED — INHIBIT ────────────────────────────────────────────

{

nasmKey: "LC_SMR_HIP_FLEXOR",

name: "Hip flexor SMR (TFL and rectus femoris)",

description:

"Lie face down. Place a foam roller under the front of one hip, just below the " +

"hip bone and slightly to the outside (targeting TFL and rectus femoris). " +

"Support yourself on your forearms and opposite foot. " +

"Slowly roll from the hip crease down 4-5 inches toward the knee. " +

"Pause at any tender spot for 30 seconds. " +

"Overactivity here pulls the pelvis into anterior tilt.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 45,

},

{

nasmKey: "LC_SMR_THORACOLUMBAR",

name: "Thoracolumbar erector SMR",

description:

"Lie on your back. Place a foam roller perpendicular to your spine at the level " +

"of your lower ribs. Keep your hips on the floor. " +

"Gently lean to one side to increase pressure on the erectors. " +

"Hold tender spots for 30 seconds. " +

"Do not roll the lumbar vertebrae directly — stay at and above L1.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "LC_SMR_GASTROC_SOLEUS",

name: "Calf SMR (gastrocnemius and soleus)",

description:

"Sit on the floor. Place a foam roller under your calf. " +

"Using your hands for support, lift your hips and roll slowly from just above " +

"the ankle to just below the back of the knee. " +

"Rotate your leg slightly inward and outward to cover the full muscle belly. " +

"Pause 30 seconds at any tender spot. " +

"Tight calves restrict dorsiflexion, driving compensatory forward lean.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["LOWER_CROSSED", "PRONATION_DISTORTION"],

sets: 1,

reps: null,

holdSeconds: 45,

},

// ── LOWER CROSSED — LENGTHEN ───────────────────────────────────────────

{

nasmKey: "LC_STR_HIP_FLEXOR_KNEELING",

name: "Kneeling hip flexor stretch",

description:

"Kneel on one knee (half-kneeling position). Tuck your tailbone under slightly " +

"(posterior pelvic tilt) — this is essential to isolate the hip flexor rather " +

"than just extending the lumbar spine. " +

"Shift your hips forward gently until you feel a stretch at the front of the " +

"back hip. Hold 30 seconds. Keep your torso upright. " +

"This is the single most important stretch for Lower Crossed Syndrome.",

videoUrl: "https://www.youtube.com/watch?v=Q4Ko275cluo",

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "LC_STR_RECTUS_FEMORIS",

name: "Prone rectus femoris stretch",

description:

"Lie face down. Bend one knee and grasp your ankle. " +

"Gently draw your heel toward your glute until you feel a stretch at the " +

"front of the thigh. " +

"Keep your hip pressed into the floor — do not let that hip lift. " +

"Hold 20-30 seconds each side. " +

"Rectus femoris crosses both the hip and knee and is frequently overactive in anterior pelvic tilt.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "LC_STR_GASTROC",

name: "Standing gastrocnemius stretch",

description:

"Stand facing a wall. Place both hands on the wall at shoulder height. " +

"Step one foot back, heel flat on the floor, toe pointed forward. " +

"Keep the back knee straight. Lean your hips slightly toward the wall. " +

"Hold 30 seconds. You should feel the stretch in the upper calf. " +

"A tight gastrocnemius restricts ankle dorsiflexion and drives heel rise.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["LOWER_CROSSED", "PRONATION_DISTORTION"],

sets: 1,

reps: null,

holdSeconds: 30,

},

// ── LOWER CROSSED — ACTIVATE ───────────────────────────────────────────

{

nasmKey: "LC_ACT_GLUTE_BRIDGE",

name: "Supine glute bridge",

description:

"Lie on your back, knees bent, feet flat and hip-width apart. " +

"Brace your deep core gently (as if preparing for a light punch). " +

"Squeeze your glutes and drive your hips up until your body forms a straight " +

"line from knees to shoulders. " +

"Hold the top for 2 seconds, lower slowly. " +

"Focus on feeling your glutes working — not your lower back. " +

"This is the primary activation exercise for gluteus maximus in Lower Crossed.",

videoUrl: "https://www.youtube.com/watch?v=wPM8icPu6H8",

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["LOWER_CROSSED", "NONE"],

sets: 2,

reps: 12,

holdSeconds: null,

},

{

nasmKey: "LC_ACT_DEAD_BUG",

name: "Dead bug",

description:

"Lie on your back. Raise arms straight up toward the ceiling. " +

"Raise knees to 90 degrees (tabletop position). " +

"Press your lower back firmly into the floor — maintain this throughout. " +

"Slowly lower your right arm and left leg toward the floor simultaneously, " +

"stopping just before your back peels away. Return and alternate. " +

"This directly activates transversus abdominis and multifidus — the deep core stabilisers that are underactive in Lower Crossed.",

videoUrl: "https://www.youtube.com/watch?v=g_BYB0R-4Ws",

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["LOWER_CROSSED", "NONE"],

sets: 2,

reps: 10,

holdSeconds: null,

},

{

nasmKey: "LC_ACT_FLOOR_COBRA",

name: "Floor cobra",

description:

"Lie face down, arms by your sides, palms facing the floor. " +

"Squeeze your glutes, then gently lift your chest a few inches off the floor. " +

"Simultaneously rotate your thumbs toward the ceiling (external rotation). " +

"Hold 2 seconds at the top, lower slowly. " +

"Keep your neck long — do not crank it back. " +

"This activates glute max and thoracic extensors while promoting lumbar neutral.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["LOWER_CROSSED"],

sets: 2,

reps: 12,

holdSeconds: null,

},

// ── LOWER CROSSED — INTEGRATE ──────────────────────────────────────────

{

nasmKey: "LC_INT_BODYWEIGHT_SQUAT",

name: "Bodyweight squat",

description:

"Stand with feet hip-width apart, toes pointed slightly outward (5-10 degrees). " +

"Arms extended forward for counterbalance. " +

"Push hips back and down, keeping your chest up and knees tracking over toes. " +

"Lower until thighs are parallel or slightly above. " +

"Drive through your heels to stand, squeezing glutes at the top. " +

"This integrates glute max, hamstrings, and deep core in the pattern that Lower Crossed directly disrupts.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["LOWER_CROSSED", "NONE"],

sets: 2,

reps: 12,

holdSeconds: null,

},

{

nasmKey: "LC_INT_REVERSE_LUNGE",

name: "Reverse lunge",

description:

"Stand tall. Step one foot back into a lunge, lowering your back knee toward " +

"the floor. Keep your front shin vertical and torso upright. " +

"The back hip should move into extension — you should feel your glute loading. " +

"Push through the front heel to return to standing. " +

"This integrates hip extensor strength with single-leg stability " +

"and challenges anterior pelvic tilt control under load.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["LOWER_CROSSED"],

sets: 2,

reps: 10,

holdSeconds: null,

},

// ── PRONATION DISTORTION — INHIBIT ────────────────────────────────────

{

nasmKey: "PD_SMR_PERONEALS",

name: "Peroneals SMR",

description:

"Sit on the floor. Place a foam roller or massage ball on the outside of your " +

"lower leg, just below the knee. " +

"Apply gentle pressure and slowly work down toward the ankle. " +

"Pause 30 seconds at any tender spot. " +

"The peroneals evert the foot — chronic overactivity collapses the medial arch and drives feet-turn-out.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["PRONATION_DISTORTION"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "PD_SMR_LATERAL_GASTROC",

name: "Lateral gastrocnemius SMR",

description:

"Sit on the floor. Place a foam roller under your calf, slightly to the outside. " +

"Cross the opposite ankle over to increase pressure. " +

"Slowly roll from the ankle to just below the knee, staying on the outer calf. " +

"Hold tender spots for 30 seconds. " +

"The lateral gastroc is frequently overactive in pronation distortion, contributing to both heel rise and foot external rotation.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["PRONATION_DISTORTION", "LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "PD_SMR_TFL",

name: "TFL SMR",

description:

"Lie on your side with a foam roller placed just below the hip bone " +

"(targeting TFL, not the IT band itself). " +

"Use your top foot and bottom arm for support and control. " +

"Hold any tender spot for 30 seconds. " +

"TFL overactivity drives hip internal rotation and knee valgus collapse.",

videoUrl: "https://www.youtube.com/watch?v=E2CmI2nIchE",

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["PRONATION_DISTORTION", "LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

// ── PRONATION DISTORTION — LENGTHEN ───────────────────────────────────

{

nasmKey: "PD_STR_SOLEUS",

name: "Soleus stretch (bent-knee calf stretch)",

description:

"Stand facing a wall, one foot back. Bend the back knee and push it forward " +

"over the toes while keeping the heel flat on the floor. " +

"Hold 30 seconds. You should feel a stretch lower in the calf than a straight-leg stretch. " +

"The soleus is the primary driver of dorsiflexion restriction at the ankle. " +

"Insufficient dorsiflexion is a root cause of compensatory pronation.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["PRONATION_DISTORTION"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "PD_STR_ADDUCTORS",

name: "Adductor stretch (standing side lunge)",

description:

"Stand with feet wide apart (wider than hip-width). " +

"Shift your weight to one side, bending that knee while keeping the other leg straight. " +

"Keep both feet flat on the floor, toes forward. " +

"Hold 20-30 seconds each side. " +

"Adductor overactivity contributes to knee valgus (caving in) during movement.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["PRONATION_DISTORTION"],

sets: 1,

reps: null,

holdSeconds: 30,

},

// ── PRONATION DISTORTION — ACTIVATE ───────────────────────────────────

{

nasmKey: "PD_ACT_TIB_ANTERIOR",

name: "Seated toe raise (tibialis anterior activation)",

description:

"Sit in a chair with feet flat on the floor. " +

"Keeping your heels down, lift your toes and the balls of your feet off the floor. " +

"Hold 2 seconds at the top, lower slowly. " +

"You should feel this along the front of your shin. " +

"Tibialis anterior is underactive in pronation distortion and must be strengthened to support the medial arch.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["PRONATION_DISTORTION"],

sets: 2,

reps: 15,

holdSeconds: null,

},

{

nasmKey: "PD_ACT_GLUTE_MED_CLAM",

name: "Side-lying clamshell",

description:

"Lie on your side with knees bent to 45 degrees and feet stacked. " +

"Keeping your feet together, rotate your top knee upward like a clamshell opening. " +

"Stop before your pelvis rolls back. Hold 2 seconds at the top, lower slowly. " +

"Feel the contraction in the side of your glute. " +

"Gluteus medius weakness is a direct cause of knee valgus during weight-bearing.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["PRONATION_DISTORTION", "LOWER_CROSSED"],

sets: 2,

reps: 15,

holdSeconds: null,

},

{

nasmKey: "PD_ACT_MEDIAL_CALF_RAISE",

name: "Single-leg medial calf raise",

description:

"Stand on one foot at the edge of a step, holding a wall lightly for balance. " +

"Rise onto your toes, focusing on pushing through the big toe side of your foot " +

"(not the little toe). Lower slowly over 3 seconds. " +

"This emphasises medial gastrocnemius and tibialis posterior, " +

"both underactive muscles that support the medial arch.",

videoUrl: null,

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["PRONATION_DISTORTION"],

sets: 2,

reps: 12,

holdSeconds: null,

},

// ── PRONATION DISTORTION — INTEGRATE ──────────────────────────────────

{

nasmKey: "PD_INT_SINGLE_LEG_SQUAT",

name: "Single-leg squat to box (assisted)",

description:

"Stand on one leg in front of a low box or chair. " +

"Slowly lower yourself toward the box, keeping your knee tracking directly " +

"over your second toe. Touch the box lightly, then stand back up. " +

"Use a wall for light balance support if needed. " +

"This integrates glute medius, tibialis anterior, and medial gastroc under single-leg loading — the pattern that breaks down in pronation distortion.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["PRONATION_DISTORTION"],

sets: 2,

reps: 8,

holdSeconds: null,

},

{

nasmKey: "PD_INT_LATERAL_BAND_WALK",

name: "Lateral band walk",

description:

"Place a light resistance band around both ankles. " +

"Stand with knees slightly bent, feet hip-width apart. " +

"Step sideways — lead foot steps out, trail foot follows, maintaining tension in the band. " +

"Keep your toes forward, knees slightly bent, and trunk upright. " +

"Take 10 steps each direction. " +

"This integrates gluteus medius activation with controlled pronation during gait.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["PRONATION_DISTORTION", "LOWER_CROSSED"],

sets: 2,

reps: 10,

holdSeconds: null,

},

// ── GENERAL MOBILITY (NONE) ────────────────────────────────────────────

{

nasmKey: "GEN_SMR_THORACIC",

name: "Thoracic spine SMR",

description:

"Place a foam roller perpendicular to your spine at mid-back (T4-T8). " +

"Support your head with your hands, keep your hips on the floor. " +

"Slowly extend over the roller, pausing 1-2 seconds at each segment. " +

"Work from the bottom of the shoulder blades up to the base of the neck. " +

"Avoid rolling the lumbar spine.",

videoUrl: null,

phaseType: PhaseType.INHIBIT,

dysfunctionTargets: ["NONE", "UPPER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 60,

},

{

nasmKey: "GEN_STR_90_90_HIP",

name: "90/90 hip stretch",

description:

"Sit on the floor with both knees bent to 90 degrees — one leg in front, " +

"one to the side (shin of front leg parallel to your body, shin of back leg " +

"pointing away). Sit tall and gently hinge forward from the hips over the front leg. " +

"Hold 30 seconds, then switch sides. " +

"This addresses internal and external hip rotation range of motion — a commonly restricted area in sedentary adults.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["NONE", "LOWER_CROSSED"],

sets: 1,

reps: null,

holdSeconds: 30,

},

{

nasmKey: "GEN_STR_THORACIC_ROTATION",

name: "Seated thoracic rotation",

description:

"Sit tall on a chair or the floor with arms crossed over your chest. " +

"Keeping your hips still, rotate your upper body as far as comfortable to one side. " +

"Hold 2 seconds, return to centre, rotate to the other side. " +

"Do not let your lower back twist — the movement comes from the mid-back. " +

"Thoracic rotation loss is one of the most common restrictions in desk workers.",

videoUrl: null,

phaseType: PhaseType.LENGTHEN,

dysfunctionTargets: ["NONE", "UPPER_CROSSED"],

sets: 1,

reps: 10,

holdSeconds: null,

},

{

nasmKey: "GEN_ACT_GLUTE_BRIDGE",

name: "Supine glute bridge",

description:

"Lie on your back, knees bent, feet flat and hip-width apart. " +

"Brace your deep core gently (as if preparing for a light punch). " +

"Squeeze your glutes and drive your hips up until your body forms a straight " +

"line from knees to shoulders. " +

"Hold the top for 2 seconds, lower slowly. " +

"Focus on feeling your glutes working — not your lower back.",

videoUrl: "https://www.youtube.com/watch?v=wPM8icPu6H8",

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["NONE", "LOWER_CROSSED"],

sets: 2,

reps: 12,

holdSeconds: null,

},

{

nasmKey: "GEN_ACT_DEAD_BUG",

name: "Dead bug",

description:

"Lie on your back. Raise arms straight up toward the ceiling. " +

"Raise knees to 90 degrees (tabletop position). " +

"Press your lower back firmly into the floor — maintain this throughout. " +

"Slowly lower your right arm and left leg toward the floor simultaneously, " +

"stopping just before your back peels away. Return and alternate.",

videoUrl: "https://www.youtube.com/watch?v=g_BYB0R-4Ws",

phaseType: PhaseType.ACTIVATE,

dysfunctionTargets: ["NONE", "LOWER_CROSSED"],

sets: 2,

reps: 10,

holdSeconds: null,

},

{

nasmKey: "GEN_INT_CAT_COW",

name: "Cat-cow",

description:

"Start on all fours — wrists under shoulders, knees under hips. " +

"Cow: inhale and let your belly drop, lifting your head and tailbone. " +

"Cat: exhale and round your entire spine toward the ceiling, " +

"tucking chin and pelvis. " +

"Move slowly and continuously, letting breath guide the movement. " +

"This integrates spinal flexion and extension through the full range — an ideal general mobility warm-up for sedentary adults.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["NONE", "LOWER_CROSSED", "UPPER_CROSSED"],

sets: 1,

reps: 10,

holdSeconds: null,

},

{

nasmKey: "GEN_INT_BODYWEIGHT_SQUAT",

name: "Bodyweight squat",

description:

"Stand with feet hip-width apart, toes pointed slightly outward (5-10 degrees). " +

"Arms extended forward for counterbalance. " +

"Push hips back and down, keeping your chest up and knees tracking over toes. " +

"Lower until thighs are parallel or slightly above. " +

"Drive through your heels to stand, squeezing glutes at the top.",

videoUrl: null,

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["NONE", "LOWER_CROSSED"],

sets: 2,

reps: 12,

holdSeconds: null,

},

{

nasmKey: "GEN_INT_WALL_ANGEL",

name: "Wall angel",

description:

"Stand with your back, head, and both arms against a wall. " +

"Bend elbows to 90 degrees so your arms form a goalpost shape. " +

"Slowly slide your arms up the wall overhead, then back down — " +

"keeping your wrists, elbows, and back of hands in contact with the wall throughout. " +

"Do not allow your lower back to arch away from the wall.",

videoUrl: "https://www.youtube.com/watch?v=1UU4VvklQ44",

phaseType: PhaseType.INTEGRATE,

dysfunctionTargets: ["NONE", "UPPER_CROSSED"],

sets: 2,

reps: 10,

holdSeconds: null,

},

];

async function main() {

console.log("Seeding Exercise table...\n");

for (const exercise of exercises) {

await prisma.exercise.upsert({

where: { nasmKey: exercise.nasmKey },

update: {

name: exercise.name,

description: exercise.description,

videoUrl: exercise.videoUrl,

dysfunctionTargets: exercise.dysfunctionTargets,

sets: exercise.sets,

reps: exercise.reps,

holdSeconds: exercise.holdSeconds,

},

create: exercise,

});

console.log(` OK ${exercise.nasmKey}`);

}

const total = exercises.length;

const withVideo = exercises.filter((e) => e.videoUrl !== null).length;

console.log(`\nDone. ${total} exercises upserted. ${withVideo} have YouTube links.`);

}

main()

.catch((e) => {

console.error("\nSeed failed:", e);

process.exit(1);

})

.finally(async () => {

await prisma.$disconnect();

});