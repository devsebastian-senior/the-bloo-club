import { useMemo, useState } from "react";
import { m } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import type { DogProfile, Protein, SizeKey } from "../types";
import { BREEDS, getBreed } from "../data/breeds";
import { RECIPES, ORDERABLE_PROTEINS } from "../data/recipes";
import { lifeStage } from "../lib/calc";
import { listStagger, popItem, spring } from "../lib/motion";
import { Chip, OptionCard, StepHeader } from "./ui";

type Update = (patch: Partial<DogProfile>) => void;

const SIZE_OPTIONS: { key: SizeKey; label: string; sub: string; kg: number }[] = [
  { key: "xs", label: "Mini", sub: "Menos de 5 kg", kg: 3.5 },
  { key: "s", label: "Pequeño", sub: "5 – 10 kg", kg: 8 },
  { key: "m", label: "Mediano", sub: "10 – 25 kg", kg: 17 },
  { key: "l", label: "Grande", sub: "Más de 25 kg", kg: 34 },
];

/* ============================================================ Step 1 · Raza */
export function StepBreed({
  profile,
  update,
}: {
  profile: DogProfile;
  update: Update;
}) {
  const [query, setQuery] = useState("");
  const isMixed = profile.breedId === null && profile.sizeOverride !== null;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...BREEDS].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter((b) => b.name.toLowerCase().includes(q));
  }, [query]);

  function selectBreed(id: string, typicalKg: number) {
    update({
      breedId: id,
      sizeOverride: null,
      weightKg: profile.weightKg ?? typicalKg,
    });
  }

  return (
    <div>
      <StepHeader
        eyebrow="Paso 1 de 4"
        title="¿Cómo se llama y de qué raza es?"
        hint="Nos ayuda a estimar su tamaño. Si es mestizo, no te preocupes."
      />

      <input
        value={profile.dogName}
        onChange={(e) => update({ dogName: e.target.value })}
        placeholder="Nombre de tu perro (opcional)"
        className="focus-ring mb-4 w-full rounded-2xl border-2 border-line bg-white/70 px-4 py-3.5 font-semibold placeholder:font-normal placeholder:text-ink-soft/60"
      />

      <div className="relative mb-4">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca la raza…"
          className="focus-ring w-full rounded-2xl border-2 border-line bg-white/70 py-3.5 pl-11 pr-4 placeholder:text-ink-soft/60"
        />
      </div>

      <button
        type="button"
        onClick={() =>
          update({ breedId: null, sizeOverride: profile.sizeOverride ?? "m" })
        }
        className={`focus-ring mb-4 flex w-full items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-colors ${
          isMixed ? "border-ink bg-ink text-cream" : "border-dashed border-line text-ink-soft hover:border-ink/40"
        }`}
      >
        <Sparkles size={16} /> Es mestizo o no estoy seguro
      </button>

      {isMixed ? (
        <m.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {SIZE_OPTIONS.map((s) => (
            <OptionCard
              key={s.key}
              selected={profile.sizeOverride === s.key}
              onClick={() =>
                update({
                  sizeOverride: s.key,
                  breedId: null,
                  weightKg: profile.weightKg ?? s.kg,
                })
              }
              title={s.label}
              subtitle={s.sub}
            />
          ))}
        </m.div>
      ) : (
        <m.div
          variants={listStagger}
          initial="hidden"
          animate="show"
          className="grid max-h-[42vh] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2"
        >
          {results.map((b) => (
            <OptionCard
              key={b.id}
              selected={profile.breedId === b.id}
              onClick={() => selectBreed(b.id, b.typicalKg)}
              icon="🐶"
              title={b.name}
              subtitle={`~${b.typicalKg} kg típico`}
            />
          ))}
          {results.length === 0 && (
            <p className="col-span-full py-6 text-center text-ink-soft">
              No la encontramos. Usa “Es mestizo o no estoy seguro”. 🐾
            </p>
          )}
        </m.div>
      )}
    </div>
  );
}

