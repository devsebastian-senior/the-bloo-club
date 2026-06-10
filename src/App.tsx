import { useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, Clock, HeartHandshake, Leaf } from "lucide-react";
import { emptyProfile, type DogProfile } from "./types";
import { buildRecommendation } from "./lib/calc";
import { PrimaryButton } from "./components/ui";
import { Wizard } from "./components/Wizard";
import { Result } from "./components/Result";
import { spring } from "./lib/motion";

type Phase = "intro" | "wizard" | "result";

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [profile, setProfile] = useState<DogProfile>(emptyProfile);

  const update = (patch: Partial<DogProfile>) =>
    setProfile((p) => ({ ...p, ...patch }));

  const rec = useMemo(
    () => (phase === "result" ? buildRecommendation(profile) : null),
    [phase, profile]
  );

  function restart() {
    setProfile(emptyProfile);
    setPhase("intro");
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="bg-paper relative min-h-dvh overflow-hidden">
        {/* Ambient brand blobs */}
      <div
        className="blob pointer-events-none fixed -left-24 top-10 h-80 w-80 rounded-full opacity-30"
        style={{ background: "var(--color-gold)" }}
      />
      <div
        className="blob pointer-events-none fixed -right-28 bottom-0 h-96 w-96 rounded-full opacity-25"
        style={{ background: "var(--color-bloo)", animationDelay: "-6s" }}
      />

      <Header onHome={restart} />

      <main className="relative mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 pb-16 pt-24">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <m.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={spring}
            >
              <Intro onStart={() => setPhase("wizard")} />
            </m.div>
          )}

          {phase === "wizard" && (
            <m.div
              key="wizard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={spring}
              className="rounded-xl2 bg-white/40 p-5 shadow-soft ring-1 ring-line/60 backdrop-blur-sm sm:p-7"
            >
              <Wizard
                profile={profile}
                update={update}
                onComplete={() => setPhase("result")}
                onExit={() => setPhase("intro")}
              />
            </m.div>
          )}

          {phase === "result" && rec && (
            <m.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={spring}
            >
              <Result profile={profile} rec={rec} onRestart={restart} />
            </m.div>
          )}
        </AnimatePresence>
      </main>
      </div>
    </LazyMotion>
  );
}

function Header({ onHome }: { onHome: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-xl items-center justify-between px-5 py-4">
        <button
          onClick={onHome}
          className="focus-ring flex items-center gap-2 rounded-full"
        >
          <img
            src="/logo.avif"
            alt="The Bloo Club"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-lg font-semibold tracking-tight">
            The Bloo Club
          </span>
        </button>
        <span className="hidden text-xs font-semibold uppercase tracking-wider text-ink-soft sm:block">
          Real food · real dogs
        </span>
      </div>
    </header>
  );
}

function Intro({ onStart }: { onStart: () => void }) {
  const bullets = [
    { icon: <Clock size={16} />, text: "2 minutos" },
    { icon: <Leaf size={16} />, text: "Porción exacta en gramos" },
    { icon: <HeartHandshake size={16} />, text: "Receta a su medida" },
  ];
  return (
    <div className="text-center">
      <m.img
        src="/logo.avif"
        alt="The Bloo Club"
        initial={{ scale: 0, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="mx-auto mb-5 h-28 w-28 object-contain drop-shadow-sm"
      />
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
        Real food for real dogs
      </p>
      <h1 className="font-display text-4xl font-semibold leading-[1.05] text-ink sm:text-5xl">
        ¿Qué necesita comer{" "}
        <span className="relative whitespace-nowrap">
          <span className="relative z-10">tu perro</span>
          <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-gold/60" />
        </span>
        ?
      </h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
        Comida fresca de grado humano para el verdadero jefe de la casa. Responde
        4 pasos y te decimos la receta, el plan y cuántos gramos darle al día.
      </p>

      <div className="mt-7">
        <PrimaryButton onClick={onStart}>
          Crear el plan de mi perro <ArrowRight size={18} />
        </PrimaryButton>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-ink-soft">
        {bullets.map((b) => (
          <span key={b.text} className="inline-flex items-center gap-1.5">
            <span className="text-sage">{b.icon}</span>
            {b.text}
          </span>
        ))}
      </div>
    </div>
  );
}

