import type {
  DogProfile,
  LifeStage,
  Protein,
  Recommendation,
  SizeKey,
  Tier,
} from "../types";
import { getBreed } from "../data/breeds";
import { RECIPES, ORDERABLE_PROTEINS } from "../data/recipes";
import { PLANS, PUPPY_PLAN, SLEEVE_GRAMS, productUrl } from "../data/plans";

/* ---------------------------------------------------------------------------
   Nutrition engine (client-side, vet-style estimates).

   RER  = Resting Energy Requirement = 70 * (kg ^ 0.75)
   MER  = Maintenance Energy Requirement = factor * RER
   grams/day = MER / recipe energy density (kcal per gram, ~240 kcal/8oz)

   Plan size, prices and recipes are the REAL ones from theblooclub.com.
   These portions are healthy-estimate starting points, not a prescription.
--------------------------------------------------------------------------- */

const LB_PER_KG = 2.20462;

export function lifeStage(ageMonths: number | null): LifeStage {
  if (ageMonths == null) return "adult";
  if (ageMonths < 12) return "puppy";
  if (ageMonths >= 96) return "senior"; // ~8y+
  return "adult";
}

/** Resolve the dog's size: breed first, manual override as fallback. */
export function resolveSize(profile: DogProfile): SizeKey {
  const breed = getBreed(profile.breedId);
  if (breed) return breed.size;
  if (profile.sizeOverride) return profile.sizeOverride;
  return sizeFromWeight(profile.weightKg ?? 12);
}

/** Size bands match The Bloo Club's real pound ranges, mapped to kg. */
export function sizeFromWeight(kg: number): SizeKey {
  const lb = kg * LB_PER_KG;
  if (lb <= 10) return "xs"; // 2–10 lb
  if (lb <= 19) return "s"; // 11–19 lb
  if (lb <= 49) return "m"; // 20–49 lb
  return "l"; // 50–90 lb
}

export function planLabel(size: SizeKey, isPuppy: boolean): string {
  return isPuppy ? PUPPY_PLAN.name : PLANS[size].name;
}

function tierFromCondition(profile: DogProfile): Tier {
  if (profile.bodyCondition === "thin") return "underweight";
  if (profile.bodyCondition === "chubby") return "weightControl";
  return "balanced";
}

/** MER multiplier from life stage, neuter status, activity and body shape. */
function energyFactor(profile: DogProfile, stage: LifeStage): number {
  let f: number;

  if (stage === "puppy") {
    const m = profile.ageMonths ?? 6;
    f = m < 4 ? 3.0 : m < 7 ? 2.5 : 2.0;
  } else if (stage === "senior") {
    f = 1.4;
  } else {
    f = profile.neutered ? 1.6 : 1.8;
  }

  if (stage !== "puppy") {
    if (profile.activity === "low") f -= 0.2;
    if (profile.activity === "high") f += 0.4;
  }

  if (profile.bodyCondition === "chubby") f -= 0.2;
  if (profile.bodyCondition === "thin") f += 0.2;

  return Math.max(1.0, f);
}

function mealsPerDay(stage: LifeStage): number {
  return stage === "puppy" ? 3 : 2;
}

function round5(n: number): number {
  return Math.round(n / 5) * 5;
}

