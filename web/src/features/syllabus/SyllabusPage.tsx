import { useMemo, useRef, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { DEMO_SUBJECTS } from "../subjects/demoData";
import { SyllabusToolbar } from "./components/SyllabusToolbar";
import { TopicFormModal } from "./components/TopicFormModal";
import { UnitCard } from "./components/UnitCard";
import { UnitFormModal } from "./components/UnitFormModal";
import { DEMO_SYLLABUS } from "./demoData";
import {
  addTopic,
  addUnit,
  deleteTopic,
  deleteUnit,
  filterUnits,
  updateTopic,
  updateUnit,
} from "./operations";
import type { SyllabusBySubject, Topic, Unit } from "./types";

/** Which dialog is open, if any. Unit/topic forms carry null when adding. */
type Dialog =
  | { kind: "unit-form"; unit: Unit | null }
  | { kind: "topic-form"; unitId: string; topic: Topic | null }
  | { kind: "unit-delete"; unit: Unit }
  | { kind: "topic-delete"; unitId: string; topic: Topic }
  | null;

const SUBJECT_OPTIONS = DEMO_SUBJECTS.map((s) => ({ id: s.id, label: `${s.code} · ${s.name}` }));
const NO_UNITS: Unit[] = [];

export default function SyllabusPage() {
  const [syllabus, setSyllabus] = useState<SyllabusBySubject>(DEMO_SYLLABUS);
  const [subjectId, setSubjectId] = useState(DEMO_SUBJECTS[0].id);
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [dialog, setDialog] = useState<Dialog>(null);
  const nextId = useRef(1);

  const subject = DEMO_SUBJECTS.find((s) => s.id === subjectId) ?? DEMO_SUBJECTS[0];
  const units = syllabus[subjectId] ?? NO_UNITS;
  const views = useMemo(() => filterUnits(units, query), [units, query]);

  const searching = query.trim() !== "";
  const topicTotal = units.reduce((n, u) => n + u.topics.length, 0);

  const newId = (prefix: string) => `new-${prefix}${nextId.current++}`;

  /** Apply a pure operation to the selected subject's units. */
  const mutate = (op: (current: Unit[]) => Unit[]) => {
    setSyllabus((prev) => ({ ...prev, [subjectId]: op(prev[subjectId] ?? NO_UNITS) }));
  };

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setAllOpen = (open: boolean) => {
    setCollapsed(open ? new Set() : new Set(units.map((u) => u.id)));
  };

  const closeDialog = () => setDialog(null);

  const saveUnit = (value: { number: number; title: string }) => {
    if (dialog?.kind !== "unit-form") return;
    if (dialog.unit) {
      const id = dialog.unit.id;
      mutate((cur) => updateUnit(cur, id, value));
    } else {
      const unit: Unit = { id: newId("u"), ...value, topics: [] };
      mutate((cur) => addUnit(cur, unit));
    }
    closeDialog();
  };

  const saveTopic = (title: string) => {
    if (dialog?.kind !== "topic-form") return;
    const { unitId, topic } = dialog;
    if (topic) {
      mutate((cur) => updateTopic(cur, unitId, topic.id, title));
    } else {
      mutate((cur) => addTopic(cur, unitId, { id: newId("t"), title }));
    }
    closeDialog();
  };

  const confirmDelete = () => {
    if (dialog?.kind === "unit-delete") {
      const id = dialog.unit.id;
      mutate((cur) => deleteUnit(cur, id));
    } else if (dialog?.kind === "topic-delete") {
      const { unitId, topic } = dialog;
      mutate((cur) => deleteTopic(cur, unitId, topic.id));
    }
    closeDialog();
  };

  const suggestedNumber = units.reduce((max, u) => Math.max(max, u.number), 0) + 1;
  const topicFormUnit =
    dialog?.kind === "topic-form" ? units.find((u) => u.id === dialog.unitId) : undefined;

  const openAddUnit = () => setDialog({ kind: "unit-form", unit: null });

  const addUnitButton = (
    <button
      type="button"
      onClick={openAddUnit}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
    >
      <Icon name="plus" className="h-4 w-4" />
      Add Unit
    </button>
  );

  const smallButton =
    "rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Syllabus"
        description="Units and topics for each subject. Questions are validated against this structure later."
        actions={addUnitButton}
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <Badge tone="demo">Demo</Badge>
        <p>
          Illustrative outlines only, not an official AKTU or university syllabus. Changes are kept
          in this browser tab and are lost on reload. No backend or database is connected.
        </p>
      </div>

      <Card>
        <div className="p-4 sm:p-5">
          <SyllabusToolbar
            subjects={SUBJECT_OPTIONS}
            subjectId={subjectId}
            onSubjectChange={setSubjectId}
            query={query}
            onQueryChange={setQuery}
          />
        </div>
        <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <p className="text-xs text-slate-500" aria-live="polite">
            <span className="font-semibold text-slate-700">{subject.name}</span> · Semester{" "}
            {subject.semester} · {units.length} {units.length === 1 ? "unit" : "units"},{" "}
            {topicTotal} {topicTotal === 1 ? "topic" : "topics"}
            {searching && ` · ${views.length} matching`}
          </p>
          {units.length > 0 && (
            <div className="flex gap-2">
              <button
                type="button"
                className={smallButton}
                disabled={searching}
                onClick={() => setAllOpen(true)}
              >
                Expand all
              </button>
              <button
                type="button"
                className={smallButton}
                disabled={searching}
                onClick={() => setAllOpen(false)}
              >
                Collapse all
              </button>
            </div>
          )}
        </div>
      </Card>

      {views.length > 0 ? (
        <div className="space-y-3">
          {views.map((view) => {
            const { unit } = view;
            return (
              <UnitCard
                key={unit.id}
                view={view}
                open={searching || !collapsed.has(unit.id)}
                searching={searching}
                onToggle={() => toggle(unit.id)}
                onEditUnit={() => setDialog({ kind: "unit-form", unit })}
                onDeleteUnit={() => setDialog({ kind: "unit-delete", unit })}
                onAddTopic={() => setDialog({ kind: "topic-form", unitId: unit.id, topic: null })}
                onEditTopic={(topic) => setDialog({ kind: "topic-form", unitId: unit.id, topic })}
                onDeleteTopic={(topic) =>
                  setDialog({ kind: "topic-delete", unitId: unit.id, topic })
                }
              />
            );
          })}
        </div>
      ) : (
        <Card>
          {units.length === 0 ? (
            <EmptyState
              title="No syllabus units yet"
              description={`${subject.code} has no units in the demo data. Add the first unit to start the outline.`}
              action={addUnitButton}
            />
          ) : (
            <EmptyState
              title="No matching units or topics"
              description={`Nothing in ${subject.code} matches "${query.trim()}".`}
              action={
                <button type="button" className={smallButton} onClick={() => setQuery("")}>
                  Clear search
                </button>
              }
            />
          )}
        </Card>
      )}

      {dialog?.kind === "unit-form" && (
        <UnitFormModal
          unit={dialog.unit}
          existing={units}
          suggestedNumber={suggestedNumber}
          onSave={saveUnit}
          onClose={closeDialog}
        />
      )}

      {dialog?.kind === "topic-form" && topicFormUnit && (
        <TopicFormModal
          unit={topicFormUnit}
          topic={dialog.topic}
          onSave={saveTopic}
          onClose={closeDialog}
        />
      )}

      {dialog?.kind === "unit-delete" && (
        <ConfirmDialog
          title="Delete unit?"
          confirmLabel="Delete unit"
          onConfirm={confirmDelete}
          onCancel={closeDialog}
        >
          <p>
            <span className="font-semibold">Unit {dialog.unit.number}</span> ·{" "}
            {dialog.unit.title} and its {dialog.unit.topics.length}{" "}
            {dialog.unit.topics.length === 1 ? "topic" : "topics"} will be removed from the demo
            syllabus.
          </p>
          <p className="mt-2 text-slate-500">
            This is demo data held in memory; reloading the page restores the sample outline.
          </p>
        </ConfirmDialog>
      )}

      {dialog?.kind === "topic-delete" && (
        <ConfirmDialog
          title="Delete topic?"
          confirmLabel="Delete topic"
          onConfirm={confirmDelete}
          onCancel={closeDialog}
        >
          <p>
            <span className="font-semibold">{dialog.topic.title}</span> will be removed from the
            demo syllabus.
          </p>
          <p className="mt-2 text-slate-500">
            This is demo data held in memory; reloading the page restores the sample outline.
          </p>
        </ConfirmDialog>
      )}
    </div>
  );
}
