import { SEMESTERS, type Subject, type SubjectInput, type SubjectStatus } from "./types";

/** Raw form state: every field is a string until validated. */
export interface SubjectFormValues {
  code: string;
  name: string;
  semester: string;
  status: SubjectStatus;
}

export type SubjectFormErrors = Partial<Record<"code" | "name" | "semester", string>>;

export type SubjectValidation =
  | { ok: true; value: SubjectInput }
  | { ok: false; errors: SubjectFormErrors };

const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,19}$/;
const NAME_MAX = 100;

/**
 * Deterministic subject validation. `existing` is the current list, used to reject
 * duplicate codes; `editingId` excludes the subject being edited from that check.
 */
export function validateSubject(
  values: SubjectFormValues,
  existing: Subject[],
  editingId?: string,
): SubjectValidation {
  const errors: SubjectFormErrors = {};

  const code = values.code.trim().toUpperCase();
  if (code === "") {
    errors.code = "Enter a subject code.";
  } else if (!CODE_PATTERN.test(code)) {
    errors.code = "Use 2-20 letters, numbers or hyphens, e.g. DEMO-CS301.";
  } else if (existing.some((s) => s.id !== editingId && s.code === code)) {
    errors.code = "This subject code already exists.";
  }

  const name = values.name.trim().replace(/\s+/g, " ");
  if (name === "") {
    errors.name = "Enter a subject name.";
  } else if (name.length > NAME_MAX) {
    errors.name = `Keep the name to ${NAME_MAX} characters or fewer.`;
  }

  const semester = Number(values.semester);
  if (values.semester === "") {
    errors.semester = "Select a semester.";
  } else if (!(SEMESTERS as readonly number[]).includes(semester)) {
    errors.semester = "Select a semester from 1 to 8.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { code, name, semester, status: values.status } };
}
