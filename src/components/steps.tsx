import { useMemo, useState } from "react";
import { m } from "framer-motion";
import { Search, Sparkles, AlertTriangle } from "lucide-react";
import type { DogProfile, Allergen, MedicalKey, SizeKey } from "../types";
import { BREEDS, getBreed } from "../data/breeds";
import { RECIPES, ORDERABLE_PROTEINS } from "../data/recipes";
import {
  ACTIVITY_OPTIONS,
  ALLERGEN_OPTIONS,
  MEDICAL_OPTIONS,
  GOAL_OPTIONS,
  BCS_SCALE,
  bcsInfo,
  SERIOUS_CONDITIONS,
} from "../data/health";
import { lifeStage } from "../lib/calc";
import { listStagger, spring } from "../lib/motion";
import { Chip, OptionCard, StepHeader } from "./ui";

type Update = (patch: Partial<DogProfile>) => void;
const LB = 2.20462;

const SIZE_OPTIONS: { key: SizeKey; label: string; sub: string; kg: number }[] = [
  { key: "xs", label: "Mini", sub: "Menos de 5 kg", kg: 3.5 },
  { key: "s", label: "Pequeño", sub: "5 – 10 kg", kg: 8 },
  { key: "m", label: "Mediano", sub: "10 – 25 kg", kg: 17 },
  { key: "l", label: "Grande", sub: "Más de 25 kg", kg: 34 },
];

function Toggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/70 px-4 py-3.5">
      <span className="font-semibold">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onClick}
        className={`focus-ring relative h-7 w-12 rounded-full transition-colors ${
          on ? "bg-sage" : "bg-line"
        }`}
      >
        <m.span
          animate={{ x: on ? 20 : 0 }}
          transition={spring}
          className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow"
        />
      </button>
    </label>
  );
}

/* ============================================================ Step 1 · Perro */
export function StepDog({ profile, update }: { profile: DogProfile; update: Update }) {
  const [query, setQuery] = useState("");
  const isMixed = profile.breedId === null && profile.sizeOverride !== null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...BREEDS].sort((a, b) => a.name.localeCompare(b.name));
    return q ? list.filter((b) => b.name.toLowerCase().includes(q)) : list;
  }, [query]);

  return (
    <div>
      <StepHeader
        eyebrow="Paso 1 de 6"
        title="Cuéntanos de tu perro"
        hint="Nombre y raza para estimar su tamaño. ¿Mestizo? No hay problema."
      />

      <input
        value={profile.dogName}
        onChange={(e) => update({ dogName: e.target.value })}
        placeholder="Nombre de tu perro (opcional)"
        className="focus-ring mb-3 w-full rounded-2xl border-2 border-line bg-white/70 px-4 py-3.5 font-semibold placeholder:font-normal placeholder:text-ink-soft/60"
      />

      <div className="mb-3 grid grid-cols-2 gap-2.5">
        {(["male", "female"] as const).map((s) => (
          <Chip key={s} selected={profile.sex === s} onClick={() => update({ sex: s })}>
            {s === "male" ? "♂ Macho" : "♀ Hembra"}
          </Chip>
        ))}
      </div>

      <div className="relative mb-3">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca la raza…"
          className="focus-ring w-full rounded-2xl border-2 border-line bg-white/70 py-3.5 pl-11 pr-4 placeholder:text-ink-soft/60"
        />
      </div>

      <button
        type="button"
        onClick={() => update({ breedId: null, sizeOverride: profile.sizeOverride ?? "m" })}
        className={`focus-ring mb-4 flex w-full items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
          isMixed ? "border-ink bg-ink text-cream" : "border-dashed border-line text-ink-soft hover:border-ink/40"
        }`}
      >
        <Sparkles size={16} /> Es mestizo o no estoy seguro
      </button>

      {isMixed ? (
        <m.div variants={listStagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
          {SIZE_OPTIONS.map((s) => (
            <OptionCard
              key={s.key}
              selected={profile.sizeOverride === s.key}
              onClick={() => update({ sizeOverride: s.key, breedId: null, weightKg: profile.weightKg ?? s.kg })}
              title={s.label}
              subtitle={s.sub}
            />
          ))}
        </m.div>
      ) : (
        <m.div variants={listStagger} initial="hidden" animate="show" className="grid max-h-[38vh] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
          {results.map((b) => (
            <OptionCard
              key={b.id}
              selected={profile.breedId === b.id}
              onClick={() => update({ breedId: b.id, sizeOverride: null, weightKg: profile.weightKg ?? b.typicalKg })}
              icon="🐶"
              title={b.name}
              subtitle={`~${b.typicalKg} kg típico`}
            />
          ))}
          {results.length === 0 && (
            <p className="col-span-full py-6 text-center text-ink-soft">Usa “Es mestizo o no estoy seguro”. 🐾</p>
          )}
        </m.div>
      )}
    </div>
  );
}

