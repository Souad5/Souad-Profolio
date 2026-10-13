import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useSections, useSiteSettings, useSkills } from "../../hooks/usePortfolio.js";
import { markIntroDone } from "../../lib/intro.js";

// Boot script timing (ms from mount). Each line types out over [start, end].
const T = {
  init: [0, 380],
  modules: [480, 1180],
  secure: [1280, 1680],
  compile: [1780, 2250],
  name: 2350,
  granted: 2700,
};
const HOLD_MS = 800; // "ACCESS GRANTED" stays readable at least this long
const MAX_WAIT_MS = 6500; // never hold visitors longer than this, API or not
const FALLBACK_MODULES = ["react", "node", "express", "mongodb"];
const RAIN_CHARS = "01アイウエオカキクケコサシスセソタチツテト<>/{}[]=+*$#";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Portion of `text` typed out at time `t` for a line spanning [start, end]. */
function typed(text, t, [start, end]) {
  if (t < start) return null;
  const p = Math.min(1, (t - start) / (end - start));
  return text.slice(0, Math.ceil(text.length * p));
}

// Faint falling-glyph backdrop. ~30 fps, DPR capped at 2.
function MatrixRain() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return undefined;

    const SIZE = 16;
    let drops = [];
    let raf = 0;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${SIZE}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      drops = Array.from({ length: Math.ceil(window.innerWidth / SIZE) }, () =>
        Math.floor((Math.random() * -window.innerHeight) / SIZE)
      );
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (frame++ % 2) return;
      ctx.fillStyle = "rgba(2, 8, 6, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      drops.forEach((y, i) => {
        const ch = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
        ctx.fillStyle = Math.random() > 0.96 ? "#d1fae5" : "#10b981";
        ctx.fillText(ch, i * SIZE, y * SIZE);
        drops[i] = y * SIZE > window.innerHeight && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-30" />;
}

/**
 * Hacker-terminal splash shown on every load of the home page. Types a boot
 * log, glitches the owner's name in, then "powers off" like a CRT to reveal
 * the site. Stays up until site settings + sections have loaded (capped), so
 * the page appears fully rendered. Any key, click or the skip button exits.
 */
