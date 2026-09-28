import { Inbox, AlertTriangle } from "lucide-react";
import { AppButton } from "../ui/app-button.jsx";
import { Skeleton } from "../ui/skeleton.jsx";

export function LoadingState({ label = "Loading…" }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-40 w-full" />
      <p className="sr-only">{label}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong", retry }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        {message}
      </span>
      {retry && (
        <AppButton variant="ghost" size="sm" className="text-destructive" onClick={retry}>
          Retry
        </AppButton>
      )}
    </div>
  );
}

export function EmptyState({ message = "Nothing here yet" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
      <span className="rounded-full bg-muted p-3">
        <Inbox className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-foreground">{message}</p>
    </div>
  );
}
