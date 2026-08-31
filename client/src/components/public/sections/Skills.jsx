import { motion } from "framer-motion";
import { useSkills } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

export default function Skills() {
  const { data: categories = [] } = useSkills();
  if (!categories.length) return null;

  return (
    <Section name="skills">
      <SectionHeading eyebrow="Skills" title="My Skills" subtitle="Technologies and tools I use to build products." />
      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: ci * 0.1 }}
            className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-display text-lg font-semibold">{cat.name}</h3>
            <div className="mt-5 space-y-4">
              {(cat.skills ?? []).map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Icon name={skill.icon} className="text-brand-600 dark:text-brand-400" />
                      {skill.name}
                    </span>
                    <span className="text-xs text-ink-muted dark:text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="progressbar" aria-valuenow={skill.level} aria-valuemin="0" aria-valuemax="100" aria-label={`${skill.name} proficiency`}>
                    <motion.div
                      className="h-full rounded-full bg-brand-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