/* ============================================================= Step 2 · Edad */
export function StepAge({ profile, update }: { profile: DogProfile; update: Update }) {
  const [unit, setUnit] = useState<"months" | "years">(
    profile.ageMonths != null && profile.ageMonths < 12 ? "months" : "years"
  );
  const display =
    profile.ageMonths == null ? "" : unit === "months" ? String(profile.ageMonths) : String(+(profile.ageMonths / 12).toFixed(1));

  function setAge(raw: string) {
    if (raw === "") return update({ ageMonths: null });
    const n = Math.max(0, parseFloat(raw) || 0);
    update({ ageMonths: Math.round(unit === "months" ? n : n * 12) });
  }

  const stage = lifeStage(profile.ageMonths);
  const meta = {
    puppy: { label: "Cachorro 🐾", note: "Está creciendo: necesita más energía." },
    adult: { label: "Adulto 💪", note: "Etapa de mantenimiento de su peso ideal." },
    senior: { label: "Senior 🌟", note: "Metabolismo más lento: porción ajustada." },
  }[stage];

  return (
    <div>
      <StepHeader
        eyebrow="Paso 2 de 6"
        title={profile.dogName ? `¿Qué edad tiene ${profile.dogName}?` : "¿Qué edad tiene?"}
        hint="La etapa de vida cambia cuántas calorías necesita."
      />

      <div className="mb-4 inline-flex rounded-full border-2 border-line bg-white/60 p-1">
        {(["months", "years"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`focus-ring rounded-full px-5 py-2 text-sm font-bold transition-colors ${unit === u ? "bg-ink text-cream" : "text-ink-soft"}`}
          >
            {u === "months" ? "Meses" : "Años"}
          </button>
        ))}
      </div>

      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={display}
        onChange={(e) => setAge(e.target.value)}
        placeholder={unit === "months" ? "Ej. 8" : "Ej. 3"}
        className="focus-ring w-full rounded-2xl border-2 border-line bg-white/70 px-5 py-4 text-2xl font-bold placeholder:font-normal placeholder:text-ink-soft/50"
      />

      {profile.ageMonths != null && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mt-4 flex items-center gap-3 rounded-2xl bg-cream-deep p-4">
          <span className="text-lg font-bold">{meta.label}</span>
          <span className="text-sm text-ink-soft">{meta.note}</span>
        </m.div>
      )}

      <div className="mt-4">
        <Toggle on={profile.neutered} onClick={() => update({ neutered: !profile.neutered })} label="¿Está esterilizado / castrado?" />
      </div>
    </div>
  );
}

