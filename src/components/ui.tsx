import { m } from "framer-motion";
import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { popItem, spring } from "../lib/motion";

/* ------------------------------------------------------------------ Button */
export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <m.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={spring}
      className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-base font-bold text-cream shadow-soft transition-colors disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </m.button>
  );
}

export function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- OptionCard */
export function OptionCard({
  selected,
  onClick,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <m.button
      type="button"
      variants={popItem}
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`focus-ring relative flex w-full items-center gap-3 rounded-2xl border-2 bg-white/70 p-4 text-left backdrop-blur transition-colors ${
        selected
          ? "border-ink shadow-soft"
          : "border-line hover:border-ink/30"
      }`}
    >
      {icon && (
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream-deep text-2xl">
          {icon}
        </span>
      )}
      <span className="min-w-0">
        <span className="block font-bold leading-tight">{title}</span>
        {subtitle && (
          <span className="mt-0.5 block text-sm text-ink-soft">{subtitle}</span>
        )}
      </span>
      {selected && (
        <m.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          className="ml-auto grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-cream"
          transition={spring}
        >
          <Check size={14} strokeWidth={3} />
        </m.span>
      )}
    </m.button>
  );
}

/* -------------------------------------------------------------------- Chip */
export function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={spring}
      className={`focus-ring rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
        selected
          ? "border-ink bg-ink text-cream"
          : "border-line bg-white/60 text-ink-soft hover:border-ink/40"
      }`}
    >
      {children}
    </m.button>
  );
}

/* ------------------------------------------------------------ Step header */
export function StepHeader({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-deep">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-[1.1] text-ink sm:text-4xl">
        {title}
      </h2>
      {hint && <p className="mt-2 text-ink-soft">{hint}</p>}
    </div>
  );
}
