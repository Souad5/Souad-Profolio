import { motion } from "framer-motion";
import { useAbout } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

export default function About() {
  const { data: about } = useAbout();
  if (!about) return null;

  return (
    <Section name="about" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="About" title={about.heading || "About Me"} />
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        {about.image && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <img src={about.image} alt={about.heading || "About"} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-1 space-y-5 lg:order-2"
        >
          {(about.description || "").split("\n").filter(Boolean).map((para, i) => (
            <p key={i} className="leading-relaxed text-ink-muted dark:text-slate-300">
              {para}
            </p>
          ))}
        </motion.div>
      </div>

      {Array.isArray(about.skillTags) && about.skillTags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {about.skillTags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-slate-200 bg-surface px-3 py-1 text-sm text-ink-muted dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {Array.isArray(about.highlights) && about.highlights.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {about.highlights.map((h, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <Icon name={h?.icon || "FaCheckCircle"} className="text-lg text-brand-600 dark:text-brand-400" />
              <div>
                <p className="font-medium">{h?.title}</p>
                {h?.detail && <p className="text-sm text-ink-muted dark:text-slate-400">{h.detail}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
