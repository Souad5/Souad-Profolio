import { motion } from "framer-motion";
import { useTestimonials } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const { data: testimonials = [] } = useTestimonials();
  if (!testimonials.length) return null;

  return (
    <Section name="testimonials" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Testimonials" title="Kind Words" />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="flex flex-col rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <FaQuoteLeft className="mb-3 text-brand-600/40 dark:text-brand-400/40" />
            <blockquote className="flex-1 text-sm leading-relaxed text-ink-muted dark:text-slate-300">
              {t.content}
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <div className="avatar">
                <div className="w-11 rounded-full bg-brand-600/10">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} />
                  ) : (
                    <span className="flex h-full items-center justify-center text-sm font-semibold text-brand-600 dark:text-brand-400">
                      {t.name?.[0]}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <p className="font-medium">{t.name}</p>
                {(t.role || t.company) && (
                  <p className="text-xs text-ink-muted dark:text-slate-400">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </figcaption>
            {t.rating ? (
              <div className="mt-3 flex gap-0.5 text-amber-400" aria-label={`${t.rating} star rating`}>
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <FaStar key={idx} className="text-xs" />
                ))}
              </div>
            ) : null}
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}
