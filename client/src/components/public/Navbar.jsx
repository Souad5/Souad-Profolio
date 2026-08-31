import { useState } from "react";
import { Link } from "react-scroll";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigation, useSiteSettings } from "../../hooks/usePortfolio.js";
import Icon from "../ui/Icon.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { AppButton } from "../ui/app-button.jsx";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";

export default function Navbar() {
  const { data: nav = [] } = useNavigation();
  const { data: settings } = useSiteSettings();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-surface/80 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-950/70">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <a href="#home" className="font-display text-lg font-bold tracking-tight">
          {settings?.name?.split(" ").slice(0, 2).join(" ") || "Souad"}
          <span className="text-brand-600 dark:text-brand-400">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <Link
                to={item.target}
                smooth
                duration={500}
                spy
                activeClass="text-brand-600 dark:text-brand-400"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:text-ink dark:text-slate-400 dark:hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {settings?.availability && (
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 lg:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {settings.availability}
            </span>
          )}

          <AppButton
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle color theme"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </AppButton>

          <AppButton
            asChild
            className="hidden sm:inline-flex"
          >
            <a
              href={settings?.resumeUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </AppButton>

          <AppButton
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <FaTimes /> : <FaBars />}
          </AppButton>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-surface md:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <ul className="flex flex-col gap-1 p-4">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.target}
                    smooth
                    duration={500}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
