export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER" | "NUMERICAL";
export type QuestionStatus = "DRAFT" | "APPROVED" | "ARCHIVED";

/**
 * Question-bank record. Subject, unit and topic are stored as ids that point into the
 * Subjects and Syllabus demo data, never as free text. `version` increases whenever an
 * existing question is edited.
 */
export interface Question {
  id: string;
  code: string;
  text: string;
  subjectId: string;
  unitId: string;
  topicId: string;
  marks: number;
  difficulty: Difficulty;
  type: QuestionType;
  status: QuestionStatus;
  version: number;
}

/** Editable fields of a question (id, code and version are system-managed). */
export type QuestionInput = Omit<Question, "id" | "code" | "version">;

export const MAX_MARKS = 20;
export const TEXT_MIN = 10;
export const TEXT_MAX = 1000;

export const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
];

export const TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: "MCQ", label: "MCQ" },
  { value: "SHORT_ANSWER", label: "Short Answer" },
  { value: "LONG_ANSWER", label: "Long Answer" },
  { value: "NUMERICAL", label: "Numerical" },
];

export const STATUS_OPTIONS: { value: QuestionStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "APPROVED", label: "Approved" },
  { value: "ARCHIVED", label: "Archived" },
];

export const difficultyLabel = (v: Difficulty) =>
  DIFFICULTY_OPTIONS.find((o) => o.value === v)?.label ?? v;
export const typeLabel = (v: QuestionType) => TYPE_OPTIONS.find((o) => o.value === v)?.label ?? v;
export const statusLabel = (v: QuestionStatus) =>
  STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v;

export interface QuestionFilterState {
  query: string;
  subjectId: string; // "ALL" or a subject id
  unitId: string; // "ALL" or a unit id (only meaningful with a subject)
  topicId: string; // "ALL" or a topic id (only meaningful with a unit)
  difficulty: Difficulty | "ALL";
  marks: string; // "ALL" or a marks value as a string
  type: QuestionType | "ALL";
  status: QuestionStatus | "ALL";
}

export const DEFAULT_FILTERS: QuestionFilterState = {
  query: "",
  subjectId: "ALL",
  unitId: "ALL",
  topicId: "ALL",
  difficulty: "ALL",
  marks: "ALL",
  type: "ALL",
  status: "ALL",
};
