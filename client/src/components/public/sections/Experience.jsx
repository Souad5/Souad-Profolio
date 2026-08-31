import { motion } from "framer-motion";
import { useExperience } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import { formatDate } from "../../../lib/utils.js";

export default function Experience() {
  const { data: items = [] } = useExperience();
  if (!items.length) return null;

  return (
    <Section name="experience" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Experience" title="Work Experience" />
      <div className="relative space-y-8 border-l border-slate-200 pl-6 dark:border-slate-800">
        {items.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand-600 dark:border-slate-900" />
            <div className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold">{job.position}</h3>
                <span className="rounded-full bg-brand-600/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400">
                  {formatDate(job.startDate)} – {job.current ? "Present" : formatDate(job.endDate)}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink-muted dark:text-slate-400">
                {job.company}{job.location ? ` · ${job.location}` : ""}
              </p>
              {job.description && (
                <p className="mt-3 text-sm leading-relaxed text-ink-muted dark:text-slate-300">{job.description}</p>
              )}
              {Array.isArray(job.technologies) && job.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.technologies.map((t, idx) => (
                    <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-ink-muted dark:bg-slate-800 dark:text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
