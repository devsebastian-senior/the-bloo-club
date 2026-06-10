import { useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import type { DogProfile } from "../types";
import { stepVariants, spring } from "../lib/motion";
import { PrimaryButton } from "./ui";
import { StepBreed, StepAge, StepBody, StepNotes } from "./steps";

const STEPS = [StepBreed, StepAge, StepBody, StepNotes] as const;

export function Wizard({
  profile,
  update,
  onComplete,
  onExit,
}: {
  profile: DogProfile;
  update: (patch: Partial<DogProfile>) => void;
  onComplete: () => void;
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const valid = useMemo(() => {
    switch (index) {
      case 0:
        return profile.breedId !== null || profile.sizeOverride !== null;
      case 1:
        return profile.ageMonths !== null && profile.ageMonths >= 0;
      case 2:
        return profile.weightKg !== null && profile.weightKg > 0;
      default:
        return true;
    }
  }, [index, profile]);

  const isLast = index === STEPS.length - 1;
  const Step = STEPS[index];

  function next() {
    if (!valid) return;
    if (isLast) return onComplete();
    setDir(1);
    setIndex((i) => i + 1);
  }
  function back() {
    if (index === 0) return onExit();
    setDir(-1);
    setIndex((i) => i - 1);
  }

  return (
    <div className="flex w-full flex-col">
      {/* Progress */}
      <div className="mb-7 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
          >
            <m.div
              className="h-full rounded-full bg-ink"
              initial={false}
              animate={{ width: i <= index ? "100%" : "0%" }}
              transition={spring}
            />
          </div>
        ))}
      </div>

      {/* Animated step */}
      <div className="relative min-h-[22rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <m.div
            key={index}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Step profile={profile} update={update} />
          </m.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          className="focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} /> {index === 0 ? "Inicio" : "Atrás"}
        </button>

        <PrimaryButton onClick={next} disabled={!valid}>
          {isLast ? (
            <>
              <Sparkles size={18} /> Ver el plan
            </>
          ) : (
            <>
              Siguiente <ArrowRight size={18} />
            </>
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}
