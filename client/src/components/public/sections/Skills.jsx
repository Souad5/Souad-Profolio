import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { CodeXml, Layers, ServerCog, Wrench } from "lucide-react";
import { useSkills } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

/* ------------------------------------------------------------------ */
/* Styling tokens                                                      */
/* ------------------------------------------------------------------ */

// Glass-surface category card (light: translucent white, dark: translucent slate)
const GLASS = [
  "rounded-2xl border bg-white/60 backdrop-blur-sm",
  "border-white/60 shadow-lg shadow-black/[0.04]",
  "dark:border-white/[0.06] dark:bg-white/[0.04] dark:shadow-none",
  "hover:shadow-xl hover:-translate-y-0.5 transition-shadow transition-transform duration-200",
].join(" ");

// Icon chip — clean neutral + brand-green on hover
const ICON_CHIP = [
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
  "border border-zinc-200/80 bg-zinc-100/70 text-zinc-500",
  "shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]",
  "dark:border-white/[0.06] dark:bg-white/[0.06] dark:text-zinc-400",
  "group-hover:border-brand-500/40 group-hover:bg-brand-500/[0.06] group-hover:text-brand-600",
  "dark:group-hover:border-brand-400/40 dark:group-hover:bg-brand-400/[0.1] dark:group-hover:text-brand-400",
  "transition-colors duration-200",
].join(" ");

// Proficiency bar: 56px track width
const BAR_TRACK =
  "relative h-1 w-14 rounded-full bg-zinc-200/80 dark:bg-white/[0.08] overflow-hidden";

/* ------------------------------------------------------------------ */
/* Proficiency helpers                                                  */
/* ------------------------------------------------------------------ */

// 0-100 numeric level → dot index threshold (0-4):
//   level 0-19  → 1 filled dot
//   level 20-39 → 2 filled dots
//   level 40-59 → 3 filled dots
//   level 60-79 → 4 filled dots
//   level 80-100→ 5 filled dots
function dotsFilled(level = 0) {
  const l = Math.max(0, Math.min(100, Number(level) || 0));
  return Math.max(1, Math.ceil(l / 20));
}

function ProficiencyBar({ level = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} className={BAR_TRACK} aria-hidden="true">
      <motion.span
        initial={{ width: 0 }}
        animate={inView ? { width: `${level}%` } : { width: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute inset-y-0 left-0 rounded-full bg-brand-500 dark:bg-brand-400"
      />
    </div>
  );
}

function ProficiencyDots({ level = 0 }) {
  const filled = dotsFilled(level);
  return (
    <span className="inline-flex items-center gap-[5px]" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            i < filled
              ? "bg-brand-500 dark:bg-brand-400"
              : "bg-zinc-300 dark:bg-white/[0.12]"
          }`}
        />
      ))}
    </span>
  );
}

function ProficiencyVisual({ level = 0 }) {
  return (
    <div className="flex items-center gap-2.5">
      <ProficiencyDots level={level} />
      <ProficiencyBar level={level} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Category icons (lucide-react — not the Icon registry)                */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS = [CodeXml, ServerCog, Wrench];
const ICON_ACCENTS = [
  "text-emerald-500 dark:text-emerald-400",
  "text-emerald-400 dark:text-emerald-300",
  "text-emerald-600 dark:text-emerald-500",
];

/* ------------------------------------------------------------------ */
/* Skill badge                                                         */
/* ------------------------------------------------------------------ */

function SkillBadge({ skill, staggerIndex = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.28, delay: staggerIndex * 0.025, ease: [0.22, 1, 0.36, 1] }}
      className="group flex items-center gap-3 px-3.5 py-3"
    >
      {/* Icon chip — monochrome, green-shifts on hover */}
      <span className={ICON_CHIP}>
        <Icon name={skill.icon} className="h-4.5 w-4.5" />
      </span>

      {/* Name + proficiency indicator */}
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-100">
          {skill.name}
        </span>
        <ProficiencyVisual level={skill.level} />
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Category card                                                       */
/* ------------------------------------------------------------------ */

function CategoryCard({ category, index = 0 }) {
  const skills = category.skills ?? [];
  const CategoryIcon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
  const iconAccent = ICON_ACCENTS[index % ICON_ACCENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="h-full">
        <div className={`${GLASS} flex h-full flex-col overflow-hidden p-5`}>
          {/* Card header */}
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100/60 text-zinc-500 dark:bg-white/[0.06] dark:text-zinc-400 ${iconAccent}`}>
                <CategoryIcon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-[13px] font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                {category.name}
              </span>
            </span>
            <span className="rounded-full border border-zinc-200/60 bg-white/40 px-2 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-500">
              {skills.length}
            </span>
          </div>

          {/* Divider */}
          <div className="mb-2 h-px bg-zinc-100 dark:bg-white/[0.06]" />

          {/* Skill badges */}
          <div className="flex flex-col gap-0.5">
            <AnimatePresence mode="popLayout">
              {skills.map((skill, i) => (
                <SkillBadge
                  key={skill.id}
                  skill={skill}
                  staggerIndex={i}
                />
              ))}
            </AnimatePresence>
          </div>
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
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="skills-tab-pill"
                  className="absolute inset-0 rounded-full bg-zinc-900/[0.06] ring-1 ring-zinc-900/10 dark:bg-white/[0.07] dark:ring-white/10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Skill grid — items-start so cards don't stretch to tallest column */}
      <div
        className={
          wide
            ? "mx-auto grid w-full max-w-4xl gap-5 items-start"
            : "grid gap-5 items-start md:grid-cols-2 lg:grid-cols-3"
        }
      >
        <AnimatePresence mode="popLayout">
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
