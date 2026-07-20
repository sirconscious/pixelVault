"use client";

import { useRef, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "./toast";

type ActionResult = { ok: boolean; error?: string; message?: string };

type ConfirmButtonProps = {
  action: () => Promise<ActionResult>;
  confirmTitle: string;
  confirmMessage: string;
  confirmLabel?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * A button that opens a daisyUI confirmation dialog, then runs a server action.
 * Shows a success/error toast based on the result.
 */
export default function ConfirmButton({
  action,
  confirmTitle,
  confirmMessage,
  confirmLabel = "Delete",
  className = "btn btn-error btn-sm",
  children,
}: ConfirmButtonProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();
  const [, force] = useState(0);

  const open = () => ref.current?.showModal();
  const close = () => ref.current?.close();

  const run = () => {
    startTransition(async () => {
      const res = await action();
      if (res.ok) {
        toast.success(res.message ?? "Done");
        close();
      } else {
        toast.error(res.error ?? "Something went wrong");
        force((n) => n + 1);
      }
    });
  };

  return (
    <>
      <button type="button" className={className} onClick={open}>
        {children}
      </button>

      <dialog ref={ref} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{confirmTitle}</h3>
          <p className="py-3 opacity-80">{confirmMessage}</p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={close}
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={run}
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  );
}