/* ============================================================= Step 2 · Edad */
export function StepAge({
  profile,
  update,
}: {
  profile: DogProfile;
  update: Update;
}) {
  const [unit, setUnit] = useState<"months" | "years">(
    profile.ageMonths != null && profile.ageMonths < 12 ? "months" : "years"
  );

  const displayValue =
    profile.ageMonths == null
      ? ""
      : unit === "months"
        ? String(profile.ageMonths)
        : String(+(profile.ageMonths / 12).toFixed(1));

  function setAge(raw: string) {
    if (raw === "") return update({ ageMonths: null });
    const n = Math.max(0, parseFloat(raw) || 0);
    update({ ageMonths: Math.round(unit === "months" ? n : n * 12) });
  }

  const stage = lifeStage(profile.ageMonths);
  const stageMeta = {
    puppy: { label: "Cachorro 🐾", note: "Está creciendo: necesita más energía." },
    adult: { label: "Adulto 💪", note: "Etapa de mantenimiento de su peso ideal." },
    senior: { label: "Senior 🌟", note: "Metabolismo más lento: porción ajustada." },
  }[stage];

  return (
    <div>
      <StepHeader
        eyebrow="Paso 2 de 4"
        title={
          profile.dogName ? `¿Qué edad tiene ${profile.dogName}?` : "¿Qué edad tiene?"
        }
        hint="La etapa de vida cambia cuántas calorías necesita."
      />

      <div className="mb-4 inline-flex rounded-full border-2 border-line bg-white/60 p-1">
        {(["months", "years"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={`focus-ring rounded-full px-5 py-2 text-sm font-bold transition-colors ${
              unit === u ? "bg-ink text-cream" : "text-ink-soft"
            }`}
          >
            {u === "months" ? "Meses" : "Años"}
          </button>
        ))}
      </div>

      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={displayValue}
        onChange={(e) => setAge(e.target.value)}
        placeholder={unit === "months" ? "Ej. 8" : "Ej. 3"}
        className="focus-ring w-full rounded-2xl border-2 border-line bg-white/70 px-5 py-4 text-2xl font-bold placeholder:font-normal placeholder:text-ink-soft/50"
      />

      {profile.ageMonths != null && (
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="mt-5 flex items-center gap-3 rounded-2xl bg-cream-deep p-4"
        >
          <span className="text-lg font-bold">{stageMeta.label}</span>
          <span className="text-sm text-ink-soft">{stageMeta.note}</span>
        </m.div>
      )}
    </div>
  );
}

/* ===================================================== Step 3 · Peso & cuerpo */
const BODY = [
  { key: "thin", label: "Delgado", emoji: "🦴" },
  { key: "ideal", label: "Ideal", emoji: "✅" },
  { key: "chubby", label: "Con sobrepeso", emoji: "🍩" },
] as const;

const ACTIVITY = [
  { key: "low", label: "Tranquilo", emoji: "😴" },
  { key: "normal", label: "Normal", emoji: "🚶" },
  { key: "high", label: "Muy activo", emoji: "⚡" },
] as const;

