import type { SizeKey } from "../types";

export interface Breed {
  id: string;
  name: string;
  size: SizeKey;
  /** Typical adult weight (kg) — used to pre-fill the slider as a friendly hint. */
  typicalKg: number;
}

/** Curated common breeds (LatAm-friendly names), sorted at runtime. */
export const BREEDS: Breed[] = [
  { id: "chihuahua", name: "Chihuahua", size: "xs", typicalKg: 2.5 },
  { id: "pomeranian", name: "Pomerania", size: "xs", typicalKg: 3 },
  { id: "yorkshire", name: "Yorkshire Terrier", size: "xs", typicalKg: 3 },
  { id: "maltese", name: "Maltés", size: "xs", typicalKg: 3.5 },
  { id: "toy-poodle", name: "Poodle Toy", size: "xs", typicalKg: 3.5 },
  { id: "shih-tzu", name: "Shih Tzu", size: "s", typicalKg: 6 },
  { id: "pug", name: "Pug", size: "s", typicalKg: 8 },
  { id: "dachshund", name: "Salchicha (Dachshund)", size: "s", typicalKg: 7 },
  { id: "french-bulldog", name: "Bulldog Francés", size: "s", typicalKg: 11 },
  { id: "mini-schnauzer", name: "Schnauzer Mini", size: "s", typicalKg: 7 },
  { id: "jack-russell", name: "Jack Russell Terrier", size: "s", typicalKg: 6 },
  { id: "beagle", name: "Beagle", size: "m", typicalKg: 11 },
  { id: "cocker", name: "Cocker Spaniel", size: "m", typicalKg: 13 },
  { id: "border-collie", name: "Border Collie", size: "m", typicalKg: 18 },
  { id: "bulldog", name: "Bulldog Inglés", size: "m", typicalKg: 23 },
  { id: "australian-shepherd", name: "Pastor Australiano", size: "m", typicalKg: 22 },
  { id: "schnauzer-std", name: "Schnauzer Estándar", size: "m", typicalKg: 18 },
  { id: "pitbull", name: "Pitbull", size: "m", typicalKg: 22 },
  { id: "labrador", name: "Labrador Retriever", size: "l", typicalKg: 30 },
  { id: "golden", name: "Golden Retriever", size: "l", typicalKg: 30 },
  { id: "german-shepherd", name: "Pastor Alemán", size: "l", typicalKg: 32 },
  { id: "boxer", name: "Boxer", size: "l", typicalKg: 30 },
  { id: "husky", name: "Husky Siberiano", size: "l", typicalKg: 24 },
  { id: "doberman", name: "Doberman", size: "l", typicalKg: 38 },
  { id: "rottweiler", name: "Rottweiler", size: "l", typicalKg: 45 },
  { id: "great-dane", name: "Gran Danés", size: "l", typicalKg: 60 },
  { id: "saint-bernard", name: "San Bernardo", size: "l", typicalKg: 65 },
  { id: "bernese", name: "Boyero de Berna", size: "l", typicalKg: 45 },
];

export const MIXED_BREED_ID = "mixed";

export function getBreed(id: string | null): Breed | null {
  if (!id) return null;
  return BREEDS.find((b) => b.id === id) ?? null;
}
