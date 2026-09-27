import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useExperience } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";
import { formatDuration, initials, monthsBetween } from "../../../lib/utils.js";
import { TechChips } from "../../ui/tech-chips.jsx";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px 10% 0px" };

/* ------------------------------------------------------------------ */
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */

// Date-only values are stored at 00:00Z — format in UTC so they don't shift.
function monthYear(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric", timeZone: "UTC" });
}

function roleEnd(job) {
  return job.current ? null : job.endDate;
}

// Technologies may be stored as separate entries or as one "A · B · C" string.
function splitTech(technologies) {
  const list = (Array.isArray(technologies) ? technologies : [])
    .flatMap((t) => String(t).split(/\s*[·•,|]\s*/))
    .map((t) => t.trim())
    .filter(Boolean);
  return [...new Set(list)];
}

// Group consecutive roles by company so a promotion reads as one career
// story instead of repeated, unrelated cards. Input order (newest first,
// from the API) is preserved.
function groupByCompany(items) {
  const groups = [];
  const byKey = new Map();
  for (const job of items) {
    const key = String(job.company || "").trim().toLowerCase();
    if (!byKey.has(key)) {
      const group = { key, company: job.company, logo: job.logo, location: job.location, roles: [] };
      byKey.set(key, group);
      groups.push(group);
    }
    const group = byKey.get(key);
    group.roles.push(job);
    group.logo ||= job.logo;
    group.location ||= job.location;
  }
  for (const g of groups) {
    const starts = g.roles.map((r) => new Date(r.startDate).getTime()).filter(Number.isFinite);
    const current = g.roles.some((r) => r.current);
    const ends = g.roles.map((r) => new Date(r.endDate).getTime()).filter(Number.isFinite);
    g.start = starts.length ? new Date(Math.min(...starts)) : null;
    g.end = current || !ends.length ? null : new Date(Math.max(...ends));
    g.current = current;
    g.months = g.start ? monthsBetween(g.start, g.end) : 0;
  }
  return groups;
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function CompanyLogo({ logo, company, size = "h-14 w-14" }) {
  return (
    <span
      className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10`}
    >
      {/* Logos are designed for light backgrounds — keep the tile white in both themes. */}
      {logo ? (
        <img
          src={logo}
          alt={`${company} logo`}
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="h-full w-full scale-125 object-contain"
        />
      ) : (
        <span className="font-display text-lg text-ink dark:text-slate-100">{initials(company) || "?"}</span>
      )}
    </span>
  );
}

function RoleNode({ current }) {
  return (
    <span className="relative z-10 mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center">
      {current && (
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/40 motion-reduce:hidden" />
      )}
      <span
        className={`relative h-4 w-4 rounded-full border-[3px] ${
          current
            ? "border-brand-500 bg-white dark:border-brand-400 dark:bg-slate-900"
            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900"
        }`}
      />
    </span>
  );
}

function Role({ job, promoted, isLast, index }) {
  const highlights = Array.isArray(job.highlights) ? job.highlights.filter(Boolean) : [];
  const tech = splitTech(job.technologies);
  const description = String(job.description || "").trim();
  const months = monthsBetween(job.startDate, roleEnd(job));

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1, ease: EASE }}
      className={`relative flex gap-4 sm:gap-5 ${isLast ? "" : "pb-8"}`}
    >
      <RoleNode current={job.current} />

      <div className="min-w-0 flex-1">
        {/* Badges */}
        {(job.current || promoted) && (
          <div className="mb-2 flex flex-wrap gap-2">
            {job.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-brand-700 dark:bg-brand-400/10 dark:text-brand-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Current
              </span>
            )}
            {promoted && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                <Icon name="FaArrowRight" className="-rotate-45 text-[9px]" />
                Promoted
              </span>
            )}
          </div>
        )}

        <h4 className="font-display text-xl leading-snug text-ink sm:text-2xl dark:text-slate-50">
          {job.position}
        </h4>

        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted dark:text-slate-400">
          <span className="tabular-nums">
            {monthYear(job.startDate)} – {job.current ? "Present" : monthYear(job.endDate)}
          </span>
          {/* Separator travels with its item so lines never end in a dangling "·" */}
          {months > 0 && <span className="whitespace-nowrap">· {formatDuration(months)}</span>}
          {job.employmentType && <span className="whitespace-nowrap">· {job.employmentType}</span>}
        </p>

        {description && (
          <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-ink-muted dark:text-slate-400">
            {description}
          </p>
        )}

        {highlights.length > 0 && (
          <ul className="mt-4 grid max-w-2xl gap-2.5">
            {highlights.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink dark:text-slate-300">
                <Icon name="FaCheckCircle" className="mt-1 shrink-0 text-sm text-brand-500 dark:text-brand-400" />
                {point}
              </li>
            ))}
          </ul>
        )}

        {tech.length > 0 && (
          <TechChips
            items={tech}
            label="Technologies used"
            className="mt-5 gap-1.5"
            chipClassName="transition hover:border-brand-500/50 hover:text-brand-700 dark:hover:text-brand-300"
          />
        )}
      </div>
    </motion.li>
  );
}

function CompanyCard({ group, index }) {
  const cardRef = useRef(null);
  const railRef = useRef(null);
  const reduce = useReducedMotion();

  // Scroll-linked rail: fills with brand colour as the roles scroll past.
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  // Cursor-following spotlight (CSS vars, no re-render).
  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const rolesAsc = [...group.roles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  const firstRoleId = rolesAsc[0]?.id;

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm transition-colors hover:border-brand-500/40 sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-400/30"
    >
      {/* Spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--x, 50%) var(--y, 0%), color-mix(in oklab, var(--color-brand-500) 9%, transparent), transparent 70%)",
        }}
      />

      {/* Company header */}
      <header className="relative flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
        <CompanyLogo logo={group.logo} company={group.company} />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-2xl leading-tight text-ink dark:text-slate-50">{group.company}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted dark:text-slate-400">
            {group.location && (
              <span className="inline-flex items-center gap-1.5">
                <Icon name="FaMapMarkerAlt" className="text-xs" />
                {group.location}
              </span>
            )}
            {group.months > 0 && (
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <Icon name="FaBriefcase" className="text-xs" />
                {formatDuration(group.months)}
                {group.roles.length > 1 && ` · ${group.roles.length} roles`}
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Roles with a scroll-filled rail */}
      <div ref={railRef} className="relative mt-7">
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-[7px] top-2 w-0.5 rounded-full bg-slate-200 dark:bg-slate-700/70"
        />
        {group.roles.length > 1 && (
          <motion.span
            aria-hidden="true"
            style={reduce ? undefined : { scaleY: fill }}
            className="absolute bottom-2 left-[7px] top-2 w-0.5 origin-top rounded-full bg-linear-to-b from-brand-500 to-brand-400/40"
          />
        )}
        <ol className="relative">
          {group.roles.map((job, i) => (
            <Role
              key={job.id}
              job={job}
              index={i}
              isLast={i === group.roles.length - 1}
              promoted={group.roles.length > 1 && job.id !== firstRoleId}
            />
          ))}
        </ol>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Snapshot panel                                                      */
/* ------------------------------------------------------------------ */

function Snapshot({ items, groups }) {
  const starts = items.map((j) => new Date(j.startDate).getTime()).filter(Number.isFinite);
  const total = starts.length ? monthsBetween(Math.min(...starts)) : 0;
  const current = items.find((j) => j.current);
  const path = [...items].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative overflow-hidden rounded-3xl bg-ink p-6 text-white shadow-xl sm:p-8 dark:bg-slate-900 dark:ring-1 dark:ring-white/10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-500/30 blur-3xl"
      />

      {total > 0 && (
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Experience</p>
          <p className="mt-2 font-display text-5xl leading-none text-brand-400">{formatDuration(total)}</p>
          <p className="mt-2 text-sm text-white/60">
            {items.length} {items.length === 1 ? "role" : "roles"} · {groups.length}{" "}
            {groups.length === 1 ? "company" : "companies"}
          </p>
        </div>
      )}

      {current && (
        <div className="relative mt-7 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Currently</p>
          <p className="mt-2 font-display text-xl leading-snug">{current.position}</p>
          <p className="text-sm text-white/70">@ {current.company}</p>
        </div>
      )}

      {path.length > 1 && (
        <div className="relative mt-7 border-t border-white/10 pt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Career path</p>
          <ol className="mt-3 space-y-2">
            {path.map((job, i) => (
              <li key={job.id} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] tabular-nums ${
                    job.current ? "bg-brand-400 text-slate-900" : "bg-white/10 text-white/70"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={job.current ? "text-white" : "text-white/70"}>{job.position}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Experience() {
  const { data } = useExperience();
  const items = (Array.isArray(data) ? data : []).filter((j) => j && j.enabled !== false);
  if (!items.length) return null;

  const groups = groupByCompany(items);

  return (
    <Section name="experience" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Experience" title="Work Experience" />

      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-28 lg:col-span-4">
          <Snapshot items={items} groups={groups} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-8">
          {groups.map((group, i) => (
            <CompanyCard key={group.key || i} group={group} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}
