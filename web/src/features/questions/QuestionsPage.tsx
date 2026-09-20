import { useMemo, useRef, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { QuestionFilters } from "./components/QuestionFilters";
import { QuestionFormModal } from "./components/QuestionFormModal";
import { QuestionTable } from "./components/QuestionTable";
import { DEMO_QUESTIONS } from "./demoData";
import { differs, filterQuestions, hasActiveFilters, marksOptions } from "./operations";
import { DEFAULT_FILTERS, type Question, type QuestionFilterState, type QuestionInput } from "./types";

/** Which dialog is open, if any. The form carries null when adding. */
type Dialog =
  | { kind: "form"; question: Question | null }
  | { kind: "delete"; question: Question }
  | null;

const PREVIEW_LENGTH = 90;

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(DEMO_QUESTIONS);
  const [filters, setFilters] = useState<QuestionFilterState>(DEFAULT_FILTERS);
  const [dialog, setDialog] = useState<Dialog>(null);
  const nextNumber = useRef(DEMO_QUESTIONS.length + 1);

  const visible = useMemo(() => filterQuestions(questions, filters), [questions, filters]);
  const marks = useMemo(() => marksOptions(questions, filters.marks), [questions, filters.marks]);
  const filtersActive = hasActiveFilters(filters);

  const closeDialog = () => setDialog(null);
  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const handleSave = (value: QuestionInput) => {
    if (dialog?.kind !== "form") return;
    const existing = dialog.question;
    if (existing) {
      // Editing changes content, so it is a new version; a no-op save is not.
      if (differs(existing, value)) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === existing.id ? { ...q, ...value, version: q.version + 1 } : q)),
        );
      }
    } else {
      const n = nextNumber.current++;
      const created: Question = {
        id: `demo-q-${n}`,
        code: `DEMO-Q-${String(n).padStart(3, "0")}`,
        ...value,
        version: 1,
      };
      setQuestions((prev) => [...prev, created]);
    }
    closeDialog();
  };

  const handleDelete = () => {
    if (dialog?.kind !== "delete") return;
    const id = dialog.question.id;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    closeDialog();
  };

  const addButton = (
    <button
      type="button"
      onClick={() => setDialog({ kind: "form", question: null })}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <Icon name="plus" className="h-4 w-4" />
      Add Question
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Question Bank"
        description="Questions with subject, unit, topic, marks, difficulty, type and status. Each one is tied to the syllabus."
        actions={addButton}
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <Badge tone="demo">Demo</Badge>
        <p>
          Sample questions written for this prototype, not real examination content. Changes are
          kept in this browser tab and are lost on reload. No backend, database or AI is connected.
        </p>
      </div>

      <Card>
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <QuestionFilters
            filters={filters}
            marksOptions={marks}
            active={filtersActive}
            onChange={setFilters}
            onClear={clearFilters}
          />
          <p className="mt-4 text-xs text-slate-500" aria-live="polite">
            Showing {visible.length} of {questions.length} questions
          </p>
        </div>

        {visible.length > 0 ? (
          <QuestionTable
            questions={visible}
            onEdit={(question) => setDialog({ kind: "form", question })}
            onDelete={(question) => setDialog({ kind: "delete", question })}
          />
        ) : questions.length === 0 ? (
          <EmptyState
            title="No questions yet"
            description="Add the first question to start building the bank. Each question is linked to a subject, unit and topic."
            action={addButton}
          />
        ) : (
          <EmptyState
            title="No matching questions"
            description="No question matches the current search and filters."
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Clear filters
              </button>
            }
          />
        )}
      </Card>

      {dialog?.kind === "form" && (
        <QuestionFormModal question={dialog.question} onSave={handleSave} onClose={closeDialog} />
      )}

      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Delete question?"
          confirmLabel="Delete question"
          onConfirm={handleDelete}
          onCancel={closeDialog}
        >
          <p>
            <span className="font-mono text-xs font-semibold">{dialog.question.code}</span> will be
            removed from the demo bank:
          </p>
          <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-slate-600">
            {dialog.question.text.length > PREVIEW_LENGTH
              ? `${dialog.question.text.slice(0, PREVIEW_LENGTH)}…`
              : dialog.question.text}
          </p>
          <p className="mt-2 text-slate-500">
            This is demo data held in memory; reloading the page restores the sample questions.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