/* ====================================================== Step 3 · Peso & BCS */
export function StepWeight({ profile, update }: { profile: DogProfile; update: Update }) {
  const breed = getBreed(profile.breedId);
  const kg = profile.weightKg ?? breed?.typicalKg ?? 12;
  const goal = profile.goalWeightKg ?? kg;
  const bcs = bcsInfo(profile.bcs);

  return (
    <div>
      <StepHeader eyebrow="Paso 3 de 6" title="Peso y condición corporal" hint="Con el peso y el BCS calculamos la porción y el plan exactos." />

      <div className="mb-5 rounded-2xl bg-white/70 p-5">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm font-semibold text-ink-soft">Peso actual</span>
          <span className="font-display text-3xl font-semibold">
            {kg.toFixed(kg < 10 ? 1 : 0)} <span className="text-lg text-ink-soft">kg</span>
            <span className="ml-1 font-sans text-sm font-semibold text-ink-soft/70">({Math.round(kg * LB)} lb)</span>
          </span>
        </div>
        <input type="range" min={1} max={70} step={0.5} value={kg} onChange={(e) => update({ weightKg: parseFloat(e.target.value) })} className="bloo-range w-full" />
      </div>

      <div className="mb-5 rounded-2xl bg-white/70 p-5">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm font-semibold text-ink-soft">Peso meta (opcional)</span>
          <span className="font-display text-2xl font-semibold">
            {goal.toFixed(goal < 10 ? 1 : 0)} <span className="text-base text-ink-soft">kg</span>
          </span>
        </div>
        <input type="range" min={1} max={70} step={0.5} value={goal} onChange={(e) => update({ goalWeightKg: parseFloat(e.target.value) })} className="bloo-range w-full" />
        <p className="mt-1 text-xs text-ink-soft/80">Si quiere bajar o subir de peso, ajústalo. Si está en su peso ideal, déjalo igual.</p>
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">
        Condición corporal (BCS 1–9) · <span className="text-gold-deep">ideal 4–5</span>
      </p>
      <div className="flex gap-1.5">
        {BCS_SCALE.map((b) => (
          <button
            key={b.score}
            type="button"
            onClick={() => update({ bcs: b.score })}
            aria-label={`BCS ${b.score}: ${b.label}`}
            className={`focus-ring relative h-11 flex-1 rounded-lg text-sm font-bold transition-colors ${
              profile.bcs === b.score
                ? "bg-ink text-cream"
                : b.ideal
                  ? "bg-sage/20 text-sage hover:bg-sage/30"
                  : "bg-white/70 text-ink-soft hover:bg-cream-deep"
            }`}
          >
            {b.score}
          </button>
        ))}
      </div>
      <m.div key={profile.bcs} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mt-3 rounded-2xl bg-cream-deep p-4">
        <span className="font-bold">{bcs.label}</span>
        <span className="ml-2 text-sm text-ink-soft">{bcs.note}</span>
      </m.div>
    </div>
  );
}

/* ======================================================= Step 4 · Actividad */
export function StepActivity({ profile, update }: { profile: DogProfile; update: Update }) {
  return (
    <div>
      <StepHeader eyebrow="Paso 4 de 6" title="¿Qué tan activo es?" hint="Mientras más se mueve, más energía necesita al día." />
      <m.div variants={listStagger} initial="hidden" animate="show" className="grid gap-2.5">
        {ACTIVITY_OPTIONS.map((a) => (
          <OptionCard
            key={a.key}
            selected={profile.activity === a.key}
            onClick={() => update({ activity: a.key })}
            icon={a.emoji}
            title={a.label}
          />
        ))}
      </m.div>
    </div>
  );
}

