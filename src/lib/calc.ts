import type {
  DogProfile,
  LifeStage,
  Protein,
  Recommendation,
  SizeKey,
  Tier,
} from "../types";
import { getBreed } from "../data/breeds";
import {
  RECIPES,
  ORDERABLE_PROTEINS,
  kcalPerGram,
} from "../data/recipes";
import { ACTIVITY_OPTIONS, SERIOUS_CONDITIONS } from "../data/health";
import { PLANS, PUPPY_PLAN, SLEEVE_GRAMS, productUrl } from "../data/plans";
import { mealCartUrl, type VariantProtein } from "../data/variants";

/* ---------------------------------------------------------------------------
   Nutrition engine (vet-style estimates, client-side).

   RER  = 70 * (kg ^ 0.75)
   MER  = factor * RER          (Merck Veterinary Manual factors)
   grams/day = MER / recipe kcal-per-gram

   Weight-loss / gain math runs on the GOAL weight, not the current weight.
   BCS (1–9) drives the plan tier. Allergies filter the recipe set; if every
   recipe is ruled out, recipeAvailable=false and no checkout is offered.
   These are healthy-estimate starting points, not a medical prescription.
--------------------------------------------------------------------------- */

const LB_PER_KG = 2.20462;

export function lifeStage(ageMonths: number | null): LifeStage {
  if (ageMonths == null) return "adult";
  if (ageMonths < 12) return "puppy";
  if (ageMonths >= 96) return "senior"; // ~8y+
  return "adult";
}

export function resolveSize(profile: DogProfile): SizeKey {
  const breed = getBreed(profile.breedId);
  if (breed) return breed.size;
  if (profile.sizeOverride) return profile.sizeOverride;
  return sizeFromWeight(profile.weightKg ?? 12);
}

/** Size bands match The Bloo Club's real pound ranges, mapped to kg. */
export function sizeFromWeight(kg: number): SizeKey {
  const lb = kg * LB_PER_KG;
  if (lb <= 10) return "xs";
  if (lb <= 19) return "s";
  if (lb <= 49) return "m";
  return "l";
}

export function planLabel(size: SizeKey, isPuppy: boolean): string {
  return isPuppy ? PUPPY_PLAN.name : PLANS[size].name;
}

export function tierFromBcs(bcs: number): Tier {
  if (bcs <= 3) return "underweight";
  if (bcs >= 6) return "weightControl";
  return "balanced";
}

/** Rough ideal weight when the owner didn't give a goal (~10% per BCS point). */
function estimateIdealWeight(currentKg: number, bcs: number): number {
  const over = 1 + 0.1 * (bcs - 5);
  return +(currentKg / over).toFixed(1);
}

/** Weight the calorie math runs on: goal weight when losing/gaining. */
function calcWeight(profile: DogProfile, bcs: number): number {
  const current = profile.weightKg ?? 12;
  if (bcs >= 6)
    return profile.goalWeightKg ?? estimateIdealWeight(current, bcs);
  if (bcs <= 3) return profile.goalWeightKg ?? current;
  return current;
}

/** MER multiplier (Merck factors) + activity + BCS adjustments. */
function energyFactor(
  profile: DogProfile,
  stage: LifeStage,
  bcs: number,
  warnings: string[]
): number {
  if (stage === "puppy") {
    const m = profile.ageMonths ?? 6;
    return m < 4 ? 3.0 : 2.0; // Merck: <4mo 3×, >4mo 2×
  }

  let f: number;
  if (bcs >= 8) {
    f = 1.2; // active, supervised weight loss
    warnings.push(
      "Peso elevado (BCS 8–9): porción de pérdida supervisada. Confirma el ritmo con tu veterinario."
    );
  } else if (bcs >= 6) {
    f = 1.4; // obesity-prone / weight control
  } else if (stage === "senior") {
    f = 1.4;
  } else {
    f = profile.neutered ? 1.6 : 1.8; // Merck adult neutered / intact
  }

  if (bcs <= 3) f += 0.2; // underweight: extra to gain

  const act = ACTIVITY_OPTIONS.find((a) => a.key === profile.activity);
  if (act && bcs < 6) f += act.delta; // don't add energy while slimming

  return Math.max(1.0, f);
}

function defaultMeals(stage: LifeStage): number {
  return stage === "puppy" ? 3 : 2;
}

function round5(n: number): number {
  return Math.round(n / 5) * 5;
}

/** Orderable recipes whose ingredients clear the dog's allergies. */
function safeRecipes(profile: DogProfile): Protein[] {
  const bad = new Set(profile.allergens);
  return ORDERABLE_PROTEINS.filter(
    (p) => !RECIPES[p].allergens.some((a) => bad.has(a))
  );
}

