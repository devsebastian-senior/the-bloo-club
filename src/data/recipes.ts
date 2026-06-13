import type { Allergen, Protein } from "../types";

/* ---------------------------------------------------------------------------
   Real recipes from theblooclub.com (recipe pages), captured 2026-06-10.
   Human-grade, small batches, AAFCO maintenance, 8 oz fresh sleeves.

   Calories: only the Turkey page publishes a real figure — "Each 8 oz serving
   contains approximately 240 calories" → 30 kcal/oz. Lamb/Chicken/Beef do NOT
   publish kcal, so we use the same 30 kcal/oz line baseline (identical 8 oz
   format and guaranteed minimums) and flag them `estimate` until the client
   provides real per-recipe numbers. Edit kcalPerOz here to correct.
--------------------------------------------------------------------------- */

export interface Recipe {
  id: Protein;
  name: string;
  emoji: string;
  /** True if selectable in the standard monthly plan builder. */
  orderable: boolean;
  /** Energy density, kcal per ounce (Turkey official; others estimate). */
  kcalPerOz: number;
  calorieSource: "official" | "estimate";
  tagline: string;
  ingredients: string;
  goodFor: string[];
  /** Allergens this recipe CONTAINS — used to filter by the dog's allergies. */
  allergens: Allergen[];
  /** Accent color token (CSS var name without the --color- prefix). */
  accent: string;
}

const SLEEVE_OZ = 8;
/** kcal per gram derived from kcal/oz (1 oz ≈ 28.35 g). */
export const kcalPerGram = (r: Recipe) => r.kcalPerOz / 28.3495;
export const kcalPerSleeve = (r: Recipe) => r.kcalPerOz * SLEEVE_OZ;

export const RECIPES: Record<Protein, Recipe> = {
  lamb: {
    id: "lamb",
    name: "Cordero",
    emoji: "🐑",
    orderable: true,
    kcalPerOz: 30,
    calorieSource: "estimate",
    tagline: "Fresca, sabrosa y pensada para una digestión suave.",
    ingredients:
      "Cordero, arroz integral, huevo entero, zanahoria, aceite de coco, perejil, quinua, chía, calabacín, batata y cáscara de huevo molida.",
    goodFor: ["Estómago sensible", "Digestión suave", "Pelaje brillante"],
    allergens: ["lamb", "egg", "rice", "grains", "oils"],
    accent: "sage",
  },
  chicken: {
    id: "chicken",
    name: "Pollo",
    emoji: "🐔",
    orderable: true,
    kcalPerOz: 30,
    calorieSource: "estimate",
    tagline: "Magro y liviano, el equilibrio perfecto del día a día.",
    ingredients:
      "Pollo, arroz integral, zanahoria, batata, calabacín, aceite de coco, huevo con cáscara, chía y perejil.",
    goodFor: ["Peso ideal", "Energía estable", "Bien tolerado"],
    allergens: ["chicken", "egg", "rice", "grains", "oils"],
    accent: "gold",
  },
  beef: {
    id: "beef",
    name: "Res",
    emoji: "🥩",
    orderable: true,
    kcalPerOz: 30,
    calorieSource: "estimate",
    tagline: "Combustible para perros activos y felices.",
    ingredients:
      "Res (con corazón de res y pollo), arroz integral, zanahoria, batata, calabacín, semillas de calabaza, aceite de coco y girasol, chía, huevo con cáscara, perejil + vitaminas y minerales (Omega-3 de aceite de pescado, zinc, B12, D3, E).",
    goodFor: ["Mucha actividad", "Hierro y energía", "Masa muscular"],
    allergens: ["beef", "egg", "rice", "grains", "oils", "fish"],
    accent: "clay",
  },
  turkey: {
    id: "turkey",
    name: "Pavo",
    emoji: "🦃",
    orderable: false,
    kcalPerOz: 30,
    calorieSource: "official",
    tagline: "Ligera, magra y llena de amor: 90% magro.",
    ingredients:
      "Pavo molido 90% magro, arroz integral, zanahoria, batata, calabacín, semillas de calabaza, aceite de coco, huevo con cáscara, chía, perejil y aceite de pescado (EPA y DHA).",
    goodFor: ["Control de peso", "Estómago delicado", "Perros senior"],
    allergens: ["turkey", "egg", "rice", "grains", "oils", "fish"],
    accent: "sage",
  },
};

/** Guaranteed analysis — shared across the line (Beef/Turkey pages). */
export const GUARANTEED = [
  { label: "Proteína (mín)", value: "20%" },
  { label: "Grasa (mín)", value: "11%" },
  { label: "Fibra (máx)", value: "3%" },
  { label: "Humedad (máx)", value: "72%" },
];

/** Single proteins offered in the plan builder. */
export const PROTEIN_ORDER: Protein[] = ["chicken", "beef", "lamb", "turkey"];
export const ORDERABLE_PROTEINS: Protein[] = ["chicken", "beef", "lamb"];
