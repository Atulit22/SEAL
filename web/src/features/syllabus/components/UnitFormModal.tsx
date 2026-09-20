import { useState, type SubmitEvent } from "react";
import { FormField } from "../../../components/ui/FormField";
import { inputClass } from "../../../components/ui/formStyles";
import { Modal } from "../../../components/ui/Modal";
import { validateUnit, type UnitFormErrors } from "../validation";
import type { Unit } from "../types";

interface UnitFormModalProps {
  /** Unit being edited, or null when adding. */
  unit: Unit | null;
  /** Units of the selected subject, for the duplicate-number check. */
  existing: Unit[];
  /** Pre-filled number when adding. */
  suggestedNumber: number;
  onSave: (value: { number: number; title: string }) => void;
  onClose: () => void;
}

export function UnitFormModal({
  unit,
  existing,
  suggestedNumber,
  onSave,
  onClose,
}: UnitFormModalProps) {
  const editing = unit !== null;
  const [number, setNumber] = useState(String(unit?.number ?? suggestedNumber));
  const [title, setTitle] = useState(unit?.title ?? "");
  const [errors, setErrors] = useState<UnitFormErrors>({});

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateUnit({ number, title }, existing, unit?.id);
    if (!result.ok) {
      setErrors(result.errors);
      const first = result.errors.number ? "unit-number" : "unit-title";
      document.getElementById(first)?.focus();
      return;
    }
    onSave(result.value);
  };

  return (
    <Modal
      title={editing ? "Edit unit" : "Add unit"}
      description="Changes apply to the demo syllabus only and are not saved."
      onClose={onClose}
    >
      <form noValidate onSubmit={handleSubmit}>
        <div className="space-y-4 px-5 py-4">
          <FormField id="unit-number" label="Unit number" error={errors.number}>
            <input
              id="unit-number"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                if (errors.number) setErrors((p) => ({ ...p, number: undefined }));
              }}
              aria-invalid={errors.number ? true : undefined}
              aria-describedby={errors.number ? "unit-number-error" : undefined}
              className={inputClass(!!errors.number)}
            />
          </FormField>

          <FormField id="unit-title" label="Unit title" error={errors.title}>
            <input
              id="unit-title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
              }}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={errors.title ? "unit-title-error" : undefined}
              placeholder="e.g. Stacks and Queues"
              className={inputClass(!!errors.title)}
            />
          </FormField>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {editing ? "Save changes" : "Add unit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
