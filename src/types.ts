export type SizeKey = "xs" | "s" | "m" | "l";
export type LifeStage = "puppy" | "adult" | "senior";
export type Activity = "low" | "normal" | "high";
export type BodyCondition = "thin" | "ideal" | "chubby";
export type Protein = "lamb" | "chicken" | "beef" | "turkey";
export type Tier = "underweight" | "balanced" | "weightControl";

export interface DogProfile {
  dogName: string;
  breedId: string | null;
  /** Used only when breed is unknown / mixed. */
  sizeOverride: SizeKey | null;
  ageMonths: number | null;
  weightKg: number | null;
  bodyCondition: BodyCondition;
  activity: Activity;
  neutered: boolean;
  /** Proteins to avoid (allergy or dislike). */
  avoid: Protein[];
  /** Favorite protein, if any. */
  prefer: Protein | null;
  /** Free-text health notes (illness, vet indications, etc.). */
  health: string;
}

export const emptyProfile: DogProfile = {
  dogName: "",
  breedId: null,
  sizeOverride: null,
  ageMonths: null,
  weightKg: null,
  bodyCondition: "ideal",
  activity: "normal",
  neutered: true,
  avoid: [],
  prefer: null,
  health: "",
};

export interface Recommendation {
  recipe: Protein;
  altRecipe: Protein;
  /** Suggested blend variant label, when variety fits better. */
  blend: string | null;
  planLabel: string; // X-Small / Small / Medium / Large / Puppy
  sizeKey: SizeKey;
  stage: LifeStage;
  isPuppy: boolean;
  tier: Tier;
  gramsPerDay: number;
  mealsPerDay: number;
  gramsPerMeal: number;
  sleevesPerDay: number;
  kcalPerDay: number;
  /** Real pricing (USD). */
  priceOnce: number;
  priceSub: number | null;
  productUrl: string;
  reasons: string[];
}
