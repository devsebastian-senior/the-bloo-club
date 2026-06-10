import { Fragment } from "react";
import { m } from "framer-motion";
import { ExternalLink, ScrollText } from "lucide-react";
import { POLICIES, getPolicy, LEGAL_CONTACT } from "../../data/legal";
import type { PolicyBlock } from "../../data/legal";
import { spring } from "../../lib/motion";

/** Group flat blocks into renderable chunks (heading + following content). */
function renderBlocks(blocks: PolicyBlock[]) {
  const out: React.ReactNode[] = [];
  let list: string[] = [];

  const flushList = (key: string) => {
    if (!list.length) return;
    out.push(
      <ul key={key} className="ml-5 list-disc space-y-1.5">
        {list.map((li) => (
          <li key={li.slice(0, 40)} className="text-sm leading-relaxed text-ink-soft">
            {li}
          </li>
        ))}
      </ul>
    );
    list = [];
  };

  blocks.forEach((b, i) => {
    if (b.t === "li") {
      list.push(b.x);
      return;
    }
    flushList(`ul-${i}`);
    if (b.t === "h") {
      out.push(
        <h3
          key={`h-${i}`}
          className="mt-6 font-head text-base font-bold uppercase tracking-wide text-ink first:mt-0"
        >
          {b.x}
        </h3>
      );
    } else {
      out.push(
        <p key={`p-${i}`} className="text-sm leading-relaxed text-ink-soft">
          {b.x}
        </p>
      );
    }
  });
  flushList("ul-end");
  return out;
}

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
        <p className="mt-1 text-xs text-ink-soft">
          Documento oficial de The Bloo Club, palabra por palabra (inglés).
        </p>
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

      <m.article
        key={policy.id}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="space-y-3 rounded-xl2 bg-white/75 p-6 shadow-soft sm:p-8"
      >
        {renderBlocks(policy.blocks).map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
      </m.article>

      <div className="mt-4 rounded-xl2 border-2 border-dashed border-line p-5 text-center text-xs leading-relaxed text-ink-soft">
        <a
          href={policy.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-1 font-bold text-gold-deep underline decoration-2 underline-offset-2"
        >
          Ver en theblooclub.com <ExternalLink size={11} />
        </a>
        <br />
        {LEGAL_CONTACT.company} · {LEGAL_CONTACT.address} · {LEGAL_CONTACT.email}
      </div>
    </div>
  );
}
