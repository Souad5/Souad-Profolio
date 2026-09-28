import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-scroll";
import { useServices, useSiteSettings } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: "0px 0px 10% 0px" };

const pad = (n) => String(n).padStart(2, "0");

/* ------------------------------------------------------------------ */
/* Preview panel (desktop) — shows the hovered / focused service       */
/* ------------------------------------------------------------------ */

function Preview({ service, index, total, cta }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white shadow-2xl shadow-slate-900/20 dark:bg-slate-900 dark:ring-1 dark:ring-white/10">
      {/* Ambient glow + grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]"
      />

      <div className="relative flex items-center justify-between text-sm text-white/60">
        <span className="tabular-nums">
          {pad(index + 1)} / {pad(total)}
        </span>
        <span className="text-xs uppercase tracking-[0.2em]">Service</span>
      </div>

      <div aria-live="polite" className="relative mt-10 min-h-64">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <motion.span
              initial={{ scale: 0.6, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-brand-400 to-brand-600 text-slate-950 shadow-lg shadow-brand-500/30"
            >
              <Icon name={service.icon} className="h-9 w-9" />
            </motion.span>
            <h3 className="mt-8 font-display text-3xl leading-tight">{service.title}</h3>
            <p className="mt-4 text-pretty leading-relaxed text-white/70">{service.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <Link
        to="contact"
        smooth
        offset={-80}
        href="#contact"
        className="group relative mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm text-slate-900 transition hover:bg-brand-400"
      >
        {cta}
        <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Row                                                                 */
/* ------------------------------------------------------------------ */

function Row({ service, index, active, onActivate }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.5, delay: index * 0.05, ease: EASE }}
      className="relative border-b border-slate-200 dark:border-slate-800"
    >
      <button
        type="button"
        onMouseEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        onClick={() => onActivate(index)}
        aria-expanded={active}
        aria-controls={`service-panel-${service.id}`}
        className="group relative flex w-full cursor-pointer items-center gap-4 py-4 text-left sm:gap-6 sm:py-5"
      >
        {/* Sliding highlight behind the active row */}
        {active && (
          <motion.span
            layoutId="service-row-highlight"
            aria-hidden="true"
            className="absolute inset-y-1 -left-4 -right-4 rounded-2xl bg-brand-500/[0.07] dark:bg-brand-400/[0.08]"
            transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
          />
        )}

        <span
          className={`relative w-8 shrink-0 text-sm tabular-nums transition-colors ${
            active ? "text-brand-600 dark:text-brand-400" : "text-ink-muted dark:text-slate-400"
          }`}
        >
          {pad(index + 1)}
        </span>

        <span
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 lg:hidden ${
            active
              ? "bg-brand-600 text-white dark:bg-brand-400 dark:text-slate-900"
              : "bg-slate-100 text-ink-muted dark:bg-slate-800 dark:text-slate-400"
          }`}
        >
          <Icon name={service.icon} className="h-5 w-5" />
        </span>

        <span
          className={`relative flex-1 font-display text-2xl leading-tight transition-all duration-300 sm:text-3xl lg:text-4xl ${
            active
              ? "translate-x-1 text-ink dark:text-white"
              : "text-ink/60 group-hover:text-ink/80 dark:text-slate-400 dark:group-hover:text-slate-200"
          }`}
        >
          {service.title}
        </span>

        <ArrowUpRight
          aria-hidden="true"
          className={`relative h-6 w-6 shrink-0 transition-all duration-300 ${
            active
              ? "rotate-45 text-brand-600 opacity-100 dark:text-brand-400 lg:rotate-0"
              : "text-ink-muted opacity-0 group-hover:opacity-60 dark:text-slate-500"
          }`}
        />
      </button>

      {/* Mobile / tablet: the description expands inline under the row */}
      <div
        id={`service-panel-${service.id}`}
        className={`grid transition-[grid-template-rows] duration-300 lg:hidden ${
          active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pl-12 pr-2 text-pretty leading-relaxed text-ink-muted sm:pl-14 dark:text-slate-400">
            {service.description}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function Services() {
  const { data } = useServices();
  const { data: settings } = useSiteSettings();
  const [active, setActive] = useState(0);

  const services = (Array.isArray(data) ? data : []).filter((s) => s && s.enabled !== false);
  if (!services.length) return null;

  const current = Math.min(active, services.length - 1);
  const cta = settings?.heroSecondaryCta || "Contact Me";

  return (
    <Section name="services" className="relative overflow-hidden lg:pt-10!">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Services"
          title="What I Offer"
          subtitle="End-to-end solutions that take your idea from concept to a polished, production-ready product."
        />
        <p aria-hidden="true" className="mb-12 hidden font-display text-6xl leading-none text-ink/10 lg:block dark:text-white/10">
          {pad(services.length)}
        </p>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <ul className="border-t border-slate-200 lg:col-span-7 dark:border-slate-800">
          {services.map((s, i) => (
            <Row key={s.id} service={s} index={i} active={i === current} onActivate={setActive} />
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="hidden lg:sticky lg:top-28 lg:col-span-5 lg:block"
        >
          <Preview service={services[current]} index={current} total={services.length} cta={cta} />
        </motion.div>
      </div>
    </Section>
  );
}
