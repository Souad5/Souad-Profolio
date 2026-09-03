import { motion, useReducedMotion } from "framer-motion";
import { useExperience } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";
import { formatDate } from "../../../lib/utils.js";

/* ------------------------------------------------------------------ */
/* Styling tokens                                                      */
/* ------------------------------------------------------------------ */

// Node column width is shared by the marker AND the connector segment below
// it, so they're always centered on the same axis — no independently
// guessed pixel offsets between rail and node.
const NODE_SIZE = "h-9 w-9"; // 36px
const NODE_COL = "w-9"; // matches NODE_SIZE — single source of truth

const CARD =
  "relative flex h-full flex-col rounded-3xl border p-6 sm:p-7 shadow-sm transition-colors duration-300 dark:shadow-none " +
  "border-slate-200 dark:border-slate-800 " +
  "bg-white dark:bg-slate-900";

const CARD_CURRENT =
  "border-brand-500/45 dark:border-brand-400/35 " +
  "shadow-[0_8px_30px_-14px_theme(colors.brand.500/50%)] " +
  "dark:shadow-[0_8px_30px_-16px_theme(colors.brand.400/30%)]";

const TYPE_PILL =
  "inline-flex items-center rounded-full border border-slate-300 px-3 py-0.5 text-xs font-medium text-ink-muted dark:border-slate-700 dark:text-slate-400";

/* ------------------------------------------------------------------ */
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */

function dateRange(job) {
  return job.current
    ? `${formatDate(job.startDate)} \u2013 Present`
    : `${formatDate(job.startDate)} \u2013 ${formatDate(job.endDate)}`;
}

function getInitials(name = "") {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return letters || "?";
}

/* ------------------------------------------------------------------ */
/* Node marker + connector segment                                     */
/* ------------------------------------------------------------------ */
/*
 * This is the fix for the alignment/gap bug. Each row is a flex row:
 *   [ node column (fixed width) ][ card column (flex-1) ]
 * The node column is itself a flex column: marker on top, then a
 * `flex-1` connector line filling the exact remaining row height.
 * Because the row uses `items-stretch` (the flex default), the node
 * column's height always equals the card's height in that same row —
 * so the connector always reaches exactly to the next node, and the
 * line simply doesn't exist after the last item. No magic numbers,
 * no drift if a title wraps to two lines.
 */
function TimelineNode({ job, isCurrent, reducedMotion, isLast }) {
  const initials = getInitials(job.company);

  return (
    <div className={`flex ${NODE_COL} shrink-0 flex-col items-center -mt-6`}>
      {/* Marker — top offset matches the card's own padding (p-6/p-7)
          so it lines up with the title baseline, not an unrelated guess */}
      <span
        className={`relative z-10 mt-6 flex ${NODE_SIZE} shrink-0 items-center justify-center sm:mt-7`}
      >
        {isCurrent && (
          <>
            <span className="absolute inset-0 rounded-full bg-brand-500/40 blur-xs" />
            {!reducedMotion && (
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/40" />
            )}
          </>
        )}
        <span
          className={`relative flex ${NODE_SIZE} items-center justify-center overflow-hidden rounded-full border-2 text-[11px] font-bold ${
            isCurrent
              ? "border-brand-500 bg-brand-500 text-white dark:border-brand-400 dark:bg-brand-400 dark:text-slate-900"
              : "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          {job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company || ""} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </span>
      </span>

      {/* Connector segment — fills the rest of the row's height. Static (no
          scaleY animation) so the line is always visible across the timeline,
          including the gaps between nodes. */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="mt-1 w-px flex-1 rounded-full bg-linear-to-b from-brand-500/70 via-brand-500/30 to-brand-500/10 dark:from-brand-400/60 dark:via-brand-400/25 dark:to-brand-400/10"
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function ExperienceCard({ job, isCurrent, reducedMotion, index }) {
  const highlights = Array.isArray(job.highlights) ? job.highlights : [];

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: reducedMotion ? 0 : index * 0.12,
      }}
      whileHover={reducedMotion ? undefined : { y: -4 }}
      className={`${CARD} ${isCurrent ? CARD_CURRENT : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl dark:text-slate-50">
            {job.position}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm">
            <span className="font-medium text-ink dark:text-slate-200">
              {job.company}
            </span>
            {job.location && (
              <>
                <span
                  className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"
                  aria-hidden="true"
                />
                <span className="inline-flex items-center gap-1 text-ink-muted dark:text-slate-400">
                  <Icon
                    name="FaMapMarkerAlt"
                    className="text-[11px] text-ink-muted dark:text-slate-400"
                  />
                  {job.location}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {isCurrent && (
            <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white dark:bg-brand-500 dark:text-slate-900">
              Current
            </span>
          )}
          <span className="text-sm font-medium tabular-nums text-ink-muted dark:text-slate-400">
            {dateRange(job)}
          </span>
        </div>
      </div>
      <div>
        {job.employmentType && (
          <span className={`${TYPE_PILL} mt-4`}>{job.employmentType}</span>
        )}
      </div>

      {(() => {
        const description = String(job.description || "").trim();
        if (!description) return null;
        return (
          <p className="mt-4 text-sm leading-relaxed text-ink-muted dark:text-slate-400">
            {description}
          </p>
        );
      })()}

      {highlights.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {highlights.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted dark:text-slate-400"
            >
              <span className="mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500 dark:bg-brand-400" />
              {point}
            </li>
          ))}
        </ul>
      )}

      {(() => {
        const technologies = Array.isArray(job.technologies)
          ? job.technologies
          : [];
        if (technologies.length === 0) return null;
        return (
          <div className="mt-4 flex flex-wrap gap-2">
            {technologies.map((t, i) => (
              <span
                key={i}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-ink-muted dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
              >
                {t}
              </span>
            ))}
          </div>
        );
      })()}
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

function Timeline({ items, reducedMotion }) {
  return (
    <ol className="flex flex-col">
      {items.map((job, index) => {
        const isCurrent = !!job.current;
        const isLast = index === items.length - 1;
        return (
          <li key={job.id} className="flex gap-4 sm:gap-5">
            <TimelineNode
              job={job}
              isCurrent={isCurrent}
              reducedMotion={reducedMotion}
              isLast={isLast}
            />
            <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-8 sm:pb-10"}`}>
              <ExperienceCard
                job={job}
                isCurrent={isCurrent}
                reducedMotion={reducedMotion}
                index={index}
              />
            </div>
          </li>
        );
      })}
    </ol>
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
    <Section
      name="experience"
      className="bg-surface-muted/60 dark:bg-slate-900/40"
    >
      <SectionHeading eyebrow="Experience" title="Work Experience" />
      <div className="mx-auto max-w-7xl">
        <Timeline items={items} reducedMotion={reducedMotion} />
      </div>
    </Section>
  );
}
