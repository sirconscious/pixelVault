"use client";

import { CheckCircle2, XCircle, Info, TriangleAlert, X } from "lucide-react";
import { useToastStore, type ToastKind } from "./toast";

const ICONS: Record<ToastKind, React.ReactNode> = {
  success: <CheckCircle2 className="size-5" />,
  error: <XCircle className="size-5" />,
  info: <Info className="size-5" />,
  warning: <TriangleAlert className="size-5" />,
};

const ALERT_CLASS: Record<ToastKind, string> = {
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

export default function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="toast toast-end z-50">
      {toasts.map((t) => (
        <div key={t.id} role="alert" className={`alert ${ALERT_CLASS[t.kind]}`}>
          {ICONS[t.kind]}
          <span>{t.message}</span>
          <button
            type="button"
            aria-label="Dismiss"
            className="btn btn-ghost btn-xs btn-circle"
            onClick={() => dismiss(t.id)}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
