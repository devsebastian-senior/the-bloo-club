import { m } from "framer-motion";
import { ArrowRight, ShieldCheck, Snowflake, Truck, Star } from "lucide-react";
import { PHOTOS, WHY_FRESH, HOW_IT_WORKS, TESTIMONIALS } from "../../data/content";
import { spring } from "../../lib/motion";
import { PrimaryButton } from "../ui";
import { RecipeCards } from "./RecipeCards";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { Footer } from "./Footer";

const viewport = { once: true, margin: "-80px" } as const;

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <m.section
      id={id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={spring}
      className={`mx-auto w-full max-w-5xl scroll-mt-24 px-5 py-14 sm:py-20 ${className}`}
    >
      {children}
    </m.section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-lg text-ink-soft">{sub}</p>}
    </div>
  );
}

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <>
      {/* ============================================================ Hero */}
      <section className="mx-auto w-full max-w-5xl px-5 pb-10 pt-28 sm:pt-32">
        <div className="grid items-center gap-10 sm:grid-cols-2">
          <div className="text-center sm:text-left">
            <m.img
              src="/logo.avif"
              alt="The Bloo Club"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ ...spring, delay: 0.05 }}
              className="mx-auto mb-5 h-24 w-24 object-contain sm:mx-0"
            />
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
              Real food for real dogs
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl">
              Comida fresca para el{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">verdadero jefe</span>
                <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-gold/25" />
              </span>{" "}
              de tu casa
            </h1>
            <p className="mt-4 max-w-md text-lg text-ink-soft sm:max-w-none">
              Recetas de grado humano, porcionadas a la medida de tu perro y
              entregadas en tu puerta. Crea su plan en 2 minutos.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:items-start">
              <PrimaryButton onClick={onStart}>
                Crear el plan de mi perro <ArrowRight size={18} />
              </PrimaryButton>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-ink-soft sm:justify-start">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-sage" /> AAFCO · grado humano
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Snowflake size={14} className="text-bloo" /> Enviado congelado
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Truck size={14} className="text-clay" /> Entrega local gratis
              </span>
            </div>
          </div>

          <m.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...spring, delay: 0.12 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-xl2 shadow-lift">
              <img
                src={PHOTOS.bowl}
                alt="Comida fresca The Bloo Club servida"
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-4 -left-2 rounded-2xl bg-ink px-4 py-2.5 text-cream shadow-lift sm:-left-6">
              <p className="text-xs text-cream/70">Porción exacta</p>
              <p className="font-display text-lg font-semibold">
                en gramos, por día 🐾
              </p>
            </div>
          </m.div>
        </div>
      </section>

      {/* ================================================== Social proof */}
      <Section className="py-8 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-xl2 bg-white/70 p-5 shadow-soft"
            >
              <div className="mb-2 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed text-ink">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-3 text-xs font-semibold text-ink-soft">
                {t.name} · <span className="font-normal">{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ===================================================== Why fresh */}
      <Section id="porque">
        <SectionTitle
          eyebrow="Por qué fresco"
          title="Tu perro no fue hecho para comer pellets"
          sub="La diferencia entre sobrevivir y vivir está en el plato."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {WHY_FRESH.map((w) => (
            <div key={w.title} className="rounded-xl2 bg-white/70 p-6 shadow-soft">
              <span className="text-3xl">{w.emoji}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {w.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {w.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ================================================== How it works */}
      <Section id="como" className="rounded-xl2">
        <SectionTitle
          eyebrow="Cómo funciona"
          title="Del quiz a su plato en 3 pasos"
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-xl2 border-2 border-line bg-cream p-6"
            >
              <span className="absolute -top-4 left-6 grid h-8 w-8 place-items-center rounded-full bg-gold font-display text-lg font-bold text-white">
                {s.step}
              </span>
              <span className="text-3xl">{s.emoji}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {s.text}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <PrimaryButton onClick={onStart}>
            Empezar ahora <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </Section>

      {/* ======================================================= Recipes */}
      <Section id="recetas">
        <SectionTitle
          eyebrow="Nuestras recetas"
          title="4 recetas, un solo estándar: comida real"
          sub="Carnes USDA, vegetales frescos y superfoods. Cumple perfiles AAFCO."
        />
        <RecipeCards />
      </Section>

      {/* ======================================================== Pricing */}
      <Section id="planes">
        <SectionTitle
          eyebrow="Planes y precios"
          title="Un plan del tamaño de tu perro"
          sub="Cada plan trae 30 días de comidas porcionadas. Suscríbete y ahorra."
        />
        <Pricing onStart={onStart} />
      </Section>

      {/* ============================================================ FAQ */}
      <Section id="faq" className="max-w-3xl">
        <SectionTitle eyebrow="Preguntas frecuentes" title="Lo que todos preguntan" />
        <FAQ />
      </Section>

      {/* ====================================================== Final CTA */}
      <Section className="text-center">
        <div className="relative overflow-hidden rounded-xl2 bg-ink px-6 py-14 text-cream shadow-lift">
          <div
            className="blob pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30"
            style={{ background: "var(--color-gold)" }}
          />
          <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">
            Su mejor vida empieza con su próximo plato
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-cream/75">
            2 minutos. 4 preguntas. Un plan hecho exactamente para tu perro.
          </p>
          <div className="relative mt-7">
            <m.button
              onClick={onStart}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              className="focus-ring inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-white shadow-lift"
            >
              Crear el plan de mi perro <ArrowRight size={18} />
            </m.button>
          </div>
        </div>
      </Section>

      <Footer />
    </>
  );
}
