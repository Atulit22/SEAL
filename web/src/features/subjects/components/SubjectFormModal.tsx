import { useState, type SubmitEvent } from "react";
import { Icon } from "../../../components/ui/Icon";
import { Modal } from "../../../components/ui/Modal";
import { SEMESTERS, STATUS_OPTIONS, type Subject, type SubjectInput } from "../types";
import {
  validateSubject,
  type SubjectFormErrors,
  type SubjectFormValues,
} from "../validation";

interface SubjectFormModalProps {
  /** Subject being edited, or null when adding a new one. */
  subject: Subject | null;
  /** Current list, used for the duplicate-code check. */
  existing: Subject[];
  onSave: (value: SubjectInput) => void;
  onClose: () => void;
}

const INPUT_BASE =
  "block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2";
const INPUT_OK = "border-slate-300 focus:border-amber-500 focus:ring-amber-500/30";
const INPUT_ERR = "border-red-400 focus:border-red-500 focus:ring-red-500/30";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
      <Icon name="alert" className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function SubjectFormModal({ subject, existing, onSave, onClose }: SubjectFormModalProps) {
  const editing = subject !== null;
  const [values, setValues] = useState<SubjectFormValues>({
    code: subject?.code ?? "",
    name: subject?.name ?? "",
    semester: subject ? String(subject.semester) : "",
    status: subject?.status ?? "DRAFT",
  });
  const [errors, setErrors] = useState<SubjectFormErrors>({});

  const update = <K extends keyof SubjectFormValues>(key: K, value: SubjectFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key !== "status" && errors[key as keyof SubjectFormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateSubject(values, existing, subject?.id);
    if (!result.ok) {
      setErrors(result.errors);
      const firstInvalid = (["code", "name", "semester"] as const).find((k) => result.errors[k]);
      if (firstInvalid) document.getElementById(`subject-${firstInvalid}`)?.focus();
      return;
    }
    onSave(result.value);
  };

  return (
    <Modal
      title={editing ? "Edit subject" : "Add subject"}
      description={
        editing
          ? `Update details for ${subject.code}. Changes apply to the demo list only.`
          : "Add a subject to the demo list. Nothing is saved to a server."
      }
      onClose={onClose}
    >
      <form noValidate onSubmit={handleSubmit}>
        <div className="space-y-4 px-5 py-4">
          <div>
            <label htmlFor="subject-code" className="block text-sm font-medium text-slate-800">
              Subject code
            </label>
            <input
              id="subject-code"
              type="text"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              value={values.code}
              onChange={(e) => update("code", e.target.value)}
              aria-invalid={errors.code ? true : undefined}
              aria-describedby={errors.code ? "subject-code-error" : undefined}
              placeholder="e.g. DEMO-CS301"
              className={`mt-1.5 font-mono uppercase placeholder:normal-case ${INPUT_BASE} ${errors.code ? INPUT_ERR : INPUT_OK}`}
            />
            <FieldError id="subject-code-error" message={errors.code} />
          </div>

          <div>
            <label htmlFor="subject-name" className="block text-sm font-medium text-slate-800">
              Subject name
            </label>
            <input
              id="subject-name"
              type="text"
              autoComplete="off"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "subject-name-error" : undefined}
              placeholder="e.g. Data Structures"
              className={`mt-1.5 ${INPUT_BASE} ${errors.name ? INPUT_ERR : INPUT_OK}`}
            />
            <FieldError id="subject-name-error" message={errors.name} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="subject-semester" className="block text-sm font-medium text-slate-800">
                Semester
              </label>
              <select
                id="subject-semester"
                value={values.semester}
                onChange={(e) => update("semester", e.target.value)}
                aria-invalid={errors.semester ? true : undefined}
                aria-describedby={errors.semester ? "subject-semester-error" : undefined}
                className={`mt-1.5 ${INPUT_BASE} ${errors.semester ? INPUT_ERR : INPUT_OK}`}
              >
                <option value="">Select semester</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={String(s)}>
                    Semester {s}
                  </option>
                ))}
              </select>
              <FieldError id="subject-semester-error" message={errors.semester} />
            </div>

            <div>
              <label htmlFor="subject-status" className="block text-sm font-medium text-slate-800">
                Status
              </label>
              <select
                id="subject-status"
                value={values.status}
                onChange={(e) => update("status", e.target.value as SubjectFormValues["status"])}
                className={`mt-1.5 ${INPUT_BASE} ${INPUT_OK}`}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
            {editing ? "Save changes" : "Add subject"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
