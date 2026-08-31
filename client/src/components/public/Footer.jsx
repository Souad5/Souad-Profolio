import { useNavigation, useSiteSettings } from "../../hooks/usePortfolio.js";
import Icon from "../ui/Icon.jsx";

export default function Footer() {
  const { data: nav = [] } = useNavigation();
  const { data: settings } = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-surface-muted/60 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:px-8 md:flex-row">
        <p className="text-sm text-ink-muted dark:text-slate-400">
          © {year} {settings?.name || "Souad"}. All rights reserved.
        </p>

        <nav aria-label="Footer" className="hidden md:block">
          <ul className="flex gap-6 text-sm font-medium">
            {nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.target}`} className="text-ink-muted transition hover:text-ink dark:text-slate-400 dark:hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {settings?.socialLinks?.length > 0 && (
          <div className="flex gap-4">
            {settings.socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="rounded-lg p-2 text-ink-muted transition hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-brand-400"
              >
                <Icon name={s.icon} className="text-lg" />
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
