import { useState, type SubmitEvent } from "react";
import { FormField } from "../../../components/ui/FormField";
import { inputClass } from "../../../components/ui/formStyles";
import { Modal } from "../../../components/ui/Modal";
import { QUESTION_SUBJECTS, getTopics, getUnits, subjectLabel, unitLabel } from "../catalog";
import {
  DIFFICULTY_OPTIONS,
  MAX_MARKS,
  STATUS_OPTIONS,
  TEXT_MAX,
  TYPE_OPTIONS,
  type Question,
  type QuestionInput,
} from "../types";
import {
  FIELD_ORDER,
  validateQuestion,
  type QuestionField,
  type QuestionFormErrors,
  type QuestionFormValues,
} from "../validation";

interface QuestionFormModalProps {
  /** Question being edited, or null when adding. */
  question: Question | null;
  onSave: (value: QuestionInput) => void;
  onClose: () => void;
}

const fieldId = (f: QuestionField) => `question-${f}`;

/** Props shared by every control: id, invalid state and error association. */
function controlProps(f: QuestionField, errors: QuestionFormErrors) {
  return {
    id: fieldId(f),
    "aria-invalid": errors[f] ? (true as const) : undefined,
    "aria-describedby": errors[f] ? `${fieldId(f)}-error` : undefined,
    className: inputClass(!!errors[f]),
  };
}

export function QuestionFormModal({ question, onSave, onClose }: QuestionFormModalProps) {
  const editing = question !== null;
  const [values, setValues] = useState<QuestionFormValues>({
    text: question?.text ?? "",
    subjectId: question?.subjectId ?? "",
    unitId: question?.unitId ?? "",
    topicId: question?.topicId ?? "",
    marks: question ? String(question.marks) : "",
    difficulty: question?.difficulty ?? "",
    type: question?.type ?? "",
    status: question?.status ?? "DRAFT",
  });
  const [errors, setErrors] = useState<QuestionFormErrors>({});

  /** Set one field; changing a parent resets (and un-errors) its dependent fields. */
  const set = (field: QuestionField, value: string) => {
    const reset: QuestionField[] =
      field === "subjectId" ? ["unitId", "topicId"] : field === "unitId" ? ["topicId"] : [];
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      for (const r of reset) next[r] = "";
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      for (const f of [field, ...reset]) delete next[f];
      return next;
    });
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateQuestion(values);
    if (!result.ok) {
      setErrors(result.errors);
      const first = FIELD_ORDER.find((f) => result.errors[f]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }
    onSave(result.value);
  };

  const units = values.subjectId ? getUnits(values.subjectId) : [];
  const topics = values.subjectId && values.unitId ? getTopics(values.subjectId, values.unitId) : [];

  return (
    <Modal
      title={editing ? `Edit ${question.code}` : "Add question"}
      description={
        editing
          ? `Saving changes creates version ${question.version + 1} in the demo list only.`
          : "Add a question to the demo bank. Nothing is saved to a server."
      }
      onClose={onClose}
    >
      <form noValidate onSubmit={handleSubmit}>
        <div className="space-y-4 px-5 py-4">
          <FormField id={fieldId("text")} label="Question text" error={errors.text}>
            <textarea
              {...controlProps("text", errors)}
              rows={4}
              autoFocus
              value={values.text}
              onChange={(e) => set("text", e.target.value)}
              placeholder="Type the question as it would appear in the paper"
              className={`${inputClass(!!errors.text)} resize-y`}
            />
            <p className="mt-1 text-right text-xs text-slate-500">
              {values.text.trim().length}/{TEXT_MAX}
            </p>
          </FormField>

          <FormField id={fieldId("subjectId")} label="Subject" error={errors.subjectId}>
            <select
              {...controlProps("subjectId", errors)}
              value={values.subjectId}
              onChange={(e) => set("subjectId", e.target.value)}
            >
              <option value="">Select subject</option>
              {QUESTION_SUBJECTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {subjectLabel(s)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id={fieldId("unitId")} label="Unit" error={errors.unitId}>
            <select
              {...controlProps("unitId", errors)}
              value={values.unitId}
              disabled={values.subjectId === ""}
              onChange={(e) => set("unitId", e.target.value)}
            >
              <option value="">{values.subjectId === "" ? "Select a subject first" : "Select unit"}</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {unitLabel(u)}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id={fieldId("topicId")} label="Topic" error={errors.topicId}>
            <select
              {...controlProps("topicId", errors)}
              value={values.topicId}
              disabled={values.unitId === ""}
              onChange={(e) => set("topicId", e.target.value)}
            >
              <option value="">{values.unitId === "" ? "Select a unit first" : "Select topic"}</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id={fieldId("marks")} label="Marks" error={errors.marks}>
              <input
                {...controlProps("marks", errors)}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={values.marks}
                onChange={(e) => set("marks", e.target.value)}
                placeholder={`1-${MAX_MARKS}`}
              />
            </FormField>

            <FormField id={fieldId("difficulty")} label="Difficulty" error={errors.difficulty}>
              <select
                {...controlProps("difficulty", errors)}
                value={values.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
              >
                <option value="">Select difficulty</option>
                {DIFFICULTY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id={fieldId("type")} label="Question type" error={errors.type}>
              <select
                {...controlProps("type", errors)}
                value={values.type}
                onChange={(e) => set("type", e.target.value)}
              >
                <option value="">Select type</option>
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id={fieldId("status")} label="Status" error={errors.status}>
              <select
                {...controlProps("status", errors)}
                value={values.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </FormField>
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
            {editing ? "Save changes" : "Add question"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
