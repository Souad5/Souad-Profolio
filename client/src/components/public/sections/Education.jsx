import { motion } from "framer-motion";
import { useEducation } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";

export default function Education() {
  const { data: items = [] } = useEducation();
  if (!items.length) return null;

  return (
    <Section name="education">
      <SectionHeading eyebrow="Education" title="Education" />
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((edu, i) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="rounded-2xl border border-slate-200 bg-surface p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            {edu.image && (
              <img
                src={edu.image}
                alt={`${edu.institution} logo`}
                className="mx-auto mb-4 h-16 w-16 rounded-full border border-slate-200 object-cover dark:border-slate-700"
              />
            )}
            <h3 className="font-display font-semibold">{edu.institution}</h3>
            <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">{edu.degree}</p>
            {edu.result && (
              <p className="mt-2 text-sm font-semibold text-brand-600 dark:text-brand-400">{edu.result}</p>
            )}
            {(edu.startYear || edu.endYear) && (
              <p className="mt-1 text-xs text-ink-muted dark:text-slate-500">
                {edu.startYear || ""}{edu.startYear && edu.endYear ? " – " : ""}{edu.endYear || ""}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
