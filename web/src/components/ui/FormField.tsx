import type { ReactNode } from "react";
import { Icon } from "./Icon";

interface FormFieldProps {
  /** id of the control inside; the error message gets the id `${id}-error`. */
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

/** Label + control + inline error. The control sets its own aria-describedby. */
export function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