export function StepBody({
  profile,
  update,
}: {
  profile: DogProfile;
  update: Update;
}) {
  const breed = getBreed(profile.breedId);
  const kg = profile.weightKg ?? breed?.typicalKg ?? 12;

  return (
    <div>
      <StepHeader
        eyebrow="Paso 3 de 4"
        title="¿Cuánto pesa y cómo se mueve?"
        hint="Con el peso calculamos la porción exacta en gramos."
      />

      <div className="mb-6 rounded-2xl bg-white/70 p-5">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm font-semibold text-ink-soft">Peso actual</span>
          <span className="font-display text-3xl font-semibold">
            {kg.toFixed(kg < 10 ? 1 : 0)}{" "}
            <span className="text-lg text-ink-soft">kg</span>
            <span className="ml-1 text-sm font-sans font-semibold text-ink-soft/70">
              ({Math.round(kg * 2.20462)} lb)
            </span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={70}
          step={0.5}
          value={kg}
          onChange={(e) => update({ weightKg: parseFloat(e.target.value) })}
          className="bloo-range w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
          <span>1 kg</span>
          <span>70 kg</span>
        </div>
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">Condición corporal</p>
      <div className="mb-6 grid grid-cols-3 gap-2.5">
        {BODY.map((b) => (
          <Chip
            key={b.key}
            selected={profile.bodyCondition === b.key}
            onClick={() => update({ bodyCondition: b.key })}
          >
            {b.emoji} {b.label}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">Nivel de actividad</p>
      <div className="mb-6 grid grid-cols-3 gap-2.5">
        {ACTIVITY.map((a) => (
          <Chip
            key={a.key}
            selected={profile.activity === a.key}
            onClick={() => update({ activity: a.key })}
          >
            {a.emoji} {a.label}
          </Chip>
        ))}
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white/70 px-4 py-3.5">
        <span className="font-semibold">¿Está esterilizado / castrado?</span>
        <button
          type="button"
          role="switch"
          aria-checked={profile.neutered}
          onClick={() => update({ neutered: !profile.neutered })}
          className={`focus-ring relative h-7 w-12 rounded-full transition-colors ${
            profile.neutered ? "bg-sage" : "bg-line"
          }`}
        >
          <m.span
            animate={{ x: profile.neutered ? 20 : 0 }}
            transition={spring}
            className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow"
          />
        </button>
      </label>
    </div>
  );
}

/* ==================================================== Step 4 · Notas & gustos */
export function StepNotes({
  profile,
  update,
}: {
  profile: DogProfile;
  update: Update;
}) {
  function toggleAvoid(p: Protein) {
    const has = profile.avoid.includes(p);
    const avoid = has
      ? profile.avoid.filter((x) => x !== p)
      : [...profile.avoid, p];
    update({
      avoid,
      prefer: avoid.includes(profile.prefer as Protein) ? null : profile.prefer,
    });
  }

  return (
    <div>
      <StepHeader
        eyebrow="Paso 4 de 4"
        title="Gustos y salud"
        hint="Lo último. Esto afina la receta que le recomendamos."
      />

      <p className="mb-2 text-sm font-bold text-ink-soft">
        ¿Tiene una proteína favorita?
      </p>
      <m.div
        variants={listStagger}
        initial="hidden"
        animate="show"
        className="mb-6 grid grid-cols-3 gap-2.5"
      >
        {ORDERABLE_PROTEINS.map((p) => (
          <m.div key={p} variants={popItem}>
            <Chip
              selected={profile.prefer === p}
              onClick={() =>
                update({ prefer: profile.prefer === p ? null : p })
              }
            >
              {RECIPES[p].emoji} {RECIPES[p].name}
            </Chip>
          </m.div>
        ))}
      </m.div>

      <p className="mb-2 text-sm font-bold text-ink-soft">
        ¿Hay algo que debamos evitar? (alergias)
      </p>
      <div className="mb-6 flex flex-wrap gap-2.5">
        {ORDERABLE_PROTEINS.map((p) => (
          <Chip
            key={p}
            selected={profile.avoid.includes(p)}
            onClick={() => toggleAvoid(p)}
          >
            🚫 {RECIPES[p].name}
          </Chip>
        ))}
      </div>

      <p className="mb-2 text-sm font-bold text-ink-soft">
        Notas de salud (opcional)
      </p>
      <textarea
        value={profile.health}
        onChange={(e) => update({ health: e.target.value })}
        rows={3}
        placeholder="Ej. estómago sensible, alergia a la piel, problemas renales, en tratamiento…"
        className="focus-ring w-full resize-none rounded-2xl border-2 border-line bg-white/70 px-4 py-3.5 placeholder:text-ink-soft/55"
      />
    </div>
  );
}
