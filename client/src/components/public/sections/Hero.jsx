import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useSiteSettings, useSkills } from "../../../hooks/usePortfolio.js";
import Icon from "../../ui/Icon.jsx";
import { AppButton } from "../../ui/app-button.jsx";
import { Section } from "./Section.jsx";

// Split the stored role/title (a single DB string like "MERN Stack Web
// Developer") into two balanced lines by word count: 4 words -> 2/2
// ("MERN STACK" / "WEB DEVELOPER"), 3 -> 2/1, 2 -> 1/1. Each line is short
// enough that the fluid font-size keeps it on ONE line (no 3rd-line wrap).
function splitRole(role) {
  const words = (role || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return ["", ""];
  if (words.length === 1) return [words[0], ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

function Waves() {
  return (
    <div
      id="hero-waves"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        className="absolute -left-10 top-[15%] w-[130%] text-slate-500/30 dark:text-slate-300/20"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path className="wave-path" pathLength={1} d="M0 150 C 200 30, 400 270, 600 150 S 1000 30, 1200 150" stroke="currentColor" strokeWidth="3" strokeDasharray="1" />
        <path className="wave-path" pathLength={1} d="M0 200 C 220 80, 420 320, 640 200 S 1020 80, 1200 200" stroke="currentColor" strokeWidth="2" strokeDasharray="1" />
        <path className="wave-path" pathLength={1} d="M0 110 C 180 40, 360 180, 560 110 S 940 40, 1200 110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1" />
      </svg>
      <svg
        className="absolute -right-10 bottom-[-6%] w-[120%] text-slate-500/20 dark:text-slate-300/15"
        viewBox="0 0 1200 260"
        fill="none"
        preserveAspectRatio="none"
      >
        <path className="wave-path" pathLength={1} d="M0 180 C 180 60, 360 260, 560 180 S 940 60, 1200 180" stroke="currentColor" strokeWidth="2" strokeDasharray="1" />
        <path className="wave-path" pathLength={1} d="M0 130 C 200 40, 400 220, 600 130 S 1000 40, 1200 130" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1" />
      </svg>
    </div>
  );
}

// Predefined peripheral slots (corners/edges) so floating skills never overlap
// the readable centered content. Hidden on small screens to keep mobile clean.
const FLOAT_SLOTS = [
  "left-[5%] top-[22%]",
  "left-[8%] top-[50%]",
  "right-[7%] top-[20%]",
  "right-[10%] top-[46%]",
  "left-[15%] bottom-[18%]",
  "right-[14%] bottom-[16%]",
  "left-[2%] bottom-[6%]",
  "right-[2%] bottom-[28%]",
];

function HeroSkeleton() {
  return (
    <Section name="home" className="relative flex min-h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="mx-auto w-full max-w-5xl animate-pulse px-5 pt-24 text-center sm:px-8">
        <div className="mx-auto h-4 w-56 rounded bg-muted" />
        <div className="mx-auto mt-8 h-20 w-[80%] rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-20 w-[70%] rounded-lg bg-muted" />
        <div className="mx-auto mt-8 h-4 w-full max-w-xl rounded bg-muted/60" />
        <div className="mx-auto mt-10 h-10 w-64 rounded-full bg-muted" />
        <div className="mx-auto mt-5 h-10 w-48 rounded-full bg-muted/60" />
      </div>
    </Section>
  );
}

function RoleWords({ text }) {
  const words = (text || "").split(/\s+/).filter(Boolean);
  if (words.length === 0) return null;
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="hero-word inline-block whitespace-nowrap">
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export default function Hero() {
  const { data: s, isLoading } = useSiteSettings();
  const { data: skills } = useSkills();

  const rootRef = useRef(null);

  // Flatten enabled skills to a stable subset for the floating decoration.
  const categories = Array.isArray(skills) ? skills : [];
  const floatingSkills = categories
    .flatMap((c) => c?.skills ?? [])
    .filter((sk) => sk && sk.enabled !== false && sk.icon && sk.icon !== "FaStar")
    .slice(0, FLOAT_SLOTS.length);

  const ready = !isLoading && !!s;

  const [line1, line2] = splitRole(s?.heroSubtitle || s?.title);
  const description = s?.heroDescription || s?.shortBio;

  // Entrance timeline + idle ambient loops, scoped for clean GSAP cleanup.
  useLayoutEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Waves "draw in" via stroke-dashoffset (pathLength=1 on each path).
      tl.fromTo(
        ".wave-path",
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", delay: 0.15 },
        0
      );

      // 2. Greeting slides/fades in.
      tl.fromTo(
        "[data-hero='greeting']",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "+=0.15"
      );

      // 3. Giant role text — a word-per-line stagger with y-offset for weight.
      tl.fromTo(
        ".hero-line",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.16 },
        "-=0.3"
      ).fromTo(
        ".hero-word",
        { opacity: 0, yPercent: 110 },
        { opacity: 1, yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.05 },
        "<"
      );

      // 4. Description + code icon, badge, buttons, socials stagger in.
      tl.fromTo(
        "[data-hero='sub']",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "-=0.2"
      );

      // 5. Floating skill icons reveal + start their own perpetual float.
      gsap.fromTo(
        ".hero-float",
        { opacity: 0, scale: 0.5, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.08,
          delay: tl.duration(),
        }
      );
      gsap.utils.toArray(".hero-float").forEach((el, i) => {
        const drift = 8 + (i % 4) * 3;
        gsap.to(el, {
          y: `+=${drift}`,
          duration: 3.2 + (i % 3),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: (i % 5) * 0.4,
        });
      });

      // Part 2 — ambient idle motion for waves + code icon (after entrance).
      gsap.to(".wave-path", {
        x: 40,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to("[data-hero='emblem']", {
        rotate: -8,
        scale: 1.08,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [ready, floatingSkills.length]);

  return (
    <Section
      name="home"
      className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden"
    >
      {/* --- Backdrop: waves + floating skill icons (all behind content) --- */}
      <div ref={rootRef} className="pointer-events-none absolute inset-0 z-0">
        <Waves />

        {/* Floating skill icons — desktop only, peripheral slots */}
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {floatingSkills.map((sk, i) => (
            <button
              key={sk.id ?? i}
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className={`hero-float pointer-events-auto absolute ${FLOAT_SLOTS[i % FLOAT_SLOTS.length]} flex h-12 w-12 items-center justify-center rounded-2xl border border-border/50 bg-muted/60 text-brand-600 shadow-sm backdrop-blur-sm transition hover:scale-110 hover:border-brand-500/60 hover:text-brand-600 dark:border-border/40 dark:bg-muted/20 dark:text-brand-400 dark:hover:border-brand-500/60 dark:hover:text-brand-400`}
              title={sk.name}
            >
              <Icon name={sk.icon} className="text-xl" />
            </button>
          ))}
        </div>
      </div>

      {/* Foreground content sits above the backdrop */}
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 pt-24 text-center sm:px-8">
        {/* 1. Greeting */}
        <p
          data-hero="greeting"
          className="text-sm font-bold uppercase tracking-[0.35em] text-foreground"
        >
          {s?.heroGreeting || "Hi there"}{" "}
          <span className="text-brand-600 dark:text-brand-400">{s?.name || "Souad"}</span>
        </p>

        {/* 2. Giant two-line role text (word-level spans for the stagger) */}
        <h1 className="mt-6 w-full font-display text-brand-600 dark:text-brand-400">
          <span className="hero-line block whitespace-nowrap text-[clamp(2.25rem,9.5vw,6.5rem)] leading-[0.95] font-extrabold uppercase tracking-[0.02em]">
            <RoleWords text={line1} />
          </span>
          <span className={`hero-line block whitespace-nowrap text-[clamp(2.25rem,9.5vw,6.5rem)] leading-[0.95] font-extrabold uppercase tracking-[0.02em] mt-2`}>
            <RoleWords text={line2} />
          </span>
        </h1>

        {/* 3. Description + code bracket */}
        {description && (
          <div data-hero="sub" className="mt-8">
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground dark:text-slate-400 sm:text-lg">
              {description}
            </p>
            <div
              data-hero="emblem"
              className="mt-5 flex items-center justify-center text-brand-600 dark:text-brand-400"
            >
              <Icon name="FaCode" className="h-9 w-9" />
            </div>
          </div>
        )}

        {/* 4. Availability badge */}
        <div data-hero="sub" className="mt-10">
          {s?.availability && (
            <p className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-slate-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {s.availability}
            </p>
          )}
        </div>

        {/* 5. Buttons */}
        <div data-hero="sub" className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {s?.resumeUrl && (
            <AppButton asChild className="rounded-full px-6 text-[15px] font-semibold">
              <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="FaDownload" className="h-4 w-4" />
                {s.heroPrimaryCta || "Resume"}
              </a>
            </AppButton>
          )}
          <AppButton asChild variant="outline" className="rounded-full px-6 text-[15px] font-semibold">
            <a href="#contact">{s?.heroSecondaryCta || "Contact"}</a>
          </AppButton>
        </div>

        {/* 6. Socials */}
        {s?.socialLinks?.length > 0 && (
          <div data-hero="sub" className="mt-8 flex justify-center gap-2.5">
            {s.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                title={link.label}
                className="rounded-xl border border-border/60 bg-muted/40 p-2.5 text-muted-foreground transition hover:border-brand-500/60 hover:text-brand-600 dark:border-border/40 dark:bg-muted/20 dark:text-slate-400 dark:hover:border-brand-500/60 dark:hover:text-brand-400"
              >
                <Icon name={link.icon} className="text-lg" />
              </a>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}