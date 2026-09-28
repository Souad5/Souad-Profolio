import { useEffect, useRef } from "react";
import { AppButton } from "../ui/app-button.jsx";
import Icon from "../ui/Icon.jsx";

export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onCancel}>
      <div className="modal-box rounded-xl border border-border bg-card text-card-foreground shadow-xl p-0">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <AppButton
            variant="ghost"
            size="icon-sm"
            onClick={onCancel}
            aria-label="Close"
            className="text-muted-foreground"
          >
            <Icon name="FaTimes" />
          </AppButton>
        </div>
        {message && (
          <p className="px-5 py-5 text-sm text-muted-foreground">{message}</p>
        )}
        <div className="modal-action flex items-center justify-end gap-2 px-5 py-4">
          <AppButton variant="ghost" onClick={onCancel}>
            Cancel
          </AppButton>
          <AppButton variant="destructive" disabled={loading} onClick={onConfirm}>
            {loading ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
          </AppButton>
        </div>
      </div>
    </dialog>
  );
}
