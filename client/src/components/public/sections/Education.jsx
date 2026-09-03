import { motion } from "framer-motion";
import { GraduationCap, Award } from "lucide-react";
import { useEducation } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import { formatDate } from "../../../lib/utils.js";

export default function Education() {
  const { data: items = [] } = useEducation();
  if (!items.length) return null;

  return (
    <Section name="education">
      <SectionHeading eyebrow="Education" title="Education" />

      {/* Main Timeline Wrapper with Generous Left Padding */}
      <div className="relative ml-6 border-l-2 border-slate-200/80 pl-10 dark:border-zinc-800">
        {items.map((edu, i) => (
          <motion.div
            key={edu.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="group relative mb-10 last:mb-0"
          >
            {/* Premium Floating Node Badge (Centered on the line, clear of the card) */}
            <div className="absolute -left-16 z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-sm backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900/90">
              {edu.image ? (
                <img
                  src={edu.image}
                  alt={`${edu.institution} logo`}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <GraduationCap className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 dark:text-zinc-500" />
              )}
            </div>

            {/* Elevated Modern Card */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:hover:border-zinc-700 dark:hover:shadow-none"
            >
              {/* Left Accent Bar on Hover */}
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-400 to-teal-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Header Row */}
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
                    {edu.institution}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-zinc-400">
                    {edu.degree}
                  </p>
                </div>

                {(edu.startYear || edu.endYear) && (
                  <span className="self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 sm:self-center">
                    {formatDate(edu.startYear)}
                    {edu.startYear && edu.endYear ? " – " : ""}
                    {formatDate(edu.endYear)}
                  </span>
                )}
              </div>

              {/* GPA Badge */}
              {edu.result && (
                <div className="mt-4 flex items-center">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-50/50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <Award className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{edu.result}</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