/* ========================================================== Step 5 · Salud */
export function StepHealth({ profile, update }: { profile: DogProfile; update: Update }) {
  const toggleAllergen = (k: Allergen) =>
    update({
      allergens: profile.allergens.includes(k)
        ? profile.allergens.filter((x) => x !== k)
        : [...profile.allergens, k],
    });
  const toggleCondition = (k: MedicalKey) =>
    update({
      conditions: profile.conditions.includes(k)
        ? profile.conditions.filter((x) => x !== k)
        : [...profile.conditions, k],
    });

  const serious = profile.conditions.some((c) => SERIOUS_CONDITIONS.has(c));

  return (
    <div>
      <StepHeader eyebrow="Paso 5 de 6" title="Salud y alergias" hint="Filtramos recetas e indicamos si necesita validación veterinaria." />

      <p className="mb-2 text-sm font-bold text-ink-soft">Alergias o ingredientes a evitar</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {ALLERGEN_OPTIONS.map((a) => (
          <Chip key={a.key} selected={profile.allergens.includes(a.key)} onClick={() => toggleAllergen(a.key)}>
            🚫 {a.emoji} {a.label}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">Condiciones médicas diagnosticadas</p>
      <div className="flex flex-wrap gap-2">
        {MEDICAL_OPTIONS.map((c) => (
          <Chip key={c.key} selected={profile.conditions.includes(c.key)} onClick={() => toggleCondition(c.key)}>
            {c.label}
          </Chip>
        ))}
      </div>

      {serious && (
        <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="mt-4 flex gap-3 rounded-2xl border-2 border-gold/50 bg-gold/10 p-4">
          <AlertTriangle size={20} className="mt-0.5 shrink-0 text-gold-deep" />
          <p className="text-sm text-ink">
            Para esta condición, <strong>valida el plan con tu veterinario y habla con soporte</strong> antes de empezar. Te mostramos la recomendación como referencia.
          </p>
        </m.div>
      )}

      <textarea
        value={profile.health}
        onChange={(e) => update({ health: e.target.value })}
        rows={2}
        placeholder="Otras notas de salud (opcional)…"
        className="focus-ring mt-4 w-full resize-none rounded-2xl border-2 border-line bg-white/70 px-4 py-3.5 placeholder:text-ink-soft/55"
      />
    </div>
  );
}

/* ==================================================== Step 6 · Preferencias */
export function StepPrefs({ profile, update }: { profile: DogProfile; update: Update }) {
  return (
    <div>
      <StepHeader eyebrow="Paso 6 de 6" title="Objetivo y gustos" hint="Lo último: afinamos la receta y las comidas del día." />

      <p className="mb-2 text-sm font-bold text-ink-soft">¿Cuál es el objetivo?</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {GOAL_OPTIONS.map((g) => (
          <Chip key={g.key} selected={profile.goal === g.key} onClick={() => update({ goal: profile.goal === g.key ? null : g.key })}>
            {g.emoji} {g.label}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">Proteína favorita</p>
      <div className="mb-5 grid grid-cols-3 gap-2.5">
        {ORDERABLE_PROTEINS.map((p) => (
          <Chip key={p} selected={profile.prefer === p} onClick={() => update({ prefer: profile.prefer === p ? null : p, dislike: profile.dislike === p ? null : profile.dislike })}>
            {RECIPES[p].emoji} {RECIPES[p].name}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">Que NO le gusta</p>
      <div className="mb-5 grid grid-cols-3 gap-2.5">
        {ORDERABLE_PROTEINS.map((p) => (
          <Chip key={p} selected={profile.dislike === p} onClick={() => update({ dislike: profile.dislike === p ? null : p, prefer: profile.prefer === p ? null : profile.prefer })}>
            🙅 {RECIPES[p].name}
          </Chip>
        ))}
      </div>

      <div className="mb-3 grid gap-2.5 sm:grid-cols-2">
        <Toggle on={profile.picky} onClick={() => update({ picky: !profile.picky })} label="Quisquilloso (picky)" />
        <Toggle on={profile.sensitiveStomach} onClick={() => update({ sensitiveStomach: !profile.sensitiveStomach })} label="Estómago sensible" />
      </div>

      <p className="mb-2 mt-4 text-sm font-bold text-ink-soft">Comidas al día</p>
      <div className="grid grid-cols-3 gap-2.5">
        {[2, 3, 4].map((n) => (
          <Chip key={n} selected={(profile.mealsPerDay ?? (lifeStage(profile.ageMonths) === "puppy" ? 3 : 2)) === n} onClick={() => update({ mealsPerDay: n })}>
            {n} comidas
          </Chip>
        ))}
      </div>
    </div>
  );
}
