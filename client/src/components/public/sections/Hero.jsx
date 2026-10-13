import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useSiteSettings, useSkills } from "../../../hooks/usePortfolio.js";
import Icon from "../../ui/Icon.jsx";
import { AppButton } from "../../ui/app-button.jsx";
import { Section } from "./Section.jsx";
import { PulseDot } from "../../ui/pulse-dot.jsx";
import { useIntroDone } from "../../../lib/intro.js";

// Split the stored name into words, flagging those that belong to the
// admin-configured highlight (e.g. heading "Md Souad Al Kabir" + highlight
// "Souad"). Matching is case-insensitive, word by word.
function nameWords(heading, highlight) {
  const hl = new Set(
    (highlight || "").toLowerCase().split(/\s+/).filter(Boolean)
  );
  return (heading || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ({ text: w, highlight: hl.has(w.toLowerCase()) }));
}

function Waves() {
  return (
    <div
      id="hero-waves"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:radial-gradient(ellipse_55%_50%_at_50%_45%,transparent_35%,black_85%)]"
    >
      <svg
        className="absolute -left-10 top-[15%] w-[130%] text-slate-400/40 dark:text-slate-500/25"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <path className="wave-path" pathLength={1} d="M0 150 C 200 30, 400 270, 600 150 S 1000 30, 1200 150" stroke="currentColor" strokeWidth="3" strokeDasharray="1" />
        <path className="wave-path" pathLength={1} d="M0 200 C 220 80, 420 320, 640 200 S 1020 80, 1200 200" stroke="currentColor" strokeWidth="2" strokeDasharray="1" />
        <path className="wave-path" pathLength={1} d="M0 110 C 180 40, 360 180, 560 110 S 940 40, 1200 110" stroke="currentColor" strokeWidth="1.5" strokeDasharray="1" />
      </svg>
      <svg
        className="absolute -right-10 bottom-[-6%] w-[120%] text-slate-400/30 dark:text-slate-500/20"
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
  "left-[6%] top-[18%]",
  "left-[10%] top-[46%]",
  "right-[7%] top-[16%]",
  "right-[11%] top-[42%]",
  "left-[16%] bottom-[16%]",
  "right-[15%] bottom-[14%]",
  "left-[4%] bottom-[34%]",
  "right-[4%] bottom-[30%]",
];

// Full-viewport, vertically centered. Overrides Section's default py-20 and
// stretches its inner max-w wrapper so the content column can center.
const HERO_SECTION_CLASS =
  "relative flex min-h-[calc(100svh-6rem)] items-center overflow-hidden py-16! [&>div]:w-full";

function HeroSkeleton() {
  return (
    <Section name="home" className={HERO_SECTION_CLASS}>
      <div className="mx-auto w-full max-w-4xl animate-pulse text-center">
        <div className="mx-auto mb-7 h-28 w-28 rounded-full bg-muted sm:h-32 sm:w-32 lg:h-36 lg:w-36" />
        <div className="mx-auto h-7 w-48 rounded-full bg-muted" />
        <div className="mx-auto mt-8 h-4 w-24 rounded bg-muted" />
        <div className="mx-auto mt-5 h-20 w-[75%] rounded-lg bg-muted" />
        <div className="mx-auto mt-6 h-5 w-72 rounded bg-muted/80" />
        <div className="mx-auto mt-8 h-4 w-full max-w-xl rounded bg-muted/60" />
        <div className="mx-auto mt-10 h-10 w-64 rounded-full bg-muted" />
        <div className="mx-auto mt-5 h-10 w-48 rounded-full bg-muted/60" />
      </div>
    </Section>
  );
}

function NameWords({ words }) {
  return words.map((w, i) => (
    // Outer span clips the word so it can rise into view from below.
    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <span
        className={`hero-word inline-block ${
          w.highlight ? "text-brand-600 dark:text-brand-400" : ""
        }`}
      >
        {w.text}
      </span>
      {i < words.length - 1 ? "\u00A0" : ""}
    </span>
  ));
}

