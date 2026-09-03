import { forwardRef } from "react";
import { motion } from "framer-motion";

export const Section = forwardRef(function Section(
  { id, name, className = "", children },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      name={name}
      className={`py-20 px-5 sm:px-8 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
});

export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      className="max-w-2xl mb-12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-ink-muted dark:text-slate-400 leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}
