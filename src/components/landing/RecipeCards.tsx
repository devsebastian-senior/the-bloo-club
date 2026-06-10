import { m } from "framer-motion";
import { RECIPES, GUARANTEED, PROTEIN_ORDER } from "../../data/recipes";
import { listStagger, popItem } from "../../lib/motion";

export function RecipeCards() {
  return (
    <>
      <m.div
        variants={listStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {PROTEIN_ORDER.map((p) => {
          const r = RECIPES[p];
          return (
            <m.article
              key={p}
              variants={popItem}
              className="flex flex-col rounded-xl2 bg-white/75 p-5 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">{r.emoji}</span>
                {!r.orderable && (
                  <span className="rounded-full bg-cream-deep px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                    Bajo pedido
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
                {r.name}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{r.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.goodFor.map((g) => (
                  <span
                    key={g}
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      background: `color-mix(in srgb, var(--color-${r.accent}) 14%, transparent)`,
                      color: `var(--color-${r.accent})`,
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-ink-soft/90">
                {r.ingredients}
              </p>
            </m.article>
          );
        })}
      </m.div>

      <div className="mx-auto mt-8 grid max-w-xl grid-cols-4 gap-2">
        {GUARANTEED.map((g) => (
          <div key={g.label} className="rounded-xl bg-white/60 px-2 py-3 text-center">
            <p className="font-head text-xl font-bold text-ink">{g.value}</p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase leading-tight text-ink-soft">
              {g.label}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-ink-soft/80">
        Análisis garantizado · ~240 kcal por sobre de 8 oz
      </p>
    </>
  );
}