function pickRecipe(
  profile: DogProfile,
  bcs: number,
  pool: Protein[]
): { recipe: Protein; alt: Protein; blend: string | null; reason: string } {
  const has = (p: Protein) => pool.includes(p);
  const altOf = (r: Protein) =>
    pool.find((p) => p !== r && p !== profile.dislike) ?? pool.find((p) => p !== r) ?? r;
  const usable = pool.filter((p) => p !== profile.dislike).length
    ? pool.filter((p) => p !== profile.dislike)
    : pool;

  // 1) Explicit favorite that's still available.
  if (profile.prefer && has(profile.prefer))
    return {
      recipe: profile.prefer,
      alt: altOf(profile.prefer),
      blend: null,
      reason: `Elegimos ${RECIPES[profile.prefer].name} porque es su proteína favorita.`,
    };

  const conds = new Set(profile.conditions);
  const sensitive =
    profile.sensitiveStomach ||
    profile.goal === "digestion" ||
    conds.has("diarrhea") ||
    conds.has("pancreatitis") ||
    /sensib|gastr|estomag|estóma|diarre|digest/.test(profile.health.toLowerCase());

  // 2) Sensitive stomach / skin / coat → Lamb (gentle, novel protein).
  if ((sensitive || profile.goal === "skin" || conds.has("skin")) && usable.includes("lamb"))
    return {
      recipe: "lamb",
      alt: altOf("lamb"),
      blend: null,
      reason:
        "Cordero: receta suave y novel, ideal para digestión sensible, piel y pelaje.",
    };

  // 3) Losing weight / overweight → Chicken (lean everyday).
  if ((profile.goal === "lose" || bcs >= 6) && usable.includes("chicken"))
    return {
      recipe: "chicken",
      alt: altOf("chicken"),
      blend: null,
      reason: "Pollo: magro y liviano, perfecto para el control de peso.",
    };

  // 4) Gaining / very active → Beef (rich, iron, energy).
  if (
    (profile.goal === "gain" ||
      bcs <= 3 ||
      profile.activity === "high" ||
      profile.activity === "working") &&
    usable.includes("beef")
  )
    return {
      recipe: "beef",
      alt: altOf("beef"),
      blend: null,
      reason: "Res: hierro y energía extra para ganar condición o gran actividad.",
    };

  // 5) No constraints → variety blend.
  if (!profile.prefer && !profile.dislike && !profile.picky && profile.allergens.length === 0)
    return {
      recipe: "chicken",
      alt: "beef",
      blend: "Equal Parts Chicken · Beef · Lamb",
      reason:
        "Sin restricciones: la mezcla a partes iguales (pollo · res · cordero) da variedad y un perfil completo.",
    };

  // 6) Sensible default.
  const recipe = usable[0];
  return {
    recipe,
    alt: altOf(recipe),
    blend: null,
    reason: `${RECIPES[recipe].name}: receta balanceada y bien tolerada.`,
  };
}

export function buildRecommendation(profile: DogProfile): Recommendation {
  const stage = lifeStage(profile.ageMonths);
  const isPuppy = stage === "puppy";
  const size = resolveSize(profile);
  const plan = PLANS[size];
  const bcs = profile.bcs;
  const tier = tierFromBcs(bcs);
  const warnings: string[] = [];

  const calcKg = calcWeight(profile, bcs);
  const rer = 70 * Math.pow(calcKg, 0.75);
  const factor = energyFactor(profile, stage, bcs, warnings);
  const kcalPerDay = Math.round(rer * factor);

  const medicalReview = profile.conditions.some((c) => SERIOUS_CONDITIONS.has(c));

  const pool = safeRecipes(profile);
  const meals =
    profile.mealsPerDay ?? defaultMeals(stage);

  // No recipe clears the allergies → no checkout, prompt to contact support.
  if (pool.length === 0) {
    warnings.push(
      "Con esas alergias ninguna de nuestras recetas actuales es 100% apta. Escríbenos y armamos algo a la medida."
    );
    return {
      recipeAvailable: false,
      recipe: null,
      altRecipe: null,
      blend: null,
      planLabel: planLabel(size, isPuppy),
      sizeKey: size,
      stage,
      isPuppy,
      tier,
      calcWeightKg: calcKg,
      gramsPerDay: 0,
      mealsPerDay: meals,
      gramsPerMeal: 0,
      sleevesPerDay: 0,
      kcalPerDay,
      priceOnce: isPuppy ? plan.pricePuppy : plan.priceOnce,
      priceSub: isPuppy ? null : plan.priceSub,
      productUrl: productUrl(plan.handle),
      checkoutUrl: null,
      medicalReview,
      reasons: [],
      warnings,
    };
  }

  const { recipe, alt, blend, reason } = pickRecipe(profile, bcs, pool);
  const density = kcalPerGram(RECIPES[recipe]);
  const gramsPerDay = round5(kcalPerDay / density);
  const gramsPerMeal = round5(gramsPerDay / meals);
  const sleevesPerDay = Math.round((gramsPerDay / SLEEVE_GRAMS) * 10) / 10;

  const priceOnce = isPuppy ? plan.pricePuppy : plan.priceOnce;
  const priceSub = isPuppy ? null : plan.priceSub;

  const variantProtein: VariantProtein = blend
    ? "mix3"
    : (recipe as VariantProtein);
  const checkoutUrl = mealCartUrl(size, variantProtein, isPuppy);

  const reasons: string[] = [reason];
  reasons.push(
    isPuppy
      ? "Es un cachorro: más calorías y varias comidas al día para crecer fuerte."
      : stage === "senior"
        ? "Etapa senior: porción ajustada para un metabolismo más lento."
        : "Adulto: porción para alcanzar y mantener su peso ideal."
  );
  if (tier === "weightControl")
    reasons.push(
      `Plan Control de Peso: calculado sobre su peso meta (${calcKg} kg) para bajar de a poco.`
    );
  if (tier === "underweight")
    reasons.push("Plan Subir de Peso: porción más alta para ganar condición.");
  if (profile.activity === "working" || profile.activity === "high")
    reasons.push("Sumamos energía por su alto nivel de actividad.");
  if (profile.allergens.length)
    reasons.push(
      `Filtramos recetas con: ${profile.allergens.join(", ")}.`
    );

  return {
    recipeAvailable: true,
    recipe,
    altRecipe: alt,
    blend,
    planLabel: planLabel(size, isPuppy),
    sizeKey: size,
    stage,
    isPuppy,
    tier,
    calcWeightKg: calcKg,
    gramsPerDay,
    mealsPerDay: meals,
    gramsPerMeal,
    sleevesPerDay,
    kcalPerDay,
    priceOnce,
    priceSub,
    productUrl: productUrl(plan.handle),
    checkoutUrl,
    medicalReview,
    reasons,
    warnings,
  };
}
