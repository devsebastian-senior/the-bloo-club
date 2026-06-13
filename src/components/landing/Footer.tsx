import { Instagram, Mail, MapPin, ArrowRight } from "lucide-react";
import { INSTAGRAM } from "../../data/content";
import { SITE } from "../../data/plans";
import { POLICIES, LEGAL_CONTACT } from "../../data/legal";

const NAV = [
  { href: "#porque", label: "Por qué fresco" },
  { href: "#como", label: "Cómo funciona" },
  { href: "#recetas", label: "Recetas" },
  { href: "#planes", label: "Planes y precios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

export function Footer({ onLegal }: { onLegal: (id: string) => void }) {
  return (
    <footer className="border-t border-line bg-cream-deep/60">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src="/logo.avif"
              alt="The Bloo Club"
              className="h-20 w-20 object-contain"
            />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-soft">
              Comida fresca de grado humano para el verdadero jefe de la casa. Un
              movimiento por vidas más sanas, felices y largas.
            </p>
            <a
              href="#plan"
              className="focus-ring mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-cream transition-transform hover:scale-105"
            >
              Crear el plan de mi perro <ArrowRight size={15} />
            </a>
            <div className="mt-4 flex gap-2">
              <a
                href={INSTAGRAM}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white/70 text-ink transition-colors hover:bg-gold hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`mailto:${LEGAL_CONTACT.email}`}
                aria-label="Correo"
                className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white/70 text-ink transition-colors hover:bg-gold hover:text-white"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <nav aria-label="Navegación">
            <p className="mb-3 font-head text-sm font-bold uppercase tracking-wider text-ink">
              Explorar
            </p>
            <ul className="space-y-2 text-sm">
              {NAV.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="focus-ring text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <p className="mb-3 font-head text-sm font-bold uppercase tracking-wider text-ink">
              Legal
            </p>
            <ul className="space-y-2 text-sm">
              {POLICIES.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onLegal(p.id)}
                    className="focus-ring text-left text-ink-soft transition-colors hover:text-ink"
                  >
                    {p.short}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <p className="mb-3 font-head text-sm font-bold uppercase tracking-wider text-ink">
              Contacto
            </p>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              <li>
                <a
                  href={`mailto:${LEGAL_CONTACT.email}`}
                  className="focus-ring inline-flex items-center gap-2 transition-colors hover:text-ink"
                >
                  <Mail size={15} className="shrink-0 text-gold-deep" />
                  {LEGAL_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 transition-colors hover:text-ink"
                >
                  <Instagram size={15} className="shrink-0 text-gold-deep" />
                  @theblooclub
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold-deep" />
                {LEGAL_CONTACT.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-center text-xs text-ink-soft/80 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {LEGAL_CONTACT.company}. Todos los
            derechos reservados.
          </p>
          <p>
            Estimaciones de mantenimiento, no prescripción veterinaria ·{" "}
            <a
              href={SITE}
              target="_blank"
              rel="noreferrer"
              className="focus-ring font-semibold text-ink-soft underline decoration-2 underline-offset-2 hover:text-ink"
            >
              theblooclub.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
