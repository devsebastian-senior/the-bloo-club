import { Instagram, Mail } from "lucide-react";
import { INSTAGRAM } from "../../data/content";
import { SITE } from "../../data/plans";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-deep/50">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <img
              src="/logo.avif"
              alt=""
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-lg font-semibold text-ink">
              The Bloo Club
            </span>
          </div>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-ink-soft">
            Healthy meals. Cozy Bowdanas. Happy pups. Happy homes. Un movimiento
            por vidas más largas y felices para los perros.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm sm:items-end">
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            <Instagram size={15} /> @theblooclub
          </a>
          <a
            href={`${SITE}/pages/meal-by-size-plan`}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            <Mail size={15} /> Contacto
          </a>
          <p className="mt-2 text-xs text-ink-soft/70">
            © {new Date().getFullYear()} The Bloo Club · Estimaciones de
            mantenimiento, no prescripción veterinaria.
          </p>
        </div>
      </div>
    </footer>
  );
}
