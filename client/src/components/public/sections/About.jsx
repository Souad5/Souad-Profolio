import { motion } from "framer-motion";
import { useAbout, useSkills } from "../../../hooks/usePortfolio.js";
import { Section, SectionHeading } from "./Section.jsx";
import Icon from "../../ui/Icon.jsx";

const containerAnim = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// Render a bio paragraph, colouring any word/phrase that matches a DB
// focusPoint entry with its stored colour.
function renderBioPara(para, focusPoints) {
  const foci = Array.isArray(focusPoints) ? focusPoints.filter((f) => f?.text) : [];
  if (foci.length === 0) return para;

  const pattern = foci
    .map((f) => f.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");
  const re = new RegExp(`(${pattern})`, "gi");

  return para.split(re).map((chunk, i) => {
    const focus = foci.find((f) => f.text.toLowerCase() === chunk.toLowerCase());
    if (!focus) return chunk;
    return (
      <span
        key={i}
        className={`font-semibold ${focus.color || "text-brand-600 dark:text-brand-400"}`}
      >
        {chunk}
      </span>
    );
  });
}

export default function About() {
  const { data: about } = useAbout();
  const { data: skills } = useSkills();

  if (!about) return null;

  // Flatten real skill records (name + icon from DB) for the tech badge wall.
  const techList = (Array.isArray(skills) ? skills : [])
    .flatMap((c) => c?.skills ?? [])
    .filter((sk) => sk && sk.enabled !== false)
    .slice(0, 8);

  const highlights = Array.isArray(about.highlights) ? about.highlights : [];
  const paragraphs = String(about.description || "").split("\n").filter(Boolean);

  return (
    <Section name="about" className="bg-surface-muted/60 dark:bg-slate-900/40">
      <SectionHeading eyebrow="About" title={about.heading || "About Me"} />

      <motion.div
        variants={containerAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16"
      >
        {/* -------- Photo + floating accent cards (bento ~5 cols) -------- */}
        {about.image && (
          <motion.div
            variants={itemAnim}
            className="relative order-2 mx-auto w-full max-w-sm lg:order-1 lg:col-span-5"
          >
            <div className="relative rounded-[2rem] bg-linear-to-r from-brand-500 via-brand-400 to-brand-600 p-[3px] shadow-2xl shadow-brand-500/20">
              <div className="overflow-hidden rounded-[calc(2rem-3px)] bg-surface dark:bg-slate-900">
                <motion.img
                  src={about.image}
                  alt={about.heading || "About"}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
            </div>

            {/* Floating: status / experience accent card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="absolute -right-4 top-8 glass-card"
            >
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/70">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold text-ink dark:text-slate-200">Available</p>
                  <p className="text-[11px] text-ink-muted dark:text-slate-400">For projects</p>
                </div>
              </div>
            </motion.div>

            {/* Floating: metrics accent card */}
            {techList.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="absolute -left-4 bottom-10"
              >
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 text-left shadow-lg backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/70">
                  <p className="font-display text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {techList.length}+
                  </p>
                  <p className="text-[11px] uppercase tracking-wider text-ink-muted dark:text-slate-400">
                    Core technologies
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* -------- Story + highlights + tech badges (bento ~7 cols) -------- */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          {/* Bio paragraphs with focusPoint emphasis */}
          <motion.div
            variants={containerAnim}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-4"
          >
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                variants={itemAnim}
                className="text-[17px] leading-relaxed text-ink-muted dark:text-slate-300"
              >
                {renderBioPara(para, about.focusPoints)}
              </motion.p>
            ))}
          </motion.div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <motion.div
              variants={containerAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  variants={itemAnim}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex items-start gap-3.5 rounded-2xl border border-slate-200 bg-surface p-4 shadow-sm transition hover:border-brand-500/50 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="shrink-0 rounded-xl bg-brand-600/10 p-2.5 text-brand-600 transition group-hover:scale-110 dark:text-brand-400">
                    <Icon name={h?.icon || "FaCheckCircle"} className="text-lg" />
                  </span>
                  <div>
                    <p className="font-semibold text-ink dark:text-slate-100">{h?.title}</p>
                    {h?.detail && (
                      <p className="mt-0.5 text-sm text-ink-muted dark:text-slate-400">{h.detail}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Tech stack badges (real skill records + swap icons) */}
          {techList.length > 0 && (
            <motion.div
              variants={containerAnim}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-8"
            >
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2.5">
                {techList.map((sk, i) => (
                  <motion.span
                    key={sk.id ?? i}
                    variants={itemAnim}
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-muted shadow-sm transition-shadow hover:border-brand-500/60 hover:text-brand-600 hover:shadow-[0_0_18px_rgba(16,185,129,0.25)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-brand-400 dark:hover:border-brand-500/60"
                  >
                    <Icon name={sk.icon} className="text-base text-brand-600 dark:text-brand-400" />
                    {sk.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Section>
  );
}
