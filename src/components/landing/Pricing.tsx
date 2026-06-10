import { m } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { SizeKey } from "../../types";
import { PLANS, TRIAL, productUrl } from "../../data/plans";
import { PHOTOS } from "../../data/content";
import { listStagger, popItem, spring } from "../../lib/motion";
import { track } from "../../lib/track";

const SIZE_ORDER: SizeKey[] = ["xs", "s", "m", "l"];
const PLAN_PHOTO: Record<SizeKey, string> = {
  xs: PHOTOS.xs,
  s: PHOTOS.s,
  m: PHOTOS.m,
  l: PHOTOS.l,
};

export function Pricing({ onStart }: { onStart: () => void }) {
  return (
    <>
      <m.div
        variants={listStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {SIZE_ORDER.map((k) => {
          const p = PLANS[k];
          const savings = p.priceSub ? p.priceOnce - p.priceSub : 0;
          return (
            <m.article
              key={k}
              variants={popItem}
              className="flex flex-col overflow-hidden rounded-xl2 bg-white/80 shadow-soft"
            >
              <img
                src={PLAN_PHOTO[k]}
                alt={`Plan ${p.name} de The Bloo Club`}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  {p.name}
                </h3>
                <p className="text-sm text-ink-soft">
                  {p.lbMin}–{p.lbMax} lb ({p.kgMin}–{p.kgMax} kg)
                </p>
                <p className="mt-3 font-display text-3xl font-semibold text-ink">
                  ${p.priceSub ?? p.priceOnce}
                  <span className="text-base font-sans font-semibold text-ink-soft">
                    /mes
                  </span>
                </p>
                {savings > 0 && (
                  <p className="text-xs font-semibold text-gold-deep">
                    suscrito · ahorras ${savings} (${p.priceOnce} suelto)
                  </p>
                )}
                <p className="mt-2 text-xs text-ink-soft">
                  Ej: {p.exampleBreeds.slice(0, 3).join(", ")}
                </p>
                <a
                  href={productUrl(p.handle)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track("plan_card_click", { plan: p.name })}
                  className="focus-ring mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  Ver plan <ArrowRight size={14} />
                </a>
              </div>
            </m.article>
          );
        })}
      </m.div>

      {/* Trial anchor */}
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={spring}
        className="mt-6 flex flex-col items-center gap-5 rounded-xl2 bg-ink p-6 text-cream shadow-lift sm:flex-row"
      >
        <img
          src={PHOTOS.trial}
          alt="Paquete de prueba Sniff Us First"
          className="h-32 w-32 shrink-0 rounded-2xl object-cover"
          loading="lazy"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
            ¿Primera vez? Huele primero
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold">
            {TRIAL.name} · ${TRIAL.price}
          </h3>
          <p className="mt-1 text-sm text-cream/75">{TRIAL.blurb}</p>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-cream/70 sm:justify-start">
            <li className="inline-flex items-center gap-1">
              <Check size={12} className="text-gold" /> Sin suscripción
            </li>
            <li className="inline-flex items-center gap-1">
              <Check size={12} className="text-gold" /> Las 3 recetas
            </li>
          </ul>
        </div>
        <a
          href={productUrl(TRIAL.handle)}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("trial_click", { from: "pricing" })}
          className="focus-ring shrink-0 rounded-full bg-gold px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
        >
          Probar por ${TRIAL.price}
        </a>
      </m.div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        ¿No sabes cuál le toca?{" "}
        <button
          onClick={onStart}
          className="focus-ring font-bold text-gold-deep underline decoration-2 underline-offset-2"
        >
          Haz el quiz de 2 minutos
        </button>{" "}
        y te lo decimos con gramos exactos.
      </p>
    </>
  );
}
