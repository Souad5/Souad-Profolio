import { motion } from "framer-motion";
import { useCertifications } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import { FaAward, FaExternalLinkAlt } from "react-icons/fa";

export default function Certifications() {
  const { data: certs = [] } = useCertifications();
  if (!certs.length) return null;

  return (
    <Section name="certifications">
      <SectionHeading eyebrow="Credentials" title="Certifications" />
      <div className="grid gap-4 md:grid-cols-2">
        {certs.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-surface p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="shrink-0 rounded-lg bg-brand-600/10 p-3 text-brand-600 dark:text-brand-400">
              <FaAward />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">{c.title}</h3>
              <p className="text-sm text-ink-muted dark:text-slate-400">
                {c.issuer}{c.year ? ` · ${c.year}` : ""}
              </p>
            </div>
            {c.link && (
              <a href={c.link} target="_blank" rel="noopener noreferrer" aria-label={`View ${c.title} credential`} className="rounded-lg p-2 text-ink-muted transition hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800">
                <FaExternalLinkAlt />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
