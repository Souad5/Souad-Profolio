import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { useServices } from "../../../hooks/usePortfolio.js";
import { Section } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

export default function Services() {
  const { data: services = [] } = useServices();
  if (!services.length) return null;

  return (
    <Section
      name="services"
      className="relative overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-16 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl"
      />
      <Plus
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-1/2 hidden h-8 w-8 text-teal-500/20 lg:block"
      />
      <Plus
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-16 hidden h-6 w-6 text-slate-300 dark:text-slate-700 lg:block"
      />

      {/* Header */}
      <div className="mb-14 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-400"
        >
          Services
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl"
        >
          What Do I Offer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-muted dark:text-slate-400"
        >
          End-to-end solutions that take your idea from concept to a polished,
          production-ready product — backed by a strong design and engineering
          toolkit.
        </motion.p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <motion.article
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.08 }}
            className="group relative rounded-2xl border border-slate-100 bg-white/80 p-8 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-teal-500/50 hover:shadow-xl hover:shadow-teal-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-teal-400/50"
          >
            {/* Glowing icon ring */}
            <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-teal-500/10 blur-md transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-teal-500/20 bg-teal-500/10 text-teal-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:border-teal-500/40 dark:text-teal-400 dark:group-hover:border-teal-400/40">
                <Icon name={s.icon} className="h-7 w-7" />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {s.title}
            </h3>

            {/* Hover reveal summary */}
            <div className="mt-3 grid grid-rows-[0fr] transition-all duration-300 group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="text-sm leading-relaxed text-ink-muted dark:text-slate-400">
                  {s.description}
                </p>
              </div>
            </div>

            <span
              aria-hidden="true"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-teal-400"
            >
              Learn more
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
