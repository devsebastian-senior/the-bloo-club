import { m } from "framer-motion";
import { ExternalLink, ScrollText } from "lucide-react";
import { POLICIES, getPolicy, LEGAL_CONTACT } from "../../data/legal";
import { listStagger, popItem } from "../../lib/motion";

export function Legal({
  policyId,
  onSelect,
}: {
  policyId: string;
  onSelect: (id: string) => void;
}) {
  const policy = getPolicy(policyId) ?? POLICIES[0];

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-deep px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink-soft">
          <ScrollText size={13} /> Legal
        </span>
        <h2 className="mt-3 font-head text-3xl font-bold leading-tight text-ink">
          {policy.title}
        </h2>
      </div>

      {/* Policy switcher */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {POLICIES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className={`focus-ring rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
              p.id === policy.id
                ? "border-ink bg-ink text-cream"
                : "border-line bg-white/60 text-ink-soft hover:border-ink/40"
            }`}
          >
            {p.short}
          </button>
        ))}
      </div>

      <m.div
        key={policy.id}
        variants={listStagger}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {policy.sections.map((s) => (
          <m.section
            key={s.h}
            variants={popItem}
            className="rounded-xl2 bg-white/75 p-5 shadow-soft"
          >
            <h3 className="font-head text-lg font-bold text-ink">{s.h}</h3>
            {s.p.map((para) => (
              <p
                key={para.slice(0, 32)}
                className="mt-2 text-sm leading-relaxed text-ink-soft"
              >
                {para}
              </p>
            ))}
          </m.section>
        ))}

        <m.div
          variants={popItem}
          className="rounded-xl2 border-2 border-dashed border-line p-5 text-center text-xs leading-relaxed text-ink-soft"
        >
          Resumen en español como cortesía. El documento oficial en inglés es el
          que rige.{" "}
          <a
            href={policy.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center gap-1 font-bold text-gold-deep underline decoration-2 underline-offset-2"
          >
            Ver documento oficial <ExternalLink size={11} />
          </a>
          <br />
          {LEGAL_CONTACT.company} · {LEGAL_CONTACT.address} ·{" "}
          {LEGAL_CONTACT.email}
        </m.div>
      </m.div>
    </div>
  );
}
