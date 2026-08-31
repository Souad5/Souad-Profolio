import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin as adminApi } from "../../api/endpoints.js";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/admin/States.jsx";
import ConfirmDialog from "../../components/admin/ConfirmDialog.jsx";
import { useToast } from "../../lib/toast.jsx";
import { AppButton } from "../../components/ui/app-button.jsx";
import { Card } from "../../components/ui/card.jsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";
import { ScrollArea } from "../../components/ui/scroll-area.jsx";
import { timeAgo, initials, cn } from "../../lib/utils.js";
import { FaTrash, FaReply } from "react-icons/fa";

export default function MessagesPage() {
  const qc = useQueryClient();
  const toast = useToast();
  const [deleting, setDeleting] = useState(null);
  const [selected, setSelected] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: () => adminApi.messages.list({ limit: 100 }),
    select: (res) => res?.data,
  });

  const markReadMut = useMutation({
    mutationFn: (id) => adminApi.messages.markRead(id),
  });
  const deleteMut = useMutation({
    mutationFn: (id) => adminApi.messages.remove(id),
  });

  const markRead = async (msg) => {
    if (msg.read) return;
    try {
      await markReadMut.mutateAsync(msg.id);
      setSelected((prev) =>
        prev && prev.id === msg.id ? { ...prev, read: true } : prev,
      );
      await qc.invalidateQueries({ queryKey: ["messages"] });
    } catch (e) {
      toast.error(e.message || "Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMut.mutateAsync(deleting.id);
      toast.success("Message deleted");
      setSelected((prev) => (prev && prev.id === deleting.id ? null : prev));
      setDeleting(null);
      await qc.invalidateQueries({ queryKey: ["messages"] });
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    }
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState retry={refetch} />;
  const messages = data?.items ?? [];
  if (messages.length === 0) return <EmptyState message="No messages yet" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Messages
          </h1>
          <p className="text-sm text-muted-foreground">
            {messages.length} total · {data?.unread ?? 0} unread
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ScrollArea className="h-[70vh] rounded-xl border border-border bg-card">
          <div className="space-y-2 p-3">
            {messages.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelected(m);
                  markRead(m);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:border-brand-400",
                  selected?.id === m.id
                    ? "border-brand-500 bg-brand-50/60 dark:bg-brand-500/10"
                    : !m.read
                      ? "border-brand-300/70 bg-card dark:border-brand-500/40"
                      : "border-border bg-card",
                )}
              >
                <Avatar className="size-9 text-xs">
                  <AvatarFallback
                    className={
                      !m.read
                        ? "font-semibold text-brand-600 dark:text-brand-400"
                        : "text-muted-foreground"
                    }
                  >
                    {initials(m.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">
                      {m.name}
                      {!m.read && (
                        <span className="ml-2 inline-block rounded-full bg-brand-600/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-600 dark:bg-brand-400/10 dark:text-brand-400">
                          New
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(m.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.email}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-sm">{m.message}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <Card className="min-h-[70vh] ring-border">
          <div className="flex h-full flex-col p-4">
            {selected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground">
                      {selected.name}
                    </span>
                    <div className="text-sm text-muted-foreground">
                      {selected.email}
                    </div>
                  </div>
                  <AppButton
                    variant="ghost"
                    size="sm"
                    className="text-error"
                    onClick={() => setDeleting(selected)}
                    aria-label="Delete message"
                  >
                    <FaTrash />
                  </AppButton>
                </div>
                {selected.subject && (
                  <div className="text-sm font-medium text-foreground">
                    Re: {selected.subject}
                  </div>
                )}
                <p className="whitespace-pre-wrap border-t border-border pt-3 text-sm">
                  {selected.message}
                </p>
                <AppButton size="sm" asChild>
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FaReply /> Reply
                  </a>
                </AppButton>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Select a message
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={!!deleting}
        message="Delete this message permanently?"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteMut.isPending}
      />
    </div>
  );
}
