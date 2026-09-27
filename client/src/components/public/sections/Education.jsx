import { motion } from "framer-motion";
import { Award, CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { useEducation } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px 10% 0px" };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Résumé convention: education shows years, not months. Values are stored as
// "YYYY-MM-DD" strings (parsed as UTC), so read the UTC year.
function year(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : String(d.getUTCFullYear());
}

function yearRange(edu) {
  const start = year(edu.startYear);
  const end = edu.endYear ? year(edu.endYear) : start ? "Present" : "";
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start || end;
}

// Split "Institution, City" into its name and trailing location.
function splitInstitution(name = "") {
  const i = name.lastIndexOf(",");
  if (i === -1) return { name, place: "" };
  return { name: name.slice(0, i).trim(), place: name.slice(i + 1).trim() };
}

function Logo({ src, alt, className }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-white/10 ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} width={80} height={80} loading="lazy" decoding="async" className="h-full w-full object-contain" />
      ) : (
        <GraduationCap className="h-1/2 w-1/2 text-slate-400" />
      )}
    </span>
  );
}

function Meta({ edu, place }) {
  const range = yearRange(edu);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted dark:text-slate-400">
      {range && (
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <CalendarDays className="h-4 w-4" />
          {range}
        </span>
      )}
      {place && (
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {place}
        </span>
      )}
    </div>
  );
}

function Result({ value }) {
  if (!value) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs text-brand-700 dark:border-brand-400/25 dark:bg-brand-400/10 dark:text-brand-300">
      <Award className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

// Highest qualification (first in admin order) gets the featured card.
function FeaturedCard({ edu }) {
  const { name, place } = splitInstitution(edu.institution);
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm transition duration-300 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-400/30"
    >
      {/* Watermark */}
      <GraduationCap
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 -right-6 h-48 w-48 rotate-[-12deg] text-brand-500/[0.06] transition-transform duration-500 group-hover:rotate-[-6deg] dark:text-brand-400/[0.07]"
        strokeWidth={1.25}
      />

      <div className="relative flex items-start justify-between gap-4">
        <Logo src={edu.image} alt={`${name} logo`} className="h-16 w-16 sm:h-20 sm:w-20" />
        <span className="rounded-full bg-ink px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-white dark:bg-white dark:text-slate-900">
          Highest degree
        </span>
      </div>

      <div className="relative mt-8 flex flex-1 flex-col">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400">{name}</p>
        <h3 className="mt-2 text-balance font-display text-2xl leading-tight text-ink sm:text-3xl dark:text-slate-50">
          {edu.degree}
        </h3>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
          <Meta edu={edu} place={place} />
          <Result value={edu.result} />
        </div>
      </div>
    </motion.article>
  );
}

function CompactCard({ edu, index }) {
  const { name, place } = splitInstitution(edu.institution);
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: 0.1 + index * 0.08, ease: EASE }}
      className="group flex gap-4 rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-lg sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-400/30"
    >
      <Logo src={edu.image} alt={`${name} logo`} className="h-12 w-12 sm:h-14 sm:w-14" />
      <div className="min-w-0 flex-1">
        <h3 className="text-pretty font-display text-lg leading-snug text-ink dark:text-slate-100">
          {edu.degree}
        </h3>
        <p className="mt-1 text-sm text-ink dark:text-slate-300">{name}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Meta edu={edu} place={place} />
          <Result value={edu.result} />
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Education() {
  const { data } = useEducation();
  const items = (Array.isArray(data) ? data : []).filter((e) => e && e.enabled !== false);
  if (!items.length) return null;

  const [featured, ...rest] = items;

  return (
    <Section name="education">
      <SectionHeading eyebrow="Education" title="Academic Background" />

      <div className={`grid gap-5 lg:gap-6 ${rest.length ? "lg:grid-cols-12" : ""}`}>
        <div className={rest.length ? "lg:col-span-7" : ""}>
          <FeaturedCard edu={featured} />
        </div>
        {rest.length > 0 && (
          <div className="flex flex-col gap-5 lg:col-span-5 lg:gap-6">
            {rest.map((edu, i) => (
              <CompactCard key={edu.id ?? i} edu={edu} index={i} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
