import { useMemo, useState } from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Icon } from "../../../components/ui/Icon";
import { inputClass } from "../../../components/ui/formStyles";
import { getUnits, unitLabel } from "../../questions/catalog";
import { TYPE_OPTIONS, type Question } from "../../questions/types";
import type { PaperEvaluation, SelectionEntry } from "../types";
import { PaperQuestionRow } from "./PaperQuestionRow";

interface PaperQuestionsStepProps {
  subjectId: string;
  /** Questions currently on the paper, in selection order. */
  selected: { entry: SelectionEntry; question: Question }[];
  /** Eligible candidates for the subject (Approved only). */
  pool: Question[];
  /** Subject questions left out because they are Draft or Archived. */
  hiddenCount: number;
  evaluation: PaperEvaluation;
  readOnly: boolean;
  onAdd: (questionId: string) => void;
  onRemove: (questionId: string) => void;
  onClear: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export function PaperQuestionsStep({
  subjectId,
  selected,
  pool,
  hiddenCount,
  evaluation,
  readOnly,
  onAdd,
  onRemove,
  onClear,
  onBack,
  onContinue,
}: PaperQuestionsStepProps) {
  const [query, setQuery] = useState("");
  const [unitId, setUnitId] = useState("ALL");
  const [type, setType] = useState("ALL");

  const selectedIds = useMemo(() => new Set(selected.map((s) => s.entry.questionId)), [selected]);
  const units = getUnits(subjectId);

  const candidates = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return pool.filter(
      (q) =>
        !selectedIds.has(q.id) &&
        (unitId === "ALL" || q.unitId === unitId) &&
        (type === "ALL" || q.type === type) &&
        (needle === "" || q.text.toLowerCase().includes(needle) || q.code.toLowerCase().includes(needle)),
    );
  }, [pool, selectedIds, query, unitId, type]);

  const { selectedCount, selectedMarks, config } = evaluation;
  const countOk = selectedCount === config.questionCount;
  const marksOk = selectedMarks === config.totalMarks;

  return (
    <div className="space-y-5">
      <Card
        title="Selected questions"
        description="The questions that will appear on the paper."
        action={
          <Button size="sm" onClick={onClear} disabled={readOnly || selected.length === 0}>
            Clear all
          </Button>
        }
      >
        <div className="flex flex-wrap gap-x-6 gap-y-1 border-b border-slate-100 px-5 py-3 text-sm">
          <p className={countOk ? "text-emerald-700" : "text-orange-700"}>
            <span className="font-semibold tabular-nums">{selectedCount}</span> of{" "}
            {config.questionCount ?? "?"} questions
          </p>
          <p className={marksOk ? "text-emerald-700" : "text-orange-700"}>
            <span className="font-semibold tabular-nums">{selectedMarks}</span> of{" "}
            {config.totalMarks ?? "?"} marks
          </p>
        </div>

        {selected.length > 0 ? (
          <ol className="divide-y divide-slate-100">
            {selected.map(({ entry, question }, i) => (
              <PaperQuestionRow
                key={entry.questionId}
                question={question}
                leading={
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-amber-300"
                  >
                    {i + 1}
                  </span>
                }
                extra={<Badge tone="neutral">Manual</Badge>}
                action={
                  <Button
                    size="sm"
                    disabled={readOnly}
                    onClick={() => onRemove(question.id)}
                    aria-label={`Remove ${question.code} from the paper`}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                    Remove
                  </Button>
                }
              />
            ))}
          </ol>
        ) : (
          <EmptyState
            title="No questions selected"
            description="Add questions from the list below. The constraint summary shows what the paper still needs."
          />
        )}
      </Card>

      {/*
        Candidate source. Today this is a manual pick from the Approved question bank.
        An AI-assisted flow would supply extra candidates here, to be accepted by the
        teacher into the selected list above, without changing the rest of the page.
      */}
      <Card
        title="Available questions"
        description="Approved questions for this subject. Selection is manual."
        action={<Badge tone="neutral">Manual source</Badge>}
      >
        <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-3 sm:p-5">
          <div className="relative sm:col-span-3 lg:col-span-1">
            <label htmlFor="pool-search" className="sr-only">
              Search available questions
            </label>
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="pool-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search text or code"
              autoComplete="off"
              className={`${inputClass(false)} py-2 pl-9`}
            />
          </div>
          <div>
            <label htmlFor="pool-unit" className="sr-only">
              Filter by unit
            </label>
            <select
              id="pool-unit"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className={`${inputClass(false)} py-2`}
            >
              <option value="ALL">All units</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {unitLabel(u)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="pool-type" className="sr-only">
              Filter by question type
            </label>
            <select
              id="pool-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${inputClass(false)} py-2`}
            >
              <option value="ALL">All types</option>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hiddenCount > 0 && (
          <p className="border-b border-slate-100 bg-slate-50 px-5 py-2 text-xs text-slate-500">
            {hiddenCount} {hiddenCount === 1 ? "question" : "questions"} for this subject{" "}
            {hiddenCount === 1 ? "is" : "are"} hidden because {hiddenCount === 1 ? "it is" : "they are"}{" "}
            Draft or Archived. Only Approved questions can be placed on a paper.
          </p>
        )}

        {candidates.length > 0 ? (
          <ul className="divide-y divide-slate-100">
            {candidates.map((q) => (
              <PaperQuestionRow
                key={q.id}
                question={q}
                action={
                  <Button
                    size="sm"
                    disabled={readOnly}
                    onClick={() => onAdd(q.id)}
                    aria-label={`Add ${q.code} to the paper`}
                  >
                    <Icon name="plus" className="h-4 w-4" />
                    Add
                  </Button>
                }
              />
            ))}
          </ul>
        ) : (
          <EmptyState
            title={pool.length === 0 ? "No approved questions for this subject" : "No questions to show"}
            description={
              pool.length === 0
                ? "This subject has no Approved questions in the demo bank yet."
                : selectedIds.size === pool.length
                  ? "Every available question is already on the paper."
                  : "No available question matches the current search and filters."
            }
          />
        )}
      </Card>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        <Button onClick={onBack}>Back to setup</Button>
        <Button variant="primary" onClick={onContinue}>
          Continue to preview
          <Icon name="arrow" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
