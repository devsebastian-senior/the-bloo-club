import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Legal } from "./Legal";
import { Footer } from "./Footer";

export function LegalPage({
  policyId,
  onLegal,
  onHome,
}: {
  policyId: string;
  onLegal: (id: string) => void;
  onHome: () => void;
}) {
  // New policy = top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [policyId]);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-line/60 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
          <a href="#" aria-label="The Bloo Club — inicio" className="focus-ring inline-flex rounded-full">
            <img src="/logo.avif" alt="The Bloo Club" className="h-12 w-12 object-contain" />
          </a>
          <button
            type="button"
            onClick={onHome}
            className="focus-ring inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft size={16} /> Volver al inicio
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12">
        <Legal policyId={policyId} onSelect={onLegal} />
      </main>

      <Footer onLegal={onLegal} />
    </div>
  );
}
