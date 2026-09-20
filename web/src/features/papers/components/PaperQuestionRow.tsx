import type { ReactNode } from "react";
import { describeLocation } from "../../questions/catalog";
import { DifficultyLabel, QuestionTypeBadge } from "../../questions/components/QuestionBadges";
import type { Question } from "../../questions/types";

interface PaperQuestionRowProps {
  question: Question;
  /** Small element before the text, e.g. a position number. */
  leading?: ReactNode;
  /** Extra chips after the standard metadata, e.g. the selection source. */
  extra?: ReactNode;
  /** Row action, e.g. an Add or Remove button. */
  action: ReactNode;
}

/** One question with its exam metadata; shared by the selected list and the pool. */
export function PaperQuestionRow({ question, leading, extra, action }: PaperQuestionRowProps) {
  const loc = describeLocation(question);
  return (
    <li className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between sm:px-5">
      <div className="flex min-w-0 gap-3">
        {leading}
        <div className="min-w-0">
          <p className="font-mono text-xs font-medium text-slate-500">{question.code}</p>
          <p className="mt-0.5 text-sm text-slate-900">{question.text}</p>
          <p className="mt-1 text-xs text-slate-500">
            {loc.subjectCode} · {loc.unit} · {loc.topic}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="text-sm font-medium tabular-nums text-slate-700">
              {question.marks} {question.marks === 1 ? "mark" : "marks"}
            </span>
            <DifficultyLabel difficulty={question.difficulty} />
            <QuestionTypeBadge type={question.type} />
            {extra}
          </div>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </li>
  );
}
