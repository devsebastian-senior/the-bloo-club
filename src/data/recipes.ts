import type { Protein } from "../types";

/* ---------------------------------------------------------------------------
   Real recipes from theblooclub.com (recipe pages), captured 2026-06-10.
   Human-grade, small batches, AAFCO maintenance, ~240 kcal / 8 oz sleeve.
   Subscription plan builder offers Chicken / Beef / Lamb (+ blends);
   Turkey is a featured recipe (puppy / on request) — orderable: false.
--------------------------------------------------------------------------- */

export interface Recipe {
  id: Protein;
  name: string;
  emoji: string;
  /** True if selectable in the standard monthly plan builder. */
  orderable: boolean;
  /** Energy density of the cooked fresh meal, kcal per gram (~240 kcal/8oz). */
  kcalPerGram: number;
  tagline: string;
  ingredients: string;
  goodFor: string[];
  /** Accent color token (CSS var name without the --color- prefix). */
  accent: string;
}

export const RECIPES: Record<Protein, Recipe> = {
  lamb: {
    id: "lamb",
    name: "Cordero",
    emoji: "🐑",
    orderable: true,
    kcalPerGram: 1.1,
    tagline: "Fresca, sabrosa y pensada para una digestión suave.",
    ingredients:
      "Cordero, arroz integral, huevo entero, zanahoria, aceite de coco, perejil, quinua, chía, calabacín, batata y cáscara de huevo molida.",
    goodFor: ["Estómago sensible", "Digestión suave", "Pelaje brillante"],
    accent: "sage",
  },
  chicken: {
    id: "chicken",
    name: "Pollo",
    emoji: "🐔",
    orderable: true,
    kcalPerGram: 1.05,
    tagline: "Magro y liviano, el equilibrio perfecto del día a día.",
    ingredients:
      "Pollo, arroz integral, zanahoria, batata, calabacín, aceite de coco, huevo con cáscara, chía y perejil.",
    goodFor: ["Peso ideal", "Energía estable", "Bien tolerado"],
    accent: "gold",
  },
  beef: {
    id: "beef",
    name: "Res",
    emoji: "🥩",
    orderable: true,
    kcalPerGram: 1.15,
    tagline: "Combustible para perros activos y felices.",
    ingredients:
      "Res (con corazón de res y pollo), arroz integral, zanahoria, batata, calabacín, semillas de calabaza, aceite de coco y girasol, chía, huevo con cáscara, perejil + vitaminas y minerales (Omega-3, zinc, B12, D3, E).",
    goodFor: ["Mucha actividad", "Hierro y energía", "Masa muscular"],
    accent: "clay",
  },
  turkey: {
    id: "turkey",
    name: "Pavo",
    emoji: "🦃",
    orderable: false,
    kcalPerGram: 1.06,
    tagline: "Ligera, magra y llena de amor: 90% magro.",
    ingredients:
      "Pavo molido 90% magro, arroz integral, zanahoria, batata, calabacín, semillas de calabaza, aceite de coco, huevo con cáscara, chía, perejil y aceite de pescado (EPA y DHA).",
    goodFor: ["Control de peso", "Estómago delicado", "Perros senior"],
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
