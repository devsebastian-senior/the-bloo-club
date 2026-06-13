export type SizeKey = "xs" | "s" | "m" | "l";
export type LifeStage = "puppy" | "adult" | "senior";
export type Sex = "male" | "female";
export type Activity = "low" | "moderate" | "high" | "working" | "senior_sedentary";
export type Protein = "lamb" | "chicken" | "beef" | "turkey";
/** Allergens the recipes can contain (proteins + shared ingredients). */
export type Allergen = Protein | "egg" | "fish" | "rice" | "oils" | "grains";
export type Goal = "lose" | "gain" | "maintain" | "digestion" | "skin";
export type Tier = "underweight" | "balanced" | "weightControl";
export type MedicalKey =
  | "pancreatitis"
  | "kidney"
  | "liver"
  | "diabetes"
  | "diarrhea"
  | "skin"
  | "pregnancy";

export interface DogProfile {
  dogName: string;
  breedId: string | null;
  /** Used only when breed is unknown / mixed. */
  sizeOverride: SizeKey | null;
  ageMonths: number | null;
  sex: Sex | null;
  neutered: boolean;
  weightKg: number | null;
  /** Target / ideal weight (kg). Drives weight-loss and gain math. */
  goalWeightKg: number | null;
  /** Body Condition Score, 1–9 (ideal 4–5). */
  bcs: number;
  activity: Activity;
  /** Allergies / ingredients to avoid. */
  allergens: Allergen[];
  /** Diagnosed conditions selected from the list. */
  conditions: MedicalKey[];
  /** Free-text health notes. */
  health: string;
  prefer: Protein | null;
  dislike: Protein | null;
  picky: boolean;
  sensitiveStomach: boolean;
  goal: Goal | null;
  /** Override meals/day; null = auto by life stage. */
  mealsPerDay: number | null;
}

export const emptyProfile: DogProfile = {
  dogName: "",
  breedId: null,
  sizeOverride: null,
  ageMonths: null,
  sex: null,
  weightKg: null,
  goalWeightKg: null,
  bcs: 5,
  activity: "moderate",
  neutered: false,
  allergens: [],
  conditions: [],
  health: "",
  prefer: null,
  dislike: null,
  picky: false,
  sensitiveStomach: false,
  goal: null,
  mealsPerDay: null, // null = the calculator decides by life stage
};

export interface Recommendation {
  /** False when allergies rule out every recipe. */
  recipeAvailable: boolean;
  recipe: Protein | null;
  altRecipe: Protein | null;
  /** Suggested blend variant label, when variety fits better. */
  blend: string | null;
  planLabel: string; // X-Small / Small / Medium / Large / Puppy
  sizeKey: SizeKey;
  stage: LifeStage;
  isPuppy: boolean;
  tier: Tier;
  /** Weight (kg) the calorie math was run on (goal weight for loss/gain). */
  calcWeightKg: number;
  gramsPerDay: number;
  mealsPerDay: number;
  gramsPerMeal: number;
  sleevesPerDay: number;
  kcalPerDay: number;
  /** Real pricing (USD). */
  priceOnce: number;
  priceSub: number | null;
  productUrl: string;
  /** Shopify cart permalink; null when no recipe is available. */
  checkoutUrl: string | null;
  /** Serious condition → show vet-validation / support warning. */
  medicalReview: boolean;
  reasons: string[];
  warnings: string[];
}
