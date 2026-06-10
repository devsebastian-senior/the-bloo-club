import raw from "./policies.json";

/* ---------------------------------------------------------------------------
   Verbatim policies from theblooclub.com/policies/* (extracted 2026-06-10 via
   scripts/extract-policies.mjs — re-run it to refresh). Text is the official
   English, word for word. Only the tab labels are Spanish.
--------------------------------------------------------------------------- */

export const LEGAL_CONTACT = {
  email: "info@theblooclub.com",
  legalEmail: "minerva@theblooclub.com",
  company: "The Bloo Club LLC",
  address: "11970 SW 14th Place, Davie, FL 33325, United States",
};

export interface PolicyBlock {
  t: "h" | "p" | "li";
  x: string;
}

export interface Policy {
  id: string;
  title: string;
  short: string;
  officialUrl: string;
  blocks: PolicyBlock[];
}

const META: Record<string, { short: string }> = {
  envios: { short: "Envíos" },
  devoluciones: { short: "Devoluciones" },
  privacidad: { short: "Privacidad" },
  terminos: { short: "Términos" },
};

type RawPolicy = { title: string; handle: string; blocks: PolicyBlock[] };

export const POLICIES: Policy[] = Object.entries(
  raw as Record<string, RawPolicy>
).map(([id, p]) => ({
  id,
  title: p.title,
  short: META[id]?.short ?? p.title,
  officialUrl: `https://theblooclub.com/policies/${p.handle}`,
  blocks: p.blocks,
}));

export function getPolicy(id: string): Policy | null {
  return POLICIES.find((p) => p.id === id) ?? null;
}
