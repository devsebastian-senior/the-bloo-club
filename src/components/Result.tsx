import { useEffect, useState } from "react";
import { m, useMotionValue, animate } from "framer-motion";
import {
  RotateCcw,
  Check,
  Info,
  ExternalLink,
  ShoppingCart,
  Sparkles,
  Snowflake,
  ShieldCheck,
  Truck,
  AlertTriangle,
  Stethoscope,
  MessageCircle,
} from "lucide-react";
import type { DogProfile, Recommendation } from "../types";
import { RECIPES, GUARANTEED } from "../data/recipes";
import { TIER_LABEL, TIER_NOTE, TRIAL, SLEEVE_GRAMS, SITE } from "../data/plans";
import { cartUrl, TRIAL_VARIANT } from "../data/variants";
import { listStagger, popItem } from "../lib/motion";
import { PrimaryButton, GhostButton } from "./ui";
import { track } from "../lib/track";

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const mv = useMotionValue(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, mv]);
  return (
    <span>
      {shown}
      <span className="text-xl text-ink-soft">{suffix}</span>
    </span>
  );
}

function MedicalBanner() {
  return (
    <m.div
      variants={popItem}
      className="mb-4 flex gap-3 rounded-xl2 border-2 border-gold/50 bg-gold/10 p-4"
    >
      <Stethoscope size={20} className="mt-0.5 shrink-0 text-gold-deep" />
      <p className="text-sm text-ink">
        Tu perro tiene una condición que necesita{" "}
        <strong>validación veterinaria</strong>. Usa este plan solo como
        referencia y <strong>habla con soporte</strong> antes de comprar.
      </p>
    </m.div>
  );
}

