import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppButton } from "../components/ui/app-button.jsx";

const ToastContext = createContext(null);
let idSeq = 0;

// Errors stay a little longer: they usually need reading/acting on.
const DURATION = { success: 4000, info: 4000, error: 6500 };

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});
  const regionRef = useRef(null);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, type = "success") => {
      const id = ++idSeq;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => remove(id), DURATION[type] ?? 4000);
    },
    [remove]
  );

  const toast = useMemo(() => {
    return {
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error"),
      info: (m) => push(m, "info"),
    };
  }, [push]);

  // Admin forms are native <dialog>s, which render in the browser's top layer
  // above every z-index — so toasts shown while a form is open used to sit
  // behind its dimmed backdrop. A manual popover is also top-layer; re-showing
  // it on each change keeps it above the most recently opened dialog.
  useEffect(() => {
    const el = regionRef.current;
    if (!el || typeof el.showPopover !== "function") return;
    try {
      if (el.matches(":popover-open")) el.hidePopover();
      if (toasts.length) el.showPopover();
    } catch {
      /* popover unsupported/unavailable: the fixed-position fallback still shows */
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        ref={regionRef}
        popover="manual"
        aria-live="polite"
        className="fixed z-[100] m-0 flex w-auto max-w-sm flex-col gap-2 overflow-visible border-0 bg-transparent p-0"
        style={{ inset: "1rem 1rem auto auto" }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === "error" ? "alert" : "status"}
            className={`alert shadow-lg ${t.type === "success" ? "alert-success" : t.type === "error" ? "alert-error" : "alert-info"}`}
          >
            <span>{t.message}</span>
            <AppButton variant="ghost" size="sm" className="text-current hover:bg-black/10 hover:text-current" onClick={() => remove(t.id)} aria-label="Dismiss notification">
              ✕
            </AppButton>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
