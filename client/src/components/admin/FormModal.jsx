import { useEffect, useRef } from "react";

export default function FormModal({ open, title, onClose, children, onSubmit, submitting = false, footerRight }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className="modal-box max-w-2xl max-h-[85vh] overflow-y-auto">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <form onSubmit={onSubmit}>
          <div className="space-y-3">{children}</div>
          <div className="modal-action">
            {footerRight}
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? <span className="loading loading-spinner loading-xs"></span> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
