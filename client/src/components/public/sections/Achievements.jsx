import { motion } from "framer-motion";
import { useAchievements } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

export default function Achievements() {
  const { data: achievements = [] } = useAchievements();
  if (!achievements.length) return null;

  return (
    <Section name="achievements" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="Achievements" title="Achievements" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl border border-slate-200 bg-surface p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 inline-flex rounded-lg bg-amber-500/10 p-2.5 text-amber-500">
              <Icon name={a.icon} className="text-xl" />
            </div>
            <h3 className="font-medium">{a.title}</h3>
            {a.detail && <p className="mt-1 text-sm text-ink-muted dark:text-slate-400">{a.detail}</p>}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
