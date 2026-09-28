import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-scroll";
import {
  useAbout,
  useExperience,
  useProjects,
  useSiteSettings,
  useSkills,
} from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";
import { monthsBetween } from "../../../lib/utils.js";
import { PulseDot } from "../../ui/pulse-dot.jsx";

const EASE = [0.22, 1, 0.36, 1];

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const VIEWPORT = { once: true, margin: "0px 0px 10% 0px" };

// Render a bio paragraph, emphasising any word/phrase that matches a DB
// focusPoint entry. The stored per-word colour classes come from the DB, so
// Tailwind never generates them (and several are unreadable on light
// backgrounds); every focus point gets one consistent brand emphasis.
function renderBioPara(para, focusPoints) {
  const foci = Array.isArray(focusPoints) ? focusPoints.filter((f) => f?.text) : [];
  if (foci.length === 0) return para;

  const pattern = foci
    .map((f) => f.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");
  const re = new RegExp(`(${pattern})`, "gi");

  return para.split(re).map((chunk, i) => {
    const isFocus = foci.some((f) => f.text.toLowerCase() === chunk.toLowerCase());
    if (!isFocus) return chunk;
    return (
      <strong key={i} className="font-normal text-brand-700 dark:text-brand-300">
        {chunk}
      </strong>
    );
  });
}

// Months from the earliest experience start to today (inclusive).
function experienceMonths(experience) {
  const starts = (Array.isArray(experience) ? experience : [])
    .map((e) => new Date(e?.startDate).getTime())
    .filter((t) => Number.isFinite(t));
  if (starts.length === 0) return 0;
  return monthsBetween(Math.min(...starts));
}

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">
        {reduce ? value : shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}

export default function About() {
  const { data: about } = useAbout();
  const { data: skills } = useSkills();
  const { data: settings } = useSiteSettings();
  const { data: projects } = useProjects();
  const { data: experience } = useExperience();

  if (!about) return null;

  const allSkills = (Array.isArray(skills) ? skills : [])
    .flatMap((c) => c?.skills ?? [])
    .filter((sk) => sk && sk.enabled !== false);

  // Stack chips: the About-specific skillTags (admin-managed), each matched to
  // a skill record for its icon; falls back to the skill records themselves.
  const iconByName = new Map(allSkills.map((sk) => [sk.name.toLowerCase(), sk.icon]));
  const tags = Array.isArray(about.skillTags) ? about.skillTags.filter(Boolean) : [];
  const stack = tags.length
    ? tags.map((name) => ({ name, icon: iconByName.get(String(name).toLowerCase()) }))
    : allSkills.slice(0, 8).map((sk) => ({ name: sk.name, icon: sk.icon }));

  // Stats derived from real records — no invented numbers.
  const months = experienceMonths(experience);
  const stats = [
    projects?.length > 0 && { value: projects.length, label: "Projects built" },
    allSkills.length > 0 && { value: allSkills.length, label: "Technologies" },
    months > 0 &&
      (months >= 12
        ? { value: Math.floor(months / 12), suffix: "+", label: "Years experience" }
        : { value: months, label: "Months experience" }),
  ].filter(Boolean);

  const highlights = Array.isArray(about.highlights) ? about.highlights : [];
  const [lead, ...rest] = String(about.description || "").split("\n").filter(Boolean);

  return (
    <Section name="about" className="relative overflow-hidden bg-surface-muted/60 dark:bg-slate-900/40">
      {/* Soft brand glow anchoring the portrait side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-400/10"
      />

      <SectionHeading eyebrow="About" title={about.heading || "About Me"} />

      <div className="relative grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        {/* -------- Portrait -------- */}
        {about.image && (
          <motion.figure
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5 lg:sticky lg:top-28"
          >
            {/* Offset outline frame for depth */}
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-brand-500/30 dark:border-brand-400/25"
            />

            <div className="group relative overflow-hidden rounded-[2rem] bg-surface shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 dark:bg-slate-900 dark:shadow-black/40 dark:ring-white/10">
              <img
                src={about.image}
                alt={settings?.name || about.heading || "Portrait"}
                width={640}
                height={800}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
              />

              {/* Caption: name, role, availability — all from site settings */}
              {(settings?.name || settings?.title) && (
                <figcaption className="absolute inset-x-3 bottom-3 rounded-2xl border border-white/20 bg-slate-950/55 px-4 py-3 text-white backdrop-blur-md">
                  <p className="font-display text-lg leading-tight">{settings?.name}</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                    {settings?.title && (
                      <p className="text-xs uppercase tracking-[0.15em] text-white/75">
                        {settings.title}
                      </p>
                    )}
                    {settings?.availability && (
                      <p className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
                        <PulseDot tone="emerald-soft" />
                        {settings.availability}
                      </p>
                    )}
                  </div>
                </figcaption>
              )}
            </div>
          </motion.figure>
        )}

        {/* -------- Story, stats, highlights, stack -------- */}
        <motion.div
          variants={containerAnim}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className={about.image ? "lg:col-span-7" : "lg:col-span-12"}
        >
          {lead && (
            <motion.p
              variants={itemAnim}
              className="text-pretty font-display text-xl leading-snug text-ink sm:text-2xl dark:text-slate-100"
            >
              {renderBioPara(lead, about.focusPoints)}
            </motion.p>
          )}

          {rest.length > 0 && (
            <div className="mt-5 space-y-4">
              {rest.map((para, i) => (
                <motion.p
                  key={i}
                  variants={itemAnim}
                  className="text-pretty text-base leading-relaxed text-ink-muted sm:text-[17px] dark:text-slate-400"
                >
                  {renderBioPara(para, about.focusPoints)}
                </motion.p>
              ))}
            </div>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <motion.dl
              variants={itemAnim}
              className="mt-10 grid divide-x divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-surface/80 shadow-sm backdrop-blur-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900/60"
              style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
            >
              {stats.map((st) => (
                <div key={st.label} className="flex flex-col-reverse gap-1 px-3 py-5 text-center sm:px-5">
                  <dt className="text-[11px] uppercase tracking-wider text-ink-muted sm:text-xs dark:text-slate-400">
                    {st.label}
                  </dt>
                  <dd className="font-display text-3xl text-brand-600 sm:text-4xl dark:text-brand-400">
                    <CountUp value={st.value} suffix={st.suffix} />
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}

          {/* Highlights (admin-managed) */}
          {highlights.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  variants={itemAnim}
                  className="group flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="shrink-0 rounded-xl bg-brand-600/10 p-2.5 text-brand-600 dark:text-brand-400">
                    <Icon name={h?.icon || "FaCheckCircle"} className="text-lg" />
                  </span>
                  <div>
                    <p className="text-ink dark:text-slate-100">{h?.title}</p>
                    {h?.detail && (
                      <p className="mt-0.5 text-sm text-ink-muted dark:text-slate-400">{h.detail}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Stack */}
          {stack.length > 0 && (
            <motion.div variants={itemAnim} className="mt-10">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-muted dark:text-slate-400">
                Tech Stack
              </p>
              <ul className="flex flex-wrap gap-2">
                {stack.map((sk) => (
                  <li
                    key={sk.name}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-sm text-ink transition hover:-translate-y-0.5 hover:border-brand-500/60 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-400/60"
                  >
                    {sk.icon ? (
                      <Icon name={sk.icon} className="text-base text-brand-600 dark:text-brand-400" />
                    ) : (
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    )}
                    {sk.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* CTA — labels and targets from settings */}
          <motion.div variants={itemAnim} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="contact"
              smooth
              offset={-80}
              href="#contact"
              className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-white transition hover:bg-brand-600 dark:bg-white dark:text-slate-900 dark:hover:bg-brand-400"
            >
              {settings?.heroSecondaryCta || "Contact Me"}
              <Icon name="FaArrowRight" className="text-xs transition group-hover:translate-x-1" />
            </Link>
            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ink underline decoration-brand-500/40 decoration-2 underline-offset-4 transition hover:decoration-brand-500 dark:text-slate-200"
              >
                <Icon name="FaDownload" className="text-xs text-brand-600 dark:text-brand-400" />
                {settings.heroPrimaryCta || "Resume"}
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
