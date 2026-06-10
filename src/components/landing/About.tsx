import { m } from "framer-motion";
import { Heart } from "lucide-react";
import { ABOUT } from "../../data/content";
import { listStagger, popItem, spring } from "../../lib/motion";

export function About() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2">
      {/* Founder photo with tilted brand frame */}
      <m.div
        initial={{ opacity: 0, x: -32, rotate: -4 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={spring}
        className="relative mx-auto w-full max-w-md"
      >
        <div
          className="absolute inset-0 -rotate-3 rounded-xl2"
          style={{ background: "var(--color-gold)", opacity: 0.18 }}
        />
        <div className="relative rotate-1 overflow-hidden rounded-xl2 shadow-lift transition-transform duration-300 hover:rotate-0">
          <img
            src={ABOUT.founderPhoto}
            alt={`${ABOUT.founderName}, ${ABOUT.founderTitle} de The Bloo Club`}
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
        </div>
        <m.figcaption
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...spring, delay: 0.2 }}
          className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-2xl bg-ink px-5 py-2.5 text-center text-cream shadow-lift"
        >
          <p className="font-head text-base font-bold">
            {ABOUT.founderName}
          </p>
          <p className="text-xs text-cream/70">{ABOUT.founderTitle}</p>
        </m.figcaption>
      </m.div>

      {/* Story */}
      <m.div
        variants={listStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <m.p
          variants={popItem}
          className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-deep"
        >
          Nuestra historia
        </m.p>
        <m.h2
          variants={popItem}
          className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl"
        >
          Una meta:{" "}
          <span className="relative whitespace-nowrap">
            <span className="relative z-10">{ABOUT.mission}</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-gold/25" />
          </span>
        </m.h2>

        {ABOUT.paragraphs.map((p) => (
          <m.p
            key={p.slice(0, 24)}
            variants={popItem}
            className="mt-4 leading-relaxed text-ink-soft"
          >
            {p}
          </m.p>
        ))}

        <m.blockquote
          variants={popItem}
          className="mt-6 rounded-xl2 border-l-4 border-gold bg-white/70 p-5 shadow-soft"
        >
          <Heart size={18} className="mb-2 text-gold" fill="currentColor" />
          <p className="font-head text-lg font-bold leading-snug text-ink">
            {ABOUT.movement}
          </p>
        </m.blockquote>
      </m.div>
    </div>
  );
}
