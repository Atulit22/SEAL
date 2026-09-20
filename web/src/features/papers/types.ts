import type { Difficulty, QuestionType } from "../questions/types";

/**
 * Only the first lifecycle stages exist in this prototype. Locking, encryption and
 * release are deliberately not represented.
 */
export type PaperStatus = "DRAFT" | "VALIDATED" | "TEACHER_REVIEW" | "APPROVED";

export const LIFECYCLE: { value: PaperStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "VALIDATED", label: "Validated" },
  { value: "TEACHER_REVIEW", label: "Teacher review" },
  { value: "APPROVED", label: "Approved" },
];

export const statusLabel = (s: PaperStatus) => LIFECYCLE.find((l) => l.value === s)?.label ?? s;

export type PaperStep = "setup" | "questions" | "preview";

/**
 * How a question entered the paper. Only manual selection exists today; a later
 * AI-assisted flow would add a candidate source here (e.g. "AI_SUGGESTED") that a
 * teacher must accept before it counts as selected.
 */
export type SelectionSource = "MANUAL";

export interface SelectionEntry {
  questionId: string;
  source: SelectionSource;
}

/** Paper setup as typed by the teacher: numeric fields stay strings until evaluated. */
export interface PaperConfigForm {
  subjectId: string;
  examName: string;
  totalMarks: string;
  questionCount: string;
  durationMinutes: string;
  /** Required number of questions per type. */
  typeCounts: Record<QuestionType, string>;
  /** Target share of total marks per difficulty, in percent. */
  difficultyPercent: Record<Difficulty, string>;
  /** Target marks per unit id; missing or blank means no target for that unit. */
  unitMarks: Record<string, string>;
  /** Topic ids that must have at least one selected question. */
  requiredTopicIds: string[];
}

export interface ConfigErrors {
  examName?: string;
  totalMarks?: string;
  questionCount?: string;
  durationMinutes?: string;
  types?: string;
  difficulty?: string;
  units?: string;
}

export interface ConstraintCheck {
  id: string;
  label: string;
  ok: boolean;
  /** What the configuration asks for, as short display text. */
  required: string;
  /** What the current selection provides. */
  actual: string;
  /** Why the check failed; empty when ok. */
  messages: string[];
}

export interface PaperEvaluation {
  configErrors: ConfigErrors;
  checks: ConstraintCheck[];
  failedCount: number;
  valid: boolean;
  selectedCount: number;
  selectedMarks: number;
  /** Parsed setup values; null where the typed value is invalid. */
  config: {
    examName: string;
    totalMarks: number | null;
    questionCount: number | null;
    durationMinutes: number | null;
  };
}
