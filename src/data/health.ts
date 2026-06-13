import type { Activity, Allergen, Goal, MedicalKey } from "../types";

/* ---------------------------------------------------------------------------
   Option lists for the quiz: activity, allergens, medical conditions, goals
   and the 1–9 Body Condition Score scale (WSAVA-style).
--------------------------------------------------------------------------- */

export const ACTIVITY_OPTIONS: {
  key: Activity;
  label: string;
  emoji: string;
  /** Added to the maintenance factor (non-puppy). */
  delta: number;
}[] = [
  { key: "low", label: "Tranquilo", emoji: "😴", delta: -0.2 },
  { key: "moderate", label: "Normal", emoji: "🚶", delta: 0 },
  { key: "high", label: "Muy activo", emoji: "⚡", delta: 0.4 },
  { key: "working", label: "Atleta / trabajo", emoji: "🏃", delta: 0.8 },
  { key: "senior_sedentary", label: "Senior sedentario", emoji: "🛋️", delta: -0.2 },
];

export const ALLERGEN_OPTIONS: { key: Allergen; label: string; emoji: string }[] =
  [
    { key: "chicken", label: "Pollo", emoji: "🐔" },
    { key: "beef", label: "Res", emoji: "🥩" },
    { key: "lamb", label: "Cordero", emoji: "🐑" },
    { key: "turkey", label: "Pavo", emoji: "🦃" },
    { key: "egg", label: "Huevo", emoji: "🥚" },
    { key: "fish", label: "Pescado", emoji: "🐟" },
    { key: "rice", label: "Arroz", emoji: "🍚" },
    { key: "grains", label: "Granos", emoji: "🌾" },
    { key: "oils", label: "Aceites", emoji: "🫒" },
  ];

export const MEDICAL_OPTIONS: {
  key: MedicalKey;
  label: string;
  /** Serious → triggers the vet-validation / support warning. */
  serious: boolean;
}[] = [
  { key: "pancreatitis", label: "Pancreatitis", serious: true },
  { key: "kidney", label: "Problemas renales", serious: true },
  { key: "liver", label: "Problemas de hígado", serious: true },
  { key: "diabetes", label: "Diabetes", serious: true },
  { key: "pregnancy", label: "Preñez / lactancia", serious: true },
  { key: "diarrhea", label: "Diarrea crónica", serious: false },
  { key: "skin", label: "Problemas de piel", serious: false },
];

export const SERIOUS_CONDITIONS = new Set<MedicalKey>(
  MEDICAL_OPTIONS.filter((m) => m.serious).map((m) => m.key)
);

export const GOAL_OPTIONS: { key: Goal; label: string; emoji: string }[] = [
  { key: "maintain", label: "Mantener peso", emoji: "⚖️" },
  { key: "lose", label: "Bajar de peso", emoji: "📉" },
  { key: "gain", label: "Subir de peso", emoji: "📈" },
  { key: "digestion", label: "Mejor digestión", emoji: "🌿" },
  { key: "skin", label: "Piel y pelaje", emoji: "✨" },
];

/** 1–9 Body Condition Score; 4–5 is ideal. */
export const BCS_SCALE: {
  score: number;
  label: string;
  note: string;
  ideal: boolean;
}[] = [
  { score: 1, label: "Muy delgado", note: "Costillas, columna y huesos visibles, sin grasa.", ideal: false },
  { score: 2, label: "Delgado", note: "Costillas visibles, poca grasa, cintura muy marcada.", ideal: false },
  { score: 3, label: "Bajo de peso", note: "Costillas fáciles de ver, cintura evidente.", ideal: false },
  { score: 4, label: "Ideal (bajo)", note: "Costillas fáciles de sentir, cintura visible.", ideal: true },
  { score: 5, label: "Ideal", note: "Costillas se sienten, cintura y abdomen recogido.", ideal: true },
  { score: 6, label: "Algo de sobrepeso", note: "Costillas con ligera capa de grasa.", ideal: false },
  { score: 7, label: "Con sobrepeso", note: "Cuesta sentir las costillas, cintura poco visible.", ideal: false },
  { score: 8, label: "Obeso", note: "No se sienten las costillas, sin cintura, depósitos de grasa.", ideal: false },
  { score: 9, label: "Muy obeso", note: "Grasa abundante en tórax, lomo y base de la cola.", ideal: false },
];

export function bcsInfo(score: number) {
  return BCS_SCALE.find((b) => b.score === score) ?? BCS_SCALE[4];
}
