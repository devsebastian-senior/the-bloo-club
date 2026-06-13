import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { X } from "lucide-react";
import { emptyProfile, type DogProfile } from "./types";
import { buildRecommendation } from "./lib/calc";
import { Wizard } from "./components/Wizard";
import { Result } from "./components/Result";
import { Landing } from "./components/landing/Landing";
import { LegalPage } from "./components/landing/LegalPage";
import { spring } from "./lib/motion";
import { track } from "./lib/track";

type Overlay = "wizard" | "result" | null;

function hashState() {
  const h = window.location.hash;
  return {
    wizard: h === "#plan",
    legalId: h.startsWith("#legal/") ? h.slice(7) : null,
  };
}

export default function App() {
  const init = hashState();
  const [overlay, setOverlay] = useState<Overlay>(init.wizard ? "wizard" : null);
  const [legalId, setLegalId] = useState<string | null>(init.legalId);
  const [profile, setProfile] = useState<DogProfile>(emptyProfile);

  const update = (patch: Partial<DogProfile>) =>
    setProfile((p) => ({ ...p, ...patch }));

  const rec = useMemo(
    () => (overlay === "result" ? buildRecommendation(profile) : null),
    [overlay, profile]
  );

  const openPlan = useCallback(() => {
    track("wizard_open");
    setLegalId(null);
    setOverlay("wizard");
    if (window.location.hash !== "#plan") window.location.hash = "plan";
  }, []);

  const openLegal = useCallback((id: string) => {
    setOverlay(null);
    setLegalId(id);
    window.location.hash = `legal/${id}`;
  }, []);

  const close = useCallback(() => {
    setOverlay(null);
    if (window.location.hash)
      history.replaceState(null, "", window.location.pathname);
  }, []);

  const goHome = useCallback(() => {
    setLegalId(null);
    if (window.location.hash)
      history.replaceState(null, "", window.location.pathname);
  }, []);

  // Back button / manual hash edits keep routes in sync.
  useEffect(() => {
    const onHash = () => {
      const s = hashState();
      setLegalId(s.legalId);
      if (!s.legalId) setOverlay(s.wizard ? "wizard" : null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Lock page scroll only while the quiz overlay is open.
  useEffect(() => {
    document.body.style.overflow = overlay ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay]);

  function restart() {
    setProfile(emptyProfile);
    setOverlay("wizard");
  }

  // -------------------------------------------------- Legal as a full page
  if (legalId) {
    return (
      <LazyMotion features={domAnimation} strict>
        <LegalPage policyId={legalId} onLegal={openLegal} onHome={goHome} />
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="bg-paper relative min-h-dvh overflow-x-clip">
        {/* Ambient brand blobs */}
        <div
          className="blob pointer-events-none fixed -left-24 top-10 h-80 w-80 rounded-full opacity-15"
          style={{ background: "var(--color-gold)" }}
        />
        <div
          className="blob pointer-events-none fixed -right-28 bottom-0 h-96 w-96 rounded-full opacity-10"
          style={{ background: "var(--color-bloo)", animationDelay: "-6s" }}
        />

        <Header onStart={openPlan} />

        <main className="relative">
          <Landing onStart={openPlan} onLegal={openLegal} />
        </main>

        {/* ============================================ Wizard / Result */}
        <AnimatePresence>
          {overlay && (
            <m.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 overflow-y-auto bg-cream/95 backdrop-blur-sm"
            >
              <m.div
                initial={{ opacity: 0, y: 32, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 32, scale: 0.98 }}
                transition={spring}
                className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-5 py-16"
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="focus-ring fixed right-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft transition-colors hover:bg-white"
                >
                  <X size={18} />
                </button>

                {overlay === "wizard" && (
                  <div className="rounded-xl2 bg-white/50 p-5 shadow-soft ring-1 ring-line/60 backdrop-blur-sm sm:p-7">
                    <Wizard
                      profile={profile}
                      update={update}
                      onComplete={() => {
                        track("wizard_complete");
                        setOverlay("result");
                      }}
                      onExit={close}
                    />
                  </div>
                )}

                {overlay === "result" && rec && (
                  <Result profile={profile} rec={rec} onRestart={restart} />
                )}
              </m.div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

function Header({ onStart }: { onStart: () => void }) {
  const links = [
    { href: "#porque", label: "Por qué" },
    { href: "#recetas", label: "Recetas" },
    { href: "#planes", label: "Planes" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-line/60 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <a
          href="#"
          aria-label="The Bloo Club — inicio"
          className="focus-ring inline-flex rounded-full"
        >
          <img
            src="/logo.avif"
            alt="The Bloo Club"
            className="h-12 w-12 object-contain transition-transform hover:scale-105 sm:h-14 sm:w-14"
          />
        </a>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-ink-soft md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring rounded transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          onClick={onStart}
          className="focus-ring rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream transition-transform hover:scale-105"
        >
          Crear plan
        </button>
      </div>
    </header>
  );
}
