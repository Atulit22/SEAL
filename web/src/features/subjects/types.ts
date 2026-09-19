export type SubjectStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number;
  status: SubjectStatus;
}

/** Editable fields of a subject (everything except the generated id). */
export type SubjectInput = Omit<Subject, "id">;

export interface SubjectFilterState {
  query: string;
  status: SubjectStatus | "ALL";
  semester: string; // "ALL" or a semester number as a string
}

export const DEFAULT_FILTERS: SubjectFilterState = { query: "", status: "ALL", semester: "ALL" };

export const SEMESTERS =[1, 2, 3, 4, 5, 6, 7, 8] as const;

export const STATUS_OPTIONS: { value: SubjectStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DRAFT", label: "Draft" },
  { value: "ARCHIVED", label: "Archived" },
];

export function statusLabel(status: SubjectStatus): string {
  return STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
}
