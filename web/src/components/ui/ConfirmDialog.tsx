import type { ReactNode } from "react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  /** "danger" (default) for destructive actions, "neutral" for other confirmations. */
  tone?: "danger" | "neutral";
  onConfirm: () => void;
  onCancel: () => void;
}

/** Action confirmation. Focus starts on Cancel so Enter is the safe choice. */
export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  tone = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="px-5 py-4 text-sm text-slate-700">{children}</div>
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-md px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            tone === "danger"
              ? "bg-red-700 hover:bg-red-800 focus-visible:ring-red-500"
              : "bg-slate-900 hover:bg-slate-800 focus-visible:ring-amber-500"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
