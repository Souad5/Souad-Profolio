import { motion } from "framer-motion";
import { CodeXml, Database, Layers, ServerCog, Smartphone, Wrench } from "lucide-react";
import { useSkills } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px 10% 0px" };

/* ------------------------------------------------------------------ */
/* Proficiency tiers                                                   */
/* ------------------------------------------------------------------ */

// Self-rated percentages ("HTML 95%") read as arbitrary to recruiters, so the
// stored 0–100 level is bucketed into four named tiers with a 4-step meter.
const TIERS = [
  { min: 85, rank: 4, label: "Expert" },
  { min: 70, rank: 3, label: "Advanced" },
  { min: 50, rank: 2, label: "Intermediate" },
  { min: 0, rank: 1, label: "Familiar" },
];

function tierFor(level) {
  const n = Math.min(100, Math.max(0, Number(level) || 0));
  return TIERS.find((t) => n >= t.min);
}

function Meter({ rank, delay = 0 }) {
  return (
    <span aria-hidden="true" className="flex items-center gap-1">
      {[1, 2, 3, 4].map((step) => (
        <motion.span
          key={step}
          initial={{ scaleY: 0.4, opacity: 0.4 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.4, delay: delay + step * 0.06, ease: EASE }}
          className={`h-3.5 w-1.5 rounded-full ${
            step <= rank
              ? "bg-brand-500 dark:bg-brand-400"
              : "bg-slate-200 dark:bg-white/10"
          }`}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Category card                                                       */
/* ------------------------------------------------------------------ */

// Pick a category glyph from its (DB) name; falls back to a generic stack.
function categoryIcon(name = "") {
  const n = name.toLowerCase();
  if (n.includes("front")) return CodeXml;
  if (n.includes("back") || n.includes("server")) return ServerCog;
  if (n.includes("data")) return Database;
  if (n.includes("mobile")) return Smartphone;
  if (n.includes("tool") || n.includes("devops")) return Wrench;
  return Layers;
}

function SkillRow({ skill, index }) {
  const tier = tierFor(skill.level);
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.05, ease: EASE }}
      className="group/row flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 transition group-hover/row:scale-105 dark:bg-brand-400/10 dark:text-brand-400">
        <Icon name={skill.icon} className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] text-ink dark:text-slate-100">
          {skill.name}
        </span>
        <span className="block text-xs text-ink-muted dark:text-slate-400">
          {tier.label}
        </span>
      </span>
      <Meter rank={tier.rank} delay={0.15 + index * 0.05} />
    </motion.li>
  );
}

function CategoryCard({ category, index }) {
  const skills = category.skills ?? [];
  const CategoryIcon = categoryIcon(category.name);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, delay: index * 0.08, ease: EASE }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-surface p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-xl hover:shadow-brand-500/5 sm:p-6 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-400/30"
    >
      {/* Brand accent line along the top edge */}
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-brand-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white dark:bg-white dark:text-slate-900">
          <CategoryIcon className="h-5 w-5" strokeWidth={2} />
        </span>
        <h3 className="flex-1 font-display text-xl text-ink dark:text-slate-100">
          {category.name}
        </h3>
        <span className="text-sm tabular-nums text-ink-muted dark:text-slate-400">
          {String(skills.length).padStart(2, "0")}
        </span>
      </header>

      <ul className="-mx-2 flex flex-col">
        {skills.map((skill, i) => (
          <SkillRow key={skill.id} skill={skill} index={i} />
        ))}
      </ul>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Skills() {
  const { data } = useSkills();

  const categories = (Array.isArray(data) ? data : [])
    .filter((c) => c && c.enabled !== false)
    .map((c) => ({ ...c, skills: (c.skills ?? []).filter((s) => s && s.enabled !== false) }))
    .filter((c) => c.skills.length > 0);

  if (!categories.length) return null;

  // Legend lists only the tiers actually in use.
  const usedRanks = new Set(
    categories.flatMap((c) => c.skills.map((s) => tierFor(s.level).rank))
  );
  const legend = TIERS.filter((t) => usedRanks.has(t.rank));

  return (
    <Section name="skills">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Skills"
          title="My Skills"
          subtitle="Technologies and tools I use to build products."
        />

        {/* Proficiency legend */}
        <motion.ul
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: EASE }}
          aria-label="Proficiency scale"
          className="-mt-8 mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs lg:mt-0 lg:mb-12 text-ink-muted dark:text-slate-400"
        >
          {legend.map((t) => (
            <li key={t.rank} className="inline-flex items-center gap-2">
              <Meter rank={t.rank} />
              {t.label}
            </li>
          ))}
        </motion.ul>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {categories.map((category, i) => (
          <CategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </Section>
  );
}
