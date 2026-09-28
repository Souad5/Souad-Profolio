import { useEffect, useRef } from "react";
import { AppButton } from "../ui/app-button.jsx";
import { Separator } from "../ui/separator.jsx";
import Icon from "../ui/Icon.jsx";

export default function FormModal({
  open,
  title,
  onClose,
  children,
  onSubmit,
  submitting = false,
  footerRight,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className="modal-box max-w-2xl max-h-[85vh] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xl p-0">
        <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <AppButton
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground"
          >
            <Icon name="FaTimes" />
          </AppButton>
        </div>
        <form onSubmit={onSubmit}>
          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-5 py-5">
            {children}
          </div>
          <Separator />
          <div className="modal-action flex items-center gap-2 px-5 py-4">
            <div className="flex-1">{footerRight}</div>
            <AppButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </AppButton>
            <AppButton type="submit" loading={submitting}>
              {submitting ? "Saving…" : "Save"}
            </AppButton>
          </div>
        </form>
      </div>
    </dialog>
  );
}
