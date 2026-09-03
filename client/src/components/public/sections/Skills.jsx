import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CodeXml, Layers, ServerCog, Wrench } from "lucide-react";
import { useSkills } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

/* ------------------------------------------------------------------ */
/* Styling tokens                                                      */
/* ------------------------------------------------------------------ */

const CARD =
  "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/[0.06] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-400/30";

// Soft brand glow that appears on hover
const GLOW =
  "pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-500/0 blur-3xl transition-all duration-500 group-hover:bg-brand-500/[0.14] dark:group-hover:bg-brand-400/[0.1]";

// Icon chip — rounded-xl squircle that tint-fills with brand on hover
const ICON_CHIP =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 transition-colors duration-200 group-hover:border-brand-500/40 group-hover:bg-brand-600/10 group-hover:text-brand-600 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-400 dark:group-hover:bg-brand-400/[0.12] dark:group-hover:text-brand-400";

// Thin animated progress track
const TRACK =
  "relative h-[5px] w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.08]";

/* ------------------------------------------------------------------ */
/* Appear animation variants                                           */
/* ------------------------------------------------------------------ */

function appear(delay = 0) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
    transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

/* ------------------------------------------------------------------ */
/* Proficiency bar — animated fill driven by in-view                   */
/* ------------------------------------------------------------------ */

function ProficiencyBar({ level = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={TRACK} aria-hidden="true">
      <motion.span
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : { width: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-brand-500 to-brand-400 dark:from-brand-500 dark:to-brand-400"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skill row                                                           */
/* ------------------------------------------------------------------ */

function SkillRow({ skill, index = 0 }) {
  return (
    <motion.div {...appear(0.05 + index * 0.04)} className="group/skill">
      <div className="flex items-center gap-3.5 rounded-2xl px-2 py-2.5 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-white/[0.03]">
        <span className={ICON_CHIP}>
          <Icon name={skill.icon} className="h-5 w-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <span className="truncate text-sm font-medium text-ink dark:text-slate-100">
              {skill.name}
            </span>
            <span className="shrink-0 font-display text-sm font-bold tabular-nums text-brand-600 dark:text-brand-400">
              {Math.min(100, Math.max(0, Number(skill.level) || 0))}%
            </span>
          </div>
          <ProficiencyBar level={skill.level} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Category icons (lucide-react — not the Icon registry)                */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS = [CodeXml, ServerCog, Wrench];
const ICON_ACCENTS = [
  "bg-brand-600/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-400",
  "bg-emerald-600/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
  "bg-teal-600/10 text-teal-600 dark:bg-teal-400/10 dark:text-teal-400",
];

/* ------------------------------------------------------------------ */
/* Category card                                                       */
/* ------------------------------------------------------------------ */

function CategoryCard({ category, index = 0 }) {
  const skills = category.skills ?? [];
  const CategoryIcon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  const iconAccent = ICON_ACCENTS[index % ICON_ACCENTS.length];

  // Top 3 skills by level -> summary chips under the card header
  const top = [...skills]
    .sort((a, b) => (Number(b.level) || 0) - (Number(a.level) || 0))
    .slice(0, 3);

  return (
    <motion.div {...appear(0.06 + index * 0.05)} className="h-full">
      <div className={CARD}>
        <div className={GLOW} />

        {/* Header */}
        <div className="relative mb-5 flex items-center justify-between gap-3">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconAccent}`}
          >
            <CategoryIcon className="h-[22px] w-[22px]" strokeWidth={2} />
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-ink-muted dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400">
            {skills.length} {skills.length === 1 ? "skill" : "skills"}
          </span>
        </div>

        {/* Category name + top skill chips */}
        <div className="relative mb-4">
          <h3 className="font-display text-lg font-semibold text-ink dark:text-slate-100">
            {category.name}
          </h3>
          {top.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {top.map((s) => (
                <span
                  key={s.id}
                  className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-ink-muted dark:bg-white/[0.06] dark:text-slate-300"
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="relative mb-2 h-px bg-slate-100 dark:bg-white/[0.06]" />

        {/* Skill rows */}
        <div className="relative flex flex-col">
          <AnimatePresence mode="popLayout" initial={false}>
            {skills.map((skill, i) => (
              <SkillRow key={skill.id} skill={skill} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Skills() {
  const { data: categories = [] } = useSkills();
  const [active, setActive] = useState("all");
  if (!categories.length) return null;

  const tabs = [
    { id: "all", label: "All", icon: Layers },
    ...categories.map((c) => ({ id: c.id, label: c.name })),
  ];
  const visible =
    active === "all" ? categories : categories.filter((c) => c.id === active);
  const wide = active !== "all";

  return (
    <Section name="skills">
      <SectionHeading
        eyebrow="Skills"
        title="My Skills"
        subtitle="Technologies and tools I use to build products."
      />

      {/* Category filter tabs — pill slides via layoutId */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex flex-wrap items-center justify-center gap-1.5"
      >
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              aria-pressed={isActive}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-brand-700 dark:text-brand-300 cursor-not-allowed"
                  : "text-ink-muted hover:text-ink dark:text-slate-400 cursor-pointer dark:hover:text-slate-200"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="skills-tab-pill"
                  className="absolute inset-0 rounded-full border border-brand-500/30 bg-brand-500/10 dark:border-brand-400/30 dark:bg-brand-400/10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Skill grid — items-start so cards don't stretch to tallest column */}
      <div
        className={
          wide
            ? "mx-auto grid w-full max-w-4xl gap-5 items-start"
            : "grid gap-6 items-start md:grid-cols-2 lg:grid-cols-3"
        }
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((category) => {
            const index = categories.findIndex((c) => c.id === category.id);
            return (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </Section>
  );
}