/** Pick the best orderable recipe (Chicken/Beef/Lamb) given the dog. */
function pickRecipe(profile: DogProfile): {
  recipe: Protein;
  alt: Protein;
  blend: string | null;
  reason: string;
} {
  const avoid = new Set(profile.avoid);
  const allowed = ORDERABLE_PROTEINS.filter((p) => !avoid.has(p));
  const pool = allowed.length ? allowed : ORDERABLE_PROTEINS;
  const altOf = (r: Protein) => pool.find((p) => p !== r) ?? r;

  // 1) Honor an explicit favorite if it's orderable and not avoided.
  if (
    profile.prefer &&
    !avoid.has(profile.prefer) &&
    ORDERABLE_PROTEINS.includes(profile.prefer)
  ) {
    return {
      recipe: profile.prefer,
      alt: altOf(profile.prefer),
      blend: null,
      reason: `Elegimos ${RECIPES[profile.prefer].name} porque es su proteína favorita.`,
    };
  }

  // 2) Sensitive stomach / skin → Lamb (gentle digestion, real positioning).
  const notes = profile.health.toLowerCase();
  const sensitive =
    /sensib|alerg|piel|gastr|estomag|estóma|diarre|digest|pancrea/.test(notes);
  if (sensitive && !avoid.has("lamb")) {
    return {
      recipe: "lamb",
      alt: altOf("lamb"),
      blend: null,
      reason:
        "Cordero: receta suave para una digestión gentle, ideal para estómagos o pieles sensibles.",
    };
  }

  // 3) Very active dogs → Beef ("Fuel for active, happy dogs").
  if (profile.activity === "high" && !avoid.has("beef")) {
    return {
      recipe: "beef",
      alt: altOf("beef"),
      blend: null,
      reason: "Res: hierro y energía extra para un perro muy activo.",
    };
  }

  // 4) Weight control → Chicken (lean everyday).
  if (profile.bodyCondition === "chubby" && !avoid.has("chicken")) {
    return {
      recipe: "chicken",
      alt: altOf("chicken"),
      blend: null,
      reason: "Pollo: magro y liviano, perfecto para cuidar el peso.",
    };
  }

  // 5) No preference, nothing avoided → suggest the variety blend.
  if (!profile.prefer && profile.avoid.length === 0) {
    return {
      recipe: "chicken",
      alt: "beef",
      blend: "Equal Parts Chicken · Beef · Lamb",
      reason:
        "Sin preferencia: la mezcla a partes iguales (pollo · res · cordero) le da variedad y un perfil completo.",
    };
  }

  // 6) Sensible default.
  return {
    recipe: pool[0],
    alt: pool[1] ?? pool[0],
    blend: null,
    reason: `${RECIPES[pool[0]].name}: receta balanceada y muy bien tolerada.`,
  };
}

export function buildRecommendation(profile: DogProfile): Recommendation {
  const stage = lifeStage(profile.ageMonths);
  const isPuppy = stage === "puppy";
  const size = resolveSize(profile);
  const plan = PLANS[size];
  const kg = profile.weightKg ?? 12;
  const tier = tierFromCondition(profile);

  const rer = 70 * Math.pow(kg, 0.75);
  const factor = energyFactor(profile, stage);
  const kcalPerDay = Math.round(rer * factor);

  const { recipe, alt, blend, reason } = pickRecipe(profile);
  const density = RECIPES[recipe].kcalPerGram;

  const gramsPerDay = round5(kcalPerDay / density);
  const meals = mealsPerDay(stage);
  const gramsPerMeal = round5(gramsPerDay / meals);
  const sleevesPerDay = Math.round((gramsPerDay / SLEEVE_GRAMS) * 10) / 10;

  // Real pricing: puppies stay on their size plan with the "puppy" option
  // (e.g. Small puppy $209). We link to the same size product so the shown
  // price matches the destination.
  const priceOnce = isPuppy ? plan.pricePuppy : plan.priceOnce;
  const priceSub = isPuppy ? null : plan.priceSub;
  const url = productUrl(plan.handle);

  const reasons: string[] = [reason];
  reasons.push(
    isPuppy
      ? "Es un cachorro: más calorías y 3 comidas al día para crecer fuerte."
      : stage === "senior"
        ? "Etapa senior: porción ajustada para un metabolismo más lento."
        : "Adulto: porción de mantenimiento para su peso ideal."
  );
  if (tier === "weightControl")
    reasons.push("Plan Control de Peso: porción más baja para bajar de a poco.");
  if (tier === "underweight")
    reasons.push("Plan Subir de Peso: porción más alta para ganar condición.");
  if (profile.activity === "high")
    reasons.push("Sumamos energía por su alto nivel de actividad.");
  if (profile.avoid.length)
    reasons.push(
      `Evitamos: ${profile.avoid.map((p) => RECIPES[p].name).join(", ")}.`
    );

  return {
    recipe,
    altRecipe: alt,
    blend,
    planLabel: planLabel(size, isPuppy),
    sizeKey: size,
    stage,
    isPuppy,
    tier,
    gramsPerDay,
    mealsPerDay: meals,
    gramsPerMeal,
    sleevesPerDay,
    kcalPerDay,
    priceOnce,
    priceSub,
    productUrl: url,
    reasons,
  };
}
