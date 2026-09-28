import { useSiteSettings } from "../../hooks/usePortfolio.js";

export default function Marquee() {
  const { data: s } = useSiteSettings();
  const tags = Array.isArray(s?.heroTags) ? s.heroTags : [];
  if (!tags.length) return null;

  const repeated = [...tags, ...tags];

  return (
    <div className="w-full overflow-hidden border-b border-border/50 bg-muted/40 py-1.5 dark:bg-muted/20">
      <div className="animate-marquee flex w-max items-center gap-0 whitespace-nowrap">
        {repeated.map((tag, i) => (
          <span key={`${tag}-${i}`} className="flex items-center gap-0">
            <span className="px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
              {tag}
            </span>
            <span className="text-brand-400/50 dark:text-brand-500/40 select-none">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