export default function Preloader() {
  const { data: settings, isPending: settingsPending } = useSiteSettings();
  const { isPending: sectionsPending } = useSections();
  const { data: skills } = useSkills();

  const rootRef = useRef(null);
  const screenRef = useRef(null);
  const startRef = useRef(null);
  const modulesRef = useRef(null);

  const [reduced] = useState(reducedMotion);
  // Reduced motion skips the typing: everything is shown from the start.
  const [t, setT] = useState(() => (reducedMotion() ? Infinity : 0));
  const [fontsReady, setFontsReady] = useState(false);
  const [held, setHeld] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  // The static shell in index.html covered the page until now; this renders
  // the same dark frame, so swap it out. Lock scrolling while we're up
  // (released when `gone` flips: the component renders null but stays mounted).
  useEffect(() => {
    document.getElementById("boot-shell")?.remove();
    if (gone) return undefined;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [gone]);

  // Boot clock driving the typed lines.
  useEffect(() => {
    if (reduced) return undefined;
    startRef.current ??= performance.now();
    let raf = 0;
    const tick = () => {
      const now = performance.now() - startRef.current;
      setT(now);
      if (now < T.granted) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  useEffect(() => {
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => alive && setFontsReady(true));
    const cap = setTimeout(() => setExiting(true), MAX_WAIT_MS);
    return () => {
      alive = false;
      clearTimeout(cap);
    };
  }, []);

  // The page renders underneath while we boot, which can stall frames and
  // land the last lines late, so hold from when they actually appear rather
  // than trusting the clock.
  const showGranted = t >= T.granted;
  useEffect(() => {
    if (!showGranted) return undefined;
    const id = setTimeout(() => setHeld(true), HOLD_MS);
    return () => clearTimeout(id);
  }, [showGranted]);

  const dataSettled = !settingsPending && !sectionsPending;
  useEffect(() => {
    if (held && dataSettled && fontsReady) setExiting(true);
  }, [held, dataSettled, fontsReady]);

  // Skip on any key (Tab/Shift excepted, so the skip button stays reachable).
  const skip = useCallback(() => setExiting(true), []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Tab" && e.key !== "Shift") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [skip]);

  // CRT power-off: collapse to a bright line, then to a dot, then vanish.
  useGSAP(
    () => {
      if (!exiting) return;
      markIntroDone();
      const done = () => setGone(true);

      if (reduced) {
        gsap.to(rootRef.current, { opacity: 0, duration: 0.3, ease: "power1.out", onComplete: done });
        return;
      }

      gsap
        .timeline({ onComplete: done })
        .to("[data-crt='content']", { opacity: 0, duration: 0.12 }, 0)
        .to(
          screenRef.current,
          { scaleY: 0.006, backgroundColor: "#d1fae5", duration: 0.3, ease: "power3.in" },
          0
        )
        .to(screenRef.current, {
          scaleX: 0.004,
          boxShadow: "0 0 60px 20px rgba(52,211,153,0.9)",
          duration: 0.22,
          ease: "power3.in",
        })
        .to(screenRef.current, { opacity: 0, duration: 0.18, ease: "power1.out" });
    },
    { scope: rootRef, dependencies: [exiting, reduced] }
  );

  if (gone) return null;

  // Module names come from the skills in the DB; frozen once the line starts
  // so the text never changes mid-typing.
  if (t >= T.modules[0] && !modulesRef.current) {
    const names = (Array.isArray(skills) ? skills : [])
      .flatMap((c) => c?.skills ?? [])
      .filter((sk) => sk?.enabled !== false && sk?.name)
      .map((sk) => sk.name.toLowerCase())
      .slice(0, 4);
    modulesRef.current = names.length ? names : FALLBACK_MODULES;
  }
  const modules = modulesRef.current ?? FALLBACK_MODULES;

  const pct = Math.round(Math.min(1, Math.max(0, (t - T.compile[0]) / (T.compile[1] - T.compile[0]))) * 100);
  const bar = "█".repeat(Math.round(pct / 5)).padEnd(20, "░");
  const name = (settings?.name || (settingsPending ? "" : "Portfolio")).toUpperCase();

  const lines = [
    typed("initializing portfolio…", t, T.init),
    typed(`loading modules: ${modules.map((m) => `${m} ✓`).join(" ")}`, t, T.modules),
    typed("establishing secure connection… OK", t, T.secure),
    t >= T.compile[0] ? `compiling assets [${bar}] ${pct}%` : null,
  ].filter((l) => l !== null);
  const showName = t >= T.name && name;

  return (
    <div
      ref={rootRef}
      onPointerDown={skip}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      <span role="status" className="sr-only">
        Loading portfolio
      </span>

      <div
        ref={screenRef}
        className="absolute inset-0 overflow-hidden bg-[#020806] font-mono text-[#34d399]"
      >
        <div data-crt="content" className="absolute inset-0">
          {!reduced && <MatrixRain />}
          {/* Vignette + scanlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)]"
          />
          <div aria-hidden="true" className="crt-scanlines pointer-events-none absolute inset-0" />

          <div aria-hidden="true" className="relative flex h-full items-center justify-center px-5">
            <div className="w-full max-w-2xl rounded-lg border border-emerald-500/20 bg-black/60 p-5 shadow-[0_0_40px_rgba(16,185,129,0.15)] backdrop-blur-sm sm:p-7">
              <div className="mb-4 flex items-center gap-1.5 border-b border-emerald-500/15 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-3 text-[11px] tracking-widest text-emerald-500/60">root@portfolio:~</span>
              </div>

              <div className="min-h-[13rem] space-y-1.5 text-xs leading-relaxed sm:text-sm">
                {lines.map((line, i) => (
                  <p key={i} className="break-words text-emerald-300/85">
                    <span className="text-emerald-500">&gt; </span>
                    {line}
                    {i === lines.length - 1 && !showName && <span className="crt-cursor" />}
                  </p>
                ))}

                {showName && (
                  <p
                    data-text={name}
                    className="crt-glitch pt-4 text-2xl font-bold tracking-[0.12em] text-emerald-200 sm:text-4xl"
                  >
                    {name}
                  </p>
                )}
                {showGranted && (
                  <p className="pt-2 text-sm font-bold tracking-[0.3em] text-emerald-400 [text-shadow:0_0_12px_rgba(52,211,153,0.8)] sm:text-base">
                    ACCESS GRANTED
                    <span className="crt-cursor" />
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={skip}
            className="absolute bottom-5 right-5 rounded border border-emerald-500/30 px-3 py-1.5 text-xs tracking-widest text-emerald-400/80 transition hover:border-emerald-400 hover:text-emerald-300 focus-visible:outline-emerald-400"
          >
            [ skip ]
          </button>
        </div>
      </div>
    </div>
  );
}
