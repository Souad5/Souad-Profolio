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
import { timeAgo, initials } from "../../lib/utils.js";
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
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm opacity-70">
            {messages.length} total · {data?.unread ?? 0} unread
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-2 overflow-y-auto max-h-[70vh]">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelected(m);
                markRead(m);
              }}
              className={`w-full text-left p-3 rounded-lg border bg-base-100 flex items-start gap-3 hover:border-primary transition ${
                !m.read ? "border-primary/60" : "border-base-300"
              }`}
            >
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-9">
                  <span>{initials(m.name)}</span>
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">
                    {m.name}
                    {!m.read && (
                      <span className="badge badge-xs badge-primary ml-2">
                        New
                      </span>
                    )}
                  </span>
                  <span className="text-xs opacity-60 shrink-0">
                    {timeAgo(m.createdAt)}
                  </span>
                </div>
                <p className="text-xs opacity-70 truncate">{m.email}</p>
                <p className="text-sm line-clamp-2">{m.message}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-base-300 bg-base-100 p-4 min-h-50">
          {selected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold">{selected.name}</span>
                  <div className="text-sm opacity-70">{selected.email}</div>
                </div>
                <button
                  className="btn btn-ghost btn-sm text-error"
                  onClick={() => setDeleting(selected)}
                >
                  <FaTrash />
                </button>
              </div>
              {selected.subject && (
                <div className="text-sm font-medium">
                  Re: {selected.subject}
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap border-t border-base-300 pt-3">
                {selected.message}
              </p>
              <a
                className="btn btn-primary btn-sm mt-4"
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your message")}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaReply /> Reply
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-base-400">
              Select a message
            </div>
          )}
        </div>
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
