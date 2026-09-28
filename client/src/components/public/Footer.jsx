import { motion } from "framer-motion";
import { Link, animateScroll } from "react-scroll";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useNavigation, useSiteSettings } from "../../hooks/usePortfolio.js";
import Icon from "../ui/Icon.jsx";
import { PulseDot } from "../ui/pulse-dot.jsx";

const EASE = [0.22, 1, 0.36, 1];

function ColumnTitle({ children }) {
  return (
    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ink-muted dark:text-slate-400">
      {children}
    </p>
  );
}

const linkClass =
  "group inline-flex cursor-pointer items-center gap-1.5 text-sm text-ink transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400";

export default function Footer() {
  const { data: nav = [] } = useNavigation();
  const { data: settings } = useSiteSettings();
  const year = new Date().getFullYear();

  // Same short brand as the navbar logo ("Md Souad").
  const brand = settings?.name?.split(" ").slice(0, 2).join(" ") || "Souad";
  const socials = settings?.socialLinks ?? [];
  const tagline = settings?.heroDescription || settings?.shortBio;

  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-surface-muted/60 dark:border-slate-800 dark:bg-slate-950">
      {/* Soft brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-400/10"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <p className="font-display text-2xl text-ink dark:text-white">
              {settings?.name || brand}
              <span className="text-brand-500">.</span>
            </p>
            {settings?.title && (
              <p className="mt-1 text-sm uppercase tracking-[0.15em] text-brand-600 dark:text-brand-400">
                {settings.title}
              </p>
            )}
            {tagline && (
              <p className="mt-4 max-w-sm text-pretty text-sm leading-relaxed text-ink-muted dark:text-slate-400">
                {tagline}
              </p>
            )}
            {settings?.availability && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/5 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                <PulseDot />
                {settings.availability}
              </p>
            )}
          </div>

          {/* Navigate — react-scroll, same targets/offset as the navbar */}
          {nav.length > 0 && (
            <nav aria-label="Footer" className="md:col-span-2">
              <ColumnTitle>Navigate</ColumnTitle>
              <ul className="space-y-2.5">
                {nav.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.target}
                      href={`#${item.target}`}
                      smooth
                      duration={500}
                      offset={-56}
                      className={`${linkClass} gap-0`}
                    >
                      {/* Dash grows in on hover without indenting the resting text */}
                      <span className="mr-0 h-px w-0 bg-current transition-all duration-300 group-hover:mr-1.5 group-hover:w-3" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* Connect */}
          {socials.length > 0 && (
            <div className="md:col-span-2">
              <ColumnTitle>Connect</ColumnTitle>
              <ul className="space-y-2.5">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      <Icon name={s.icon} className="text-sm" />
                      {s.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          {(settings?.email || settings?.phone || settings?.location) && (
            <div className="md:col-span-3">
              <ColumnTitle>Get in touch</ColumnTitle>
              <ul className="space-y-2.5">
                {settings?.email && (
                  <li>
                    <a href={`mailto:${settings.email}`} className={`${linkClass} break-all`}>
                      <Mail className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                      {settings.email}
                    </a>
                  </li>
                )}
                {settings?.phone && (
                  <li>
                    <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className={linkClass}>
                      <Phone className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                      {settings.phone}
                    </a>
                  </li>
                )}
                {settings?.location && (
                  <li className="inline-flex items-center gap-1.5 text-sm text-ink-muted dark:text-slate-400">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                    {settings.location}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-200 py-6 sm:flex-row dark:border-slate-800">
          <p className="text-xs text-ink-muted dark:text-slate-400">
            © {year} {settings?.name || brand}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => animateScroll.scrollToTop({ duration: 700, smooth: "easeInOutQuart" })}
            className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs text-ink transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-400"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Oversized wordmark, letters rising in on view and cropped by the edge.
          Rendered only once the real name has loaded, and keyed on it: a
          one-shot whileInView that already fired (e.g. while the page was
          still short) would otherwise leave later-mounted letters hidden. */}
      {settings?.name && (
        <div aria-hidden="true" className="pointer-events-none relative -mb-[0.22em] select-none overflow-hidden">
          <motion.p
            key={brand}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px 5% 0px" }}
            transition={{ staggerChildren: 0.04 }}
            className="whitespace-nowrap text-center font-display leading-[0.9]"
            // Scale to the brand's length so any name fits the viewport width
            // (~0.63em per glyph in the display face), capped for huge screens.
            style={{ fontSize: `min(15rem, ${(94 / (0.63 * (brand.length + 1))).toFixed(2)}vw)` }}
          >
            {[...brand, "."].map((ch, i, arr) => (
              <motion.span
                key={i}
                variants={{ hidden: { y: "60%", opacity: 0 }, visible: { y: "0%", opacity: 1 } }}
                transition={{ duration: 0.8, ease: EASE }}
                className={`inline-block bg-clip-text text-transparent ${
                  i === arr.length - 1
                    ? "bg-brand-500"
                    : "bg-linear-to-b from-slate-900/15 to-slate-900/0 dark:from-white/15 dark:to-white/0"
                }`}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            ))}
          </motion.p>
        </div>
      )}
    </footer>
  );
}
