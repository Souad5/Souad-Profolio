import { Link } from "react-router";
import { Bell } from "lucide-react";
import { useAdminMessages, useAdminStats } from "../../hooks/useAdmin.js";
import { timeAgo, initials } from "../../lib/utils.js";
import { Button } from "../ui/button.jsx";
import { Avatar, AvatarFallback } from "../ui/avatar.jsx";
import { ScrollArea } from "../ui/scroll-area.jsx";
import { Separator } from "../ui/separator.jsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.jsx";

function UnreadBadge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white ring-2 ring-background dark:bg-brand-400 dark:text-ink">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function NotificationsBell() {
  const { data: messages, isLoading } = useAdminMessages(5);
  const { data: stats } = useAdminStats();
  const items = messages?.items ?? [];
  const unread = stats?.stats?.unreadMessages ?? messages?.unread ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        >
          <Bell />
          <UnreadBadge count={unread} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <DropdownMenuLabel className="px-4 py-3 text-sm font-semibold text-foreground">
          Notifications
        </DropdownMenuLabel>
        <Separator />

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <span className="loading loading-spinner loading-sm" />
            Loading…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <span className="rounded-full bg-muted p-3 text-muted-foreground">
              <Bell className="h-5 w-5" />
            </span>
            <p className="mt-1 text-sm font-medium text-foreground">
              All caught up
            </p>
            <p className="text-xs text-muted-foreground">
              No new messages yet.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-80">
              <div className="p-1">
                {items.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    asChild
                    className="cursor-pointer rounded-md px-2 py-2"
                  >
                    <Link
                      to="/admin/messages"
                      className="flex items-start gap-3"
                    >
                      <Avatar className="size-9 text-xs">
                        <AvatarFallback
                          className={
                            m.read
                              ? "text-muted-foreground"
                              : "font-semibold text-brand-600 dark:text-brand-400"
                          }
                        >
                          {initials(m.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium">
                            {m.name}
                            {!m.read && (
                              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand-600 align-middle dark:bg-brand-400" />
                            )}
                          </span>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {timeAgo(m.createdAt)}
                          </span>
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {m.message}
                        </span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </ScrollArea>
            {unread > items.length && (
              <p className="px-4 py-2 text-[11px] text-muted-foreground">
                +{unread - items.length} more unread
              </p>
            )}
          </>
        )}

        {items.length > 0 && (
          <>
            <Separator />
            <div className="p-1">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to="/admin/messages"
                  className="justify-center py-2 text-sm font-medium"
                >
                  View all messages
                </Link>
              </DropdownMenuItem>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
