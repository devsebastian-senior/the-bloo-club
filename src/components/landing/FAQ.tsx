import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQS } from "../../data/content";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className="overflow-hidden rounded-2xl border-2 border-line bg-white/70"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="focus-ring flex w-full items-center justify-between gap-3 px-5 py-4 text-left font-bold text-ink"
            >
              {f.q}
              <m.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.18 }}
                className="shrink-0 text-gold-deep"
              >
                <Plus size={18} strokeWidth={3} />
              </m.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <m.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
