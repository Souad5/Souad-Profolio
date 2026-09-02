import { motion, useReducedMotion } from "framer-motion";
import { useExperience } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";
import { formatDate } from "../../../lib/utils.js";

/* ------------------------------------------------------------------ */
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */

function dateRange(job) {
  return job.current
    ? `${formatDate(job.startDate)} \u2013 Present`
    : `${formatDate(job.startDate)} \u2013 ${formatDate(job.endDate)}`;
}

function cardBg(isCurrent) {
  if (isCurrent) {
    return "bg-linear-to-br from-brand-500/[0.07] via-surface to-surface dark:from-brand-500/[0.12] dark:via-slate-900 dark:to-slate-900";
  }
  return "bg-surface dark:bg-slate-900";
}

/* ------------------------------------------------------------------ */
/* Shared building blocks                                              */
/* ------------------------------------------------------------------ */

function Header({ job, isCurrent }) {
  const tech = Array.isArray(job.technologies) ? job.technologies : [];
  return (
    <div className="relative">
      {/* Brand-accent top border */}
      <span
        className={`absolute inset-x-0 -top-px mx-6 h-px bg-linear-to-r from-transparent via-brand-500/70 to-transparent`}
      />
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h3 className="font-display text-xl font-bold sm:text-2xl">{job.position}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
            <span className="font-medium text-ink dark:text-slate-200">{job.company}</span>
            {job.location && (
              <>
                <span className="h-1 w-1 rounded-full bg-brand-500/60" aria-hidden="true" />
                <span className="inline-flex items-center gap-1 text-ink-muted dark:text-slate-400">
                  <Icon name="FaMapMarkerAlt" className="text-[11px] text-brand-600/80 dark:text-brand-400/80" />
                  {job.location}
                </span>
              </>
            )}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-brand-500/25 bg-brand-600/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
          {dateRange(job)}
          {isCurrent && (
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
              Current
            </span>
          )}
        </span>
      </div>
      {job.employmentType && (
        <span className="mt-2 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-muted dark:bg-slate-800 dark:text-slate-400">
          {job.employmentType}
        </span>
      )}
      {/* Tech chips */}
      {tech.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tech.map((t, i) => (
            <span
              key={i}
              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-ink-muted dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Body({ job }) {
  const highlights = Array.isArray(job.highlights) ? job.highlights : [];
  return (
    <>
      {highlights.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {highlights.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-muted dark:text-slate-300"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {point}
            </li>
          ))}
        </ul>
      ) : (
        job.description && (
          <p className="mt-4 text-sm leading-relaxed text-ink-muted dark:text-slate-300">
            {job.description}
          </p>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Node marker                                                         */
/* ------------------------------------------------------------------ */

function TimelineNode({ isCurrent, reducedMotion }) {
  return (
    <span className="relative z-10 flex h-5 w-5 items-center justify-center">
      {isCurrent && (
        <>
          <span className="absolute inset-0 rounded-full bg-brand-500/40 blur-[3px]" />
          {!reducedMotion && (
            <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/50" />
          )}
        </>
      )}
      <span
        className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 bg-surface dark:bg-slate-900 ${
          isCurrent
            ? "border-brand-500 bg-brand-500"
            : "border-brand-500/60"
        }`}
      >
        {isCurrent && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop card + motion                                               */
/* ------------------------------------------------------------------ */

// Each role is a 2-column row around a centered spine. Side is "right" for
// even indexes (card sits right of the line), "left" for odd indexes.
function DesktopCard({ job, isCurrent, side, reducedMotion }) {
  const left = side === "left";
  const dx = left ? -48 : 48;

  return (
    <div className="relative grid h-full grid-cols-2">
      {/* Connector segment from spine to card */}
      <span
        className={`absolute top-[42px] h-px w-[calc(50%-14px)] bg-linear-to-r ${
          left
            ? "left-[calc(50%-14px)] bg-linear-to-l from-brand-500/50 to-transparent"
            : "left-0 bg-linear-to-r from-transparent to-brand-500/50"
        }`}
        aria-hidden="true"
      />
      <div className={`${left ? "col-start-1 pr-10" : "col-start-2 pl-10"}`}>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, x: dx, y: 12 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reducedMotion ? undefined : { y: -6, boxShadow: "0 24px 48px -20px rgba(0,0,0,0.35)" }}
          className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-sm transition-colors duration-300 dark:shadow-none ${
            isCurrent
              ? "border-brand-500/50 shadow-brand-500/5 dark:shadow-[0_20px_50px_-25px_rgba(16,185,129,0.35)]"
              : "border-slate-200 hover:border-brand-500/50 dark:border-slate-800"
          } ${cardBg(isCurrent)}`}
        >
          <Header job={job} isCurrent={isCurrent} />
          <Body job={job} />
        </motion.div>
      </div>
    </div>
  );
}

function DesktopTimeline({ items, reducedMotion }) {
  return (
    <div className="relative hidden md:block">
      {/* Growing center spine */}
      <motion.span
        aria-hidden="true"
        initial={reducedMotion ? false : { scaleY: 0 }}
        whileInView={reducedMotion ? undefined : { scaleY: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 origin-top rounded-full bg-linear-to-b from-brand-500 via-brand-500/50 to-brand-500/10"
      />
      <ol>
        {items.map((job, i) => {
          const isCurrent = !!job.current;
          const side = i % 2 === 0 ? "right" : "left";
          return (
            <li key={job.id} className="relative py-6">
              {/* Node centered on the spine */}
              <span className="absolute left-1/2 top-[38px] z-10 -translate-x-1/2">
                <TimelineNode isCurrent={isCurrent} reducedMotion={reducedMotion} />
              </span>
              <DesktopCard
                job={job}
                isCurrent={isCurrent}
                side={side}
                reducedMotion={reducedMotion}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile card (line on left, single column)                           */
/* ------------------------------------------------------------------ */

function MobileCard({ job, isCurrent, reducedMotion }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, x: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col rounded-2xl border p-5 shadow-sm dark:shadow-none ${cardBg(isCurrent)} ${
        isCurrent
          ? "border-brand-500/50"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <Header job={job} isCurrent={isCurrent} />
      <Body job={job} />
    </motion.div>
  );
}

function MobileTimeline({ items, reducedMotion }) {
  return (
    <div className="relative md:hidden">
      {/* Left rail line */}
      <motion.span
        aria-hidden="true"
        initial={reducedMotion ? false : { scaleY: 0 }}
        whileInView={reducedMotion ? undefined : { scaleY: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-[9px] top-0 h-full w-[3px] origin-top rounded-full bg-linear-to-b from-brand-500 via-brand-500/50 to-brand-500/10"
      />
      <ol className="space-y-6">
        {items.map((job) => {
          const isCurrent = !!job.current;
          return (
            <li key={job.id} className="relative pl-10">
              <span className="absolute left-0 top-4 z-10">
                <TimelineNode isCurrent={isCurrent} reducedMotion={reducedMotion} />
              </span>
              <MobileCard job={job} isCurrent={isCurrent} reducedMotion={reducedMotion} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Experience() {
  const { data: items = [] } = useExperience();
  const reducedMotion = useReducedMotion();
  if (!items.length) return null;

  return (
    <Section name="experience" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Experience" title="Work Experience" />
      <DesktopTimeline items={items} reducedMotion={reducedMotion} />
      <MobileTimeline items={items} reducedMotion={reducedMotion} />
    </Section>
  );
}