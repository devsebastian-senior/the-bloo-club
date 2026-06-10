import type { SizeKey } from "../types";
import { SITE } from "./plans";

/* ---------------------------------------------------------------------------
   Real Shopify variant IDs (products.json, captured 2026-06-10).
   Cart permalink = SITE/cart/{variantId}:1 → lands with the exact plan
   (size + protein + puppy option) already in the cart. One click, no
   navigating the old site.
--------------------------------------------------------------------------- */

/** Protein choice in the plan builder; mix3 = Equal Parts Chicken-Beef-Lamb. */
export type VariantProtein = "chicken" | "beef" | "lamb" | "mix3";

interface VariantPair {
  adult: string;
  puppy: string;
}

export const MEAL_VARIANTS: Record<
  SizeKey,
  Record<VariantProtein, VariantPair>
> = {
  xs: {
    chicken: { adult: "43506207391804", puppy: "43506203689020" },
    beef: { adult: "43506326962236", puppy: "43506327158844" },
    lamb: { adult: "43506326995004", puppy: "43506327191612" },
    mix3: { adult: "43506327126076", puppy: "43506327322684" },
  },
  s: {
    chicken: { adult: "43506383552572", puppy: "43506383585340" },
    beef: { adult: "43506383618108", puppy: "43506383650876" },
    lamb: { adult: "43506383683644", puppy: "43506383716412" },
    mix3: { adult: "43506383945788", puppy: "43506383978556" },
  },
  m: {
    chicken: { adult: "43506388598844", puppy: "43506388631612" },
    beef: { adult: "43506388664380", puppy: "43506388697148" },
    lamb: { adult: "43506388729916", puppy: "43506388762684" },
    mix3: { adult: "43506388992060", puppy: "43506389024828" },
  },
  l: {
    chicken: { adult: "43506392105020", puppy: "43506392137788" },
    beef: { adult: "43506392170556", puppy: "43506392203324" },
    lamb: { adult: "43506392236092", puppy: "43506392268860" },
    mix3: { adult: "43506392498236", puppy: "43506392531004" },
  },
};

export const TRIAL_VARIANT = "43655160660028";

export const cartUrl = (variantId: string) => `${SITE}/cart/${variantId}:1`;

export function mealCartUrl(
  size: SizeKey,
  protein: VariantProtein,
  isPuppy: boolean
): string {
  const pair = MEAL_VARIANTS[size][protein];
  return cartUrl(isPuppy ? pair.puppy : pair.adult);
}
