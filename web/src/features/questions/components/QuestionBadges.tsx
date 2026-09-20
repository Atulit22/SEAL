import { Badge, type BadgeTone } from "../../../components/ui/Badge";
import {
  difficultyLabel,
  statusLabel,
  typeLabel,
  type Difficulty,
  type QuestionStatus,
  type QuestionType,
} from "../types";

const STATUS_TONES: Record<QuestionStatus, BadgeTone> = {
  DRAFT: "info",
  APPROVED: "success",
  ARCHIVED: "neutral",
};

export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  return <Badge tone={STATUS_TONES[status]}>{statusLabel(status)}</Badge>;
}

export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  return <Badge tone="neutral">{typeLabel(type)}</Badge>;
}

const DOT: Record<Difficulty, string> = {
  EASY: "bg-emerald-500",
  MEDIUM: "bg-amber-500",
  HARD: "bg-red-500",
};

/** Text plus a colour dot, so difficulty is never conveyed by colour alone. */
export function DifficultyLabel({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-slate-700">
      <span className={`h-2 w-2 rounded-full ${DOT[difficulty]}`} aria-hidden="true" />
      {difficultyLabel(difficulty)}
    </span>
  );
}
