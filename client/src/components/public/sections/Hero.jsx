import { motion } from "framer-motion";
import { useSiteSettings } from "../../../hooks/usePortfolio.js";
import Icon from "../../ui/Icon.jsx";
import { AppButton } from "../../ui/app-button.jsx";
import { Section } from "./Section.jsx";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function HeroSkeleton() {
  return (
    <Section name="home" className="relative flex min-h-[calc(100vh-4rem)] items-center">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="order-2 space-y-4 lg:order-1" aria-hidden="true">
          <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-56 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="pt-2 flex gap-3">
            <div className="h-10 w-36 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
        <div className="order-1 flex justify-center lg:order-2">
          <div className="h-64 w-64 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800 sm:h-80 sm:w-80" />
        </div>
      </div>
    </Section>
  );
}

export default function Hero() {
  const { data: s, isLoading } = useSiteSettings();

  if (isLoading) return <HeroSkeleton />;

  return (
    <Section name="home" className="relative min-h-[calc(100vh-4rem)] flex items-center">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
          className="order-2 lg:order-1"
        >
          <motion.p
            variants={fadeUp}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-sm text-ink-muted dark:border-slate-800 dark:text-slate-400"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            {s?.availability || "Available for work"}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {s?.heroGreeting || "Hi, I'm"}{" "}
            <span className="text-brand-600 dark:text-brand-400">
              {s?.heroHighlight || s?.heroHeading?.split(" ").slice(-1)[0] || ""}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 text-xl text-brand-600 dark:text-brand-400">
            {s?.heroSubtitle || s?.title}
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl leading-relaxed text-ink-muted dark:text-slate-400">
            {s?.heroDescription || s?.shortBio}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            {s?.resumeUrl && (
              <AppButton asChild>
                <a
                  href={s.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.heroPrimaryCta || "Resume"}
                </a>
              </AppButton>
            )}
            <AppButton asChild variant="outline">
              <a href="#contact">
                {s?.heroSecondaryCta || "Contact"}
              </a>
            </AppButton>
          </motion.div>

          {s?.socialLinks?.length > 0 && (
            <motion.div variants={fadeUp} className="mt-8 flex gap-3">
              {s.socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="rounded-lg border border-slate-200 p-2.5 text-ink-muted transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:text-slate-400 dark:hover:border-brand-500 dark:hover:text-brand-400"
                >
                  <Icon name={link.icon} className="text-lg" />
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="order-1 flex justify-center lg:order-2"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-500/30 to-transparent blur-2xl"></div>
            {s?.profileImage && (
              <img
                src={s.profileImage}
                alt={s?.name || "Profile"}
                className="relative aspect-square w-64 rounded-3xl object-cover shadow-xl sm:w-80"
              />
            )}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
