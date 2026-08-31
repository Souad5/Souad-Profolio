import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  // 50% of the navbar height (h-14 = 56px). Once content scrolls past this
  // midpoint, the glassy backdrop blur kicks in.
  const [blurIn, setBlurIn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      setBlurIn(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`z-50 w-full transition-all duration-300 ${scrolled ? "sticky top-2" : "sticky top-0"} ${blurIn && !scrolled ? "backdrop-blur-md" : ""}`}
    >
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${scrolled
          ? "max-w-3xl rounded-full border border-white/60 bg-white/70 shadow-lg backdrop-blur-lg sm:px-5 dark:border-slate-700/60 dark:bg-slate-900/70"
          : "w-full"}`}
        aria-label="Main"
      >
        {/* Logo */}
        <a href="#home" className="shrink-0 font-display text-lg font-bold tracking-tight">
          {settings?.name?.split(" ").slice(0, 2).join(" ") || "Souad"}
          <span className="text-brand-500">.</span>
        </a>

        {/* Centered nav — pill container on desktop */}
        <ul className="hidden items-center gap-0.5 rounded-full border border-border/50 bg-muted/50 px-1.5 py-1 backdrop-blur-sm md:flex dark:border-border/40 dark:bg-muted/30">
          {nav.map((item) => (
            <li key={item.id}>
              <Link
                to={item.target}
                smooth
                duration={500}
                spy
                offset={-56}
                activeClass="!bg-brand-500/10 !text-brand-600 dark:!text-brand-400"
                className="block cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium text-muted-foreground transition hover:text-foreground dark:text-slate-400 dark:hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5">
          {settings?.availability && (
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 lg:inline-flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
            {theme === "dark" ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
          </AppButton>

          <AppButton
            asChild
            size="sm"
            className="hidden rounded-full px-4 text-[13px] font-semibold sm:inline-flex"
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
            {open ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
          </AppButton>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/40 bg-background backdrop-blur-lg md:hidden"
          >
            <ul className="flex flex-col gap-0.5 p-3">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.target}
                    smooth
                    duration={500}
                    offset={-56}
                    onClick={() => setOpen(false)}
                    className="block cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted/60 hover:text-foreground"
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
