import { motion } from "framer-motion";
import { useServices } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

export default function Services() {
  const { data: services = [] } = useServices();
  if (!services.length) return null;

  return (
    <Section name="services">
      <SectionHeading eyebrow="Services" title="What I Do" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 inline-flex rounded-xl bg-brand-600/10 p-3 text-brand-600 dark:text-brand-400">
              <Icon name={s.icon} className="text-2xl" />
            </div>
            <h3 className="font-display font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-slate-400">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
