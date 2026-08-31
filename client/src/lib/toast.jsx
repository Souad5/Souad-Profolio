import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AppButton } from "../components/ui/app-button.jsx";

const ToastContext = createContext(null);
let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback(
    (message, type = "success") => {
      const id = ++idSeq;
      setToasts((prev) => [...prev, { id, message, type }]);
      timers.current[id] = setTimeout(() => remove(id), 4000);
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

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast toast-top toast-end z-[100]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`alert shadow-lg ${t.type === "success" ? "alert-success" : t.type === "error" ? "alert-error" : "alert-info"}`}
          >
            <span>{t.message}</span>
            <AppButton variant="ghost" size="sm" onClick={() => remove(t.id)}>
              ✕
            </AppButton>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
