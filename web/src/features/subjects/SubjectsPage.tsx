import { useMemo, useRef, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { SubjectFilters } from "./components/SubjectFilters";
import { SubjectFormModal } from "./components/SubjectFormModal";
import { SubjectTable } from "./components/SubjectTable";
import { DEMO_SUBJECTS } from "./demoData";
import {
  DEFAULT_FILTERS,
  type Subject,
  type SubjectFilterState,
  type SubjectInput,
} from "./types";

/** Which dialog is open: adding, editing a specific subject, or none. */
type FormTarget = { mode: "add" } | { mode: "edit"; subject: Subject } | null;

function matches(subject: Subject, filters: SubjectFilterState): boolean {
  if (filters.status !== "ALL" && subject.status !== filters.status) return false;
  if (filters.semester !== "ALL" && String(subject.semester) !== filters.semester) return false;
  const q = filters.query.trim().toLowerCase();
  if (q === "") return true;
  return subject.code.toLowerCase().includes(q) || subject.name.toLowerCase().includes(q);
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(DEMO_SUBJECTS);
  const [filters, setFilters] = useState<SubjectFilterState>(DEFAULT_FILTERS);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const nextId = useRef(DEMO_SUBJECTS.length + 1);

  const visible = useMemo(
    () => subjects.filter((s) => matches(s, filters)).sort((a, b) => a.code.localeCompare(b.code)),
    [subjects, filters],
  );

  const filtersActive =
    filters.query.trim() !== "" || filters.status !== "ALL" || filters.semester !== "ALL";

  const handleSave = (value: SubjectInput) => {
    if (formTarget?.mode === "edit") {
      const id = formTarget.subject.id;
      setSubjects((prev) => prev.map((s) => (s.id === id ? { id, ...value } : s)));
    } else {
      const id = `demo-${nextId.current++}`;
      setSubjects((prev) => [...prev, { id, ...value }]);
    }
    setFormTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    setDeleteTarget(null);
  };

  const addButton = (
    <button
      type="button"
      onClick={() => setFormTarget({ mode: "add" })}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <Icon name="plus" className="h-4 w-4" />
      Add Subject
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Subjects"
        description="Subjects offered for the examination session. Units, topics and questions are attached to these later."
        actions={addButton}
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <Badge tone="demo">Demo</Badge>
        <p>
          Sample subjects only, not real university records. Changes are kept in this browser tab
          and are lost on reload. No backend or database is connected.
        </p>
      </div>

      <Card>
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <SubjectFilters filters={filters} onChange={setFilters} />
          <p className="mt-3 text-xs text-slate-500" aria-live="polite">
            Showing {visible.length} of {subjects.length} subjects
          </p>
        </div>

        {visible.length > 0 ? (
          <SubjectTable
            subjects={visible}
            onEdit={(subject) => setFormTarget({ mode: "edit", subject })}
            onDelete={setDeleteTarget}
          />
        ) : subjects.length === 0 ? (
          <EmptyState
            title="No subjects yet"
            description="Add the first subject to start building the syllabus structure."
            action={addButton}
          />
        ) : (
          <EmptyState
            title="No matching subjects"
            description="No subject matches the current search or filters."
            action={
              filtersActive ? (
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  Clear filters
                </button>
              ) : undefined
            }
          />
        )}
      </Card>

      {formTarget && (
        <SubjectFormModal
          subject={formTarget.mode === "edit" ? formTarget.subject : null}
          existing={subjects}
          onSave={handleSave}
          onClose={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete subject?"
          confirmLabel="Delete subject"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        >
          <p>
            <span className="font-mono text-xs font-semibold">{deleteTarget.code}</span> ·{" "}
            <span className="font-medium">{deleteTarget.name}</span> will be removed from the demo
            list.
          </p>
          <p className="mt-2 text-slate-500">
            This is demo data held in memory; reloading the page restores the sample list.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
