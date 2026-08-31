import { useEffect, useRef } from "react";

export default function ConfirmDialog({ open, title = "Are you sure?", message, onConfirm, onCancel, loading = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onCancel}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        {message && <p className="py-2 opacity-80">{message}</p>}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error" disabled={loading} onClick={onConfirm}>
            {loading ? <span className="loading loading-spinner loading-xs"></span> : "Delete"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