// Round portrait above the name: a slowly spinning brand ring frames the
// photo, with an "online" dot when the admin has set an availability line.
function Portrait({ src, alt, available }) {
  return (
    <div data-hero="portrait" className="group relative mb-7">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-125 rounded-full bg-brand-500/20 blur-2xl dark:bg-brand-400/15"
      />
      <div
        aria-hidden="true"
        className="absolute -inset-1 rounded-full bg-[conic-gradient(from_0deg,var(--color-brand-500),transparent_30%,var(--color-brand-300)_55%,transparent_80%,var(--color-brand-500))] motion-safe:animate-[spin_8s_linear_infinite]"
      />
      <div className="relative rounded-full bg-background p-1">
        <img
          src={src}
          alt={alt}
          width={288}
          height={288}
          fetchPriority="high"
          decoding="async"
          className="h-28 w-28 rounded-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] sm:h-32 sm:w-32 lg:h-36 lg:w-36"
        />
      </div>
      {available && (
        <span className="absolute bottom-2 right-2 flex rounded-full bg-background p-1 sm:bottom-2.5 sm:right-2.5">
          <PulseDot size="md" />
        </span>
      )}
    </div>
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

  // Hold the entrance until the preloader starts powering off, so it plays
  // in view instead of finishing underneath the cover.
  const introDone = useIntroDone();
  const ready = !isLoading && !!s && introDone;

  const words = nameWords(s?.heroHeading || s?.name, s?.heroHighlight);
  const role = s?.heroSubtitle || s?.title;
  const description = s?.heroDescription || s?.shortBio;

  // Entrance timeline + idle ambient loops, scoped to the whole section so
  // both the backdrop and the foreground copy are animated. useGSAP reverts
  // everything on unmount or dependency change. Selectors are guarded so an
  // absent node (e.g. no description) never triggers "target not found".
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !ready) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const has = (selector) => gsap.utils.toArray(selector, root).length > 0;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Waves "draw in" via stroke-dashoffset (pathLength=1 on each path).
      if (has(".wave-path")) {
        tl.fromTo(
          ".wave-path",
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" },
          0
        );
      }

      // 2. Portrait pops in, then floats gently.
      if (has("[data-hero='portrait']")) {
        tl.fromTo(
          "[data-hero='portrait']",
          { opacity: 0, scale: 0.6, filter: "blur(8px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "back.out(1.6)" },
          0.05
        );
        gsap.to("[data-hero='portrait']", {
          y: -6,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1,
        });
      }

      // 3. Availability pill + greeting.
      if (has("[data-hero='intro']")) {
        tl.fromTo(
          "[data-hero='intro']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.15
        );
      }

      // 4. Name words rise out of their clipping spans.
      if (has(".hero-word")) {
        tl.fromTo(
          ".hero-word",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.8, stagger: 0.07 },
          "-=0.3"
        );
      }

      // 5. Role, description, CTAs, socials.
      if (has("[data-hero='sub']")) {
        tl.fromTo(
          "[data-hero='sub']",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 },
          "-=0.45"
        );
      }

      // 6. Floating skill icons reveal, then drift forever.
      const floats = gsap.utils.toArray(".hero-float", root);
      if (floats.length) {
        gsap.fromTo(
          floats,
          { opacity: 0, scale: 0.5, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            stagger: 0.08,
            delay: tl.duration() * 0.6,
          }
        );
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: `+=${8 + (i % 4) * 3}`,
            duration: 3.2 + (i % 3),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: (i % 5) * 0.4,
          });
        });
      }

      // Ambient idle motion for the waves.
      if (has(".wave-path")) {
        gsap.to(".wave-path", {
          x: 40,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    },
    { scope: rootRef, dependencies: [ready, floatingSkills.length] }
  );

  if (isLoading) return <HeroSkeleton />;

  return (
    <Section ref={rootRef} name="home" className={HERO_SECTION_CLASS}>
      {/* --- Backdrop: soft brand glow, waves, floating skill icons --- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-1/2 top-[40%] h-[28rem] w-[min(56rem,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/[0.07] blur-3xl dark:bg-brand-400/10" />
        <Waves />
      </div>

      {/* Floating skill icons — wide screens only, peripheral slots */}
      <div className="pointer-events-none absolute inset-0 z-0 hidden xl:block">
        {floatingSkills.map((sk, i) => (
          <span
            key={sk.id ?? i}
            aria-hidden="true"
            title={sk.name}
            className={`hero-float pointer-events-auto absolute ${FLOAT_SLOTS[i % FLOAT_SLOTS.length]} flex h-12 w-12 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-brand-600 shadow-sm backdrop-blur-sm transition hover:scale-110 hover:border-brand-500/60 dark:border-border/40 dark:bg-muted/20 dark:text-brand-400`}
          >
            <Icon name={sk.icon} className="text-xl" />
          </span>
        ))}
      </div>

      {/* Foreground content sits above the backdrop */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* 0. Portrait (Site Settings → Profile Image) */}
        {s?.profileImage && (
          <Portrait src={s.profileImage} alt={s.name || "Profile photo"} available={!!s.availability} />
        )}

        {/* 1. Availability pill (the navbar shows its own copy from lg up) */}
        {s?.availability && (
          <p
            data-hero="intro"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3.5 py-1.5 text-xs font-medium text-emerald-700 lg:hidden dark:text-emerald-400"
          >
            <PulseDot size="md" />
            {s.availability}
          </p>
        )}

        {/* 2. Greeting */}
        <p
          data-hero="intro"
          className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground sm:text-sm"
        >
          {s?.heroGreeting || "Hi there"}
        </p>

        {/* 3. Name — the headline */}
        <h1 className="mt-4 text-balance font-display text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[1.02] tracking-tight text-foreground">
          <NameWords words={words} />
        </h1>

        {/* 4. Role */}
        {role && (
          <p
            data-hero="sub"
            className="mt-5 flex items-center gap-3 text-balance text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 sm:text-lg dark:text-brand-400"
          >
            <span aria-hidden="true" className="hidden h-px w-12 bg-current opacity-50 sm:block" />
            {role}
            <span aria-hidden="true" className="hidden h-px w-12 bg-current opacity-50 sm:block" />
          </p>
        )}

        {/* 5. Description */}
        {description && (
          <p
            data-hero="sub"
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg dark:text-slate-400"
          >
            {description}
          </p>
        )}

        {/* 6. Buttons */}
        <div data-hero="sub" className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          {s?.resumeUrl && (
            <AppButton asChild className="w-full max-w-xs rounded-full px-7 text-[15px] font-semibold sm:w-auto">
              <a href={s.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="FaDownload" className="h-4 w-4" />
                {s.heroPrimaryCta || "Resume"}
              </a>
            </AppButton>
          )}
          <AppButton asChild variant="outline" className="w-full max-w-xs rounded-full px-7 text-[15px] font-semibold sm:w-auto">
            <a href="#contact">{s?.heroSecondaryCta || "Contact"}</a>
          </AppButton>
        </div>

        {/* 7. Socials */}
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
                className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-muted-foreground transition hover:-translate-y-0.5 hover:border-brand-500/60 hover:text-brand-600 dark:border-border/40 dark:bg-muted/20 dark:text-slate-400 dark:hover:border-brand-500/60 dark:hover:text-brand-400"
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
