import type { SizeKey, Tier } from "../types";

/* ---------------------------------------------------------------------------
   Real meal plans from theblooclub.com (Shopify), captured 2026-06-10.
   Currency: USD. Sizes defined by weight in POUNDS on the source site.
   Prices = one-time monthly / "Subscribe & Save" monthly.
--------------------------------------------------------------------------- */

export interface Plan {
  key: SizeKey;
  /** Real plan name on the site. */
  name: string;
  /** Real weight band (pounds), as marketed. */
  lbMin: number;
  lbMax: number;
  /** Same band converted to kg (for our kg-based UI). */
  kgMin: number;
  kgMax: number;
  priceOnce: number;
  priceSub: number | null;
  /** One-time price when the puppy option is selected. */
  pricePuppy: number;
  handle: string; // Shopify product handle
  exampleBreeds: string[];
}

export const PLANS: Record<SizeKey, Plan> = {
  xs: {
    key: "xs",
    name: "X-Small",
    lbMin: 2,
    lbMax: 10,
    kgMin: 0.9,
    kgMax: 4.5,
    priceOnce: 129,
    priceSub: 109,
    pricePuppy: 129,
    handle: "xsmallbreedmeals",
    exampleBreeds: ["Chihuahua", "Yorkshire", "Pomerania", "Maltés"],
  },
  s: {
    key: "s",
    name: "Small",
    lbMin: 11,
    lbMax: 19,
    kgMin: 5,
    kgMax: 8.6,
    priceOnce: 189,
    priceSub: 149,
    pricePuppy: 209,
    handle: "smallbreedmeals",
    exampleBreeds: ["Poodle Mini", "Shih Tzu", "Salchicha", "Pequinés"],
  },
  m: {
    key: "m",
    name: "Medium",
    lbMin: 20,
    lbMax: 49,
    kgMin: 9,
    kgMax: 22.2,
    priceOnce: 319,
    priceSub: 299,
    pricePuppy: 319,
    handle: "mediumbreedmeals",
    exampleBreeds: ["Bulldog Francés", "Cocker Spaniel", "Beagle"],
  },
  l: {
    key: "l",
    name: "Large",
    lbMin: 50,
    lbMax: 90,
    kgMin: 22.7,
    kgMax: 40.8,
    priceOnce: 469,
    priceSub: 449,
    pricePuppy: 469,
    handle: "largebreedmeals",
    exampleBreeds: ["Border Collie", "Labrador", "Pastor Alemán"],
  },
};

/** Dedicated puppy plan (Medium - Puppy) on the site. */
export const PUPPY_PLAN = {
  name: "Puppy",
  priceOnce: 369,
  handle: "mediumpuppymeals",
};

/** "Sniff Us First" trial — 18 meals (6 beef · 6 lamb · 6 chicken). */
export const TRIAL = {
  name: "Sniff Us First",
  price: 89,
  meals: 18,
  handle: "sniff-us-first",
  blurb: "18 comidas para probar: 6 de res, 6 de cordero y 6 de pollo.",
};

export const SITE = "https://theblooclub.com";
export const productUrl = (handle: string) => `${SITE}/products/${handle}`;

/** Each recipe is portioned into 8 oz (≈227 g) fresh sleeves. */
export const SLEEVE_GRAMS = 227;

/** Real "plan tier" the site offers within each recipe. */
export const TIER_LABEL: Record<Tier, string> = {
  underweight: "Plan Subir de Peso",
  balanced: "Plan Balanceado",
  weightControl: "Plan Control de Peso",
};
export const TIER_NOTE: Record<Tier, string> = {
  underweight: "Porción alta en calorías para ganar condición.",
  balanced: "Porción de mantenimiento para su peso ideal.",
  weightControl: "Baja en calorías y alta en fibra para bajar de peso.",
};
