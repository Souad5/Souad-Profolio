import { cn } from "../../lib/utils.js";

function Dot({ className }) {
  return <span className={cn("h-1.5 w-1.5 rounded-full", className)} />;
}

export default function StatusBadge({ enabled }) {
  return enabled ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <Dot className="bg-emerald-500" />
      Enabled
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      <Dot className="bg-muted-foreground/60" />
      Disabled
    </span>
  );
}

export function PublishedBadge({ published }) {
  return published ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400">
      <Dot className="bg-sky-500" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      <Dot className="bg-muted-foreground/60" />
      Draft
    </span>
  );
}

export function FeaturedBadge({ featured }) {
  return featured ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
      <Dot className="bg-amber-500" />
      Featured
    </span>
  ) : null;
}