export function Result({
  profile,
  rec,
  onRestart,
}: {
  profile: DogProfile;
  rec: Recommendation;
  onRestart: () => void;
}) {
  const name = profile.dogName.trim() || "tu perro";

  useEffect(() => {
    track("plan_result", {
      plan: rec.planLabel,
      recipe: rec.recipe ?? "none",
      available: rec.recipeAvailable,
    });
  }, [rec.planLabel, rec.recipe, rec.recipeAvailable]);

  /* ---------------------------------------- No recipe clears the allergies */
  if (!rec.recipeAvailable || !rec.recipe) {
    return (
      <m.div variants={listStagger} initial="hidden" animate="show" className="w-full">
        {rec.medicalReview && <MedicalBanner />}
        <m.div variants={popItem} className="rounded-xl2 bg-ink p-8 text-center text-cream shadow-lift">
          <span className="text-5xl">🐾</span>
          <h2 className="mt-3 font-display text-3xl font-semibold">
            Lo armamos a la medida de {name}
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-cream/75">
            Con esas alergias, ninguna de nuestras recetas actuales es 100% apta.
            Escríbenos y preparamos algo especial para {name}.
          </p>
          <div className="mt-4 rounded-xl bg-cream/10 p-3 text-sm text-cream/80">
            Calorías estimadas: <strong>{rec.kcalPerDay} kcal/día</strong> ·
            Plan {rec.planLabel}
          </div>
          <a
            href={`${SITE}/pages/meal-by-size-plan`}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("contact_no_recipe")}
            className="focus-ring mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            <MessageCircle size={16} /> Hablar con The Bloo Club
          </a>
        </m.div>
        <div className="mt-6 text-center">
          <GhostButton onClick={onRestart}>
            <RotateCcw size={15} /> Calcular otro perro
          </GhostButton>
        </div>
      </m.div>
    );
  }

  const recipe = RECIPES[rec.recipe];
  const alt = rec.altRecipe ? RECIPES[rec.altRecipe] : null;
  const extraWarnings = rec.warnings;

  return (
    <m.div variants={listStagger} initial="hidden" animate="show" className="w-full">
      <m.div variants={popItem} className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sage">
          <Check size={13} strokeWidth={3} /> Plan listo
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
          El plan de {name}
        </h2>
      </m.div>

      {rec.medicalReview && <MedicalBanner />}

      {/* Hero recipe card */}
      <m.div variants={popItem} className="relative overflow-hidden rounded-xl2 bg-ink p-6 text-cream shadow-lift">
        <div
          className="blob pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-40"
          style={{ background: `var(--color-${recipe.accent})` }}
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cream/60">
            Receta recomendada
          </p>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-5xl">{recipe.emoji}</span>
            <div>
              <h3 className="font-display text-3xl font-semibold">{recipe.name}</h3>
              <p className="text-sm text-cream/70">{recipe.tagline}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {recipe.goodFor.map((g) => (
              <span key={g} className="rounded-full bg-cream/10 px-3 py-1 text-xs font-semibold">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-cream/60">
            <span className="font-bold text-cream/80">Ingredientes: </span>
            {recipe.ingredients}
          </p>
          {rec.blend && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
              <Sparkles size={12} /> Sugerencia: mezcla {rec.blend}
            </div>
          )}
        </div>
      </m.div>

      {/* The 5 numbers: calories · food/day · per meal */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <m.div variants={popItem} className="rounded-xl2 bg-white/80 p-4 text-center shadow-soft">
          <p className="text-xs font-semibold text-ink-soft">Calorías/día</p>
          <p className="font-head text-2xl font-bold text-ink">
            <CountUp value={rec.kcalPerDay} suffix="" />
          </p>
          <p className="text-[11px] text-ink-soft/80">kcal</p>
        </m.div>
        <m.div variants={popItem} className="rounded-xl2 bg-white/80 p-4 text-center shadow-soft">
          <p className="text-xs font-semibold text-ink-soft">Comida/día</p>
          <p className="font-head text-2xl font-bold text-ink">
            <CountUp value={rec.gramsPerDay} suffix=" g" />
          </p>
          <p className="text-[11px] text-ink-soft/80">≈ {rec.sleevesPerDay} sobres</p>
        </m.div>
        <m.div variants={popItem} className="rounded-xl2 bg-white/80 p-4 text-center shadow-soft">
          <p className="text-xs font-semibold text-ink-soft">Por comida</p>
          <p className="font-head text-2xl font-bold text-ink">
            <CountUp value={rec.gramsPerMeal} suffix=" g" />
          </p>
          <p className="text-[11px] text-ink-soft/80">{rec.mealsPerDay} comidas</p>
        </m.div>
      </div>

      {/* Plan + price */}
      <m.div variants={popItem} className="mt-3 flex items-center justify-between rounded-xl2 bg-gold p-5 shadow-soft">
        <div>
          <p className="text-sm font-semibold text-ink/70">Plan The Bloo Club</p>
          <p className="font-display text-3xl font-semibold text-ink">{rec.planLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-ink">
            ${rec.priceOnce}
            <span className="text-sm font-semibold text-ink/60">/mes</span>
          </p>
          {rec.priceSub != null && (
            <p className="text-xs font-semibold text-ink/70">
              Suscríbete: ${rec.priceSub}/mes
            </p>
          )}
        </div>
      </m.div>

      {/* Plan tier */}
      <m.div variants={popItem} className="mt-4 flex items-center gap-3 rounded-xl2 bg-white/70 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cream-deep text-xl">
          {rec.tier === "underweight" ? "📈" : rec.tier === "weightControl" ? "📉" : "⚖️"}
        </span>
        <div>
          <p className="font-bold leading-tight">{TIER_LABEL[rec.tier]}</p>
          <p className="text-sm text-ink-soft">{TIER_NOTE[rec.tier]}</p>
        </div>
      </m.div>

      {/* Warnings (weight-control caution, etc.) */}
      {extraWarnings.length > 0 && (
        <m.div variants={popItem} className="mt-3 space-y-2">
          {extraWarnings.map((w) => (
            <div key={w.slice(0, 24)} className="flex gap-2 rounded-xl bg-gold/10 px-3 py-2 text-xs text-ink-soft">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-gold-deep" />
              <span>{w}</span>
            </div>
          ))}
        </m.div>
      )}

      {/* Guaranteed analysis */}
      <m.div variants={popItem} className="mt-4 grid grid-cols-4 gap-2">
        {GUARANTEED.map((g) => (
          <div key={g.label} className="rounded-xl bg-white/60 px-2 py-3 text-center">
            <p className="font-head text-xl font-bold text-ink">{g.value}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase leading-tight text-ink-soft">
              {g.label}
            </p>
          </div>
        ))}
      </m.div>

      {/* Reasons */}
      <m.div variants={popItem} className="mt-4 rounded-xl2 bg-white/70 p-5">
        <p className="mb-3 text-sm font-bold uppercase tracking-wider text-gold-deep">
          Por qué este plan
        </p>
        <ul className="space-y-2.5">
          {rec.reasons.map((r, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-ink-soft">
              <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-sage" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
        {alt && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-cream-deep px-3 py-2 text-xs text-ink-soft">
            <Info size={14} className="shrink-0" />
            Segunda opción si quieres rotar:{" "}
            <strong className="text-ink">{alt.emoji} {alt.name}</strong>
          </div>
        )}
      </m.div>

      {/* CTAs */}
      <m.div variants={popItem} className="mt-6 flex flex-col items-center gap-3">
        {rec.checkoutUrl && (
          <a
            href={rec.checkoutUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              track("checkout_click", {
                plan: rec.planLabel,
                recipe: rec.blend ? "mix3" : rec.recipe ?? "",
                price: rec.priceOnce,
              })
            }
          >
            <PrimaryButton>
              <ShoppingCart size={18} /> Añadir mi plan al carrito
            </PrimaryButton>
          </a>
        )}
        <a
          href={rec.productUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft underline decoration-2 underline-offset-2 transition-colors hover:text-ink"
        >
          o ver el plan {rec.planLabel} en la tienda <ExternalLink size={13} />
        </a>
        <a
          href={cartUrl(TRIAL_VARIANT)}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("trial_click", { from: "result" })}
          className="focus-ring max-w-sm rounded-2xl border-2 border-gold/60 bg-gold/10 px-4 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-gold/20"
        >
          🐾 ¿Probar primero? <strong>{TRIAL.name}</strong> · ${TRIAL.price} — {TRIAL.blurb}
        </a>
        <GhostButton onClick={onRestart}>
          <RotateCcw size={15} /> Calcular otro perro
        </GhostButton>
      </m.div>

      {/* Trust badges */}
      <m.div variants={popItem} className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-sage" /> AAFCO · grado humano
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Snowflake size={14} className="text-bloo" /> Enviado congelado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Truck size={14} className="text-clay" /> Entrega local gratis
        </span>
      </m.div>

      <m.p variants={popItem} className="mx-auto mt-4 max-w-sm text-center text-xs text-ink-soft/80">
        Estimación basada en peso, edad, BCS y actividad ({SLEEVE_GRAMS} g por
        sobre de 8 oz). Para condiciones médicas, confirma con tu veterinario. 🐾
      </m.p>
    </m.div>
  );
}
