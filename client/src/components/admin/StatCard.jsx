import { Card, CardContent } from "../ui/card.jsx";

const ACCENTS = {
  primary: "bg-brand-600/10 text-brand-600 dark:text-brand-400",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  error: "bg-red-500/10 text-red-600 dark:text-red-400",
  neutral: "bg-muted text-muted-foreground",
};

export default function StatCard({ label, value, icon, accent = "primary" }) {
  return (
    <Card size="sm" className="ring-border">
      <CardContent className="flex items-center gap-4">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg ${ACCENTS[accent] || ACCENTS.primary}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {value ?? 0}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
