"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
  icon?: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: Toast["type"], icon?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, type: Toast["type"] = "success", icon?: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium animate-[fade-in-up_0.3s_ease-out_both] pointer-events-auto
              ${toast.type === "success" ? "bg-surface-container-lowest text-on-surface border border-outline-variant/20" : ""}
              ${toast.type === "info" ? "bg-primary-container text-on-primary-container" : ""}
              ${toast.type === "error" ? "bg-error-container text-on-error-container" : ""}
            `}
          >
            {toast.icon && (
              <span className={`material-symbols-outlined text-base ${toast.type === "success" ? "text-primary" : ""}`}>
                {toast.icon}
              </span>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
