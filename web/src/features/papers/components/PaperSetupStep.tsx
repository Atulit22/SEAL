import type { ReactNode } from "react";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { FormField } from "../../../components/ui/FormField";
import { Icon } from "../../../components/ui/Icon";
import { inputClass } from "../../../components/ui/formStyles";
import { QUESTION_SUBJECTS, getUnits, subjectLabel } from "../../questions/catalog";
import { DIFFICULTY_OPTIONS, TYPE_OPTIONS } from "../../questions/types";
import { DIFFICULTY_TOLERANCE, MAX_DURATION, MIN_DURATION } from "../evaluation";
import type { ConfigErrors, PaperConfigForm } from "../types";

interface PaperSetupStepProps {
  form: PaperConfigForm;
  errors: ConfigErrors;
  readOnly: boolean;
  onChange: (patch: Partial<PaperConfigForm>) => void;
  onSubjectChange: (subjectId: string) => void;
  onContinue: () => void;
}

/** Sum of typed numbers, ignoring anything that is not a whole number. */
const looseSum = (values: string[]) =>
  values.reduce((n, v) => n + (/^\d+$/.test(v.trim()) ? Number(v) : 0), 0);

function GroupMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-3 flex items-start gap-1.5 text-xs text-red-600">
      <Icon name="alert" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card title={title} description={description}>
      <div className="p-5">{children}</div>
    </Card>
  );
}

export function PaperSetupStep({
  form,
  errors,
  readOnly,
  onChange,
  onSubjectChange,
  onContinue,
}: PaperSetupStepProps) {
  const units = getUnits(form.subjectId);
  const typeSum = looseSum(Object.values(form.typeCounts));
  const difficultySum = looseSum(Object.values(form.difficultyPercent));
  const unitSum = looseSum(units.map((u) => form.unitMarks[u.id] ?? ""));

  const toggleTopic = (topicId: string, checked: boolean) => {
    const next = checked
      ? [...form.requiredTopicIds, topicId]
      : form.requiredTopicIds.filter((id) => id !== topicId);
    onChange({ requiredTopicIds: next });
  };

  return (
    <div className="space-y-5">
      {/* Disabled fieldset makes every control read-only while under review/approved. */}
      <fieldset disabled={readOnly} className="m-0 min-w-0 space-y-5 border-0 p-0">
        <legend className="sr-only">Paper setup</legend>

        <Section title="Exam details" description="Basic identity of the paper.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField id="paper-subject" label="Subject">
                <select
                  id="paper-subject"
                  value={form.subjectId}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  className={inputClass(false)}
                >
                  {QUESTION_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {subjectLabel(s)}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField id="paper-name" label="Exam / session name" error={errors.examName}>
                <input
                  id="paper-name"
                  type="text"
                  autoComplete="off"
                  value={form.examName}
                  onChange={(e) => onChange({ examName: e.target.value })}
                  aria-invalid={errors.examName ? true : undefined}
                  aria-describedby={errors.examName ? "paper-name-error" : undefined}
                  className={inputClass(!!errors.examName)}
                />
              </FormField>
            </div>

            <FormField id="paper-total" label="Total marks" error={errors.totalMarks}>
              <input
                id="paper-total"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={form.totalMarks}
                onChange={(e) => onChange({ totalMarks: e.target.value })}
                aria-invalid={errors.totalMarks ? true : undefined}
                aria-describedby={errors.totalMarks ? "paper-total-error" : undefined}
                className={inputClass(!!errors.totalMarks)}
              />
            </FormField>

            <FormField id="paper-count" label="Number of questions" error={errors.questionCount}>
              <input
                id="paper-count"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={form.questionCount}
                onChange={(e) => onChange({ questionCount: e.target.value })}
                aria-invalid={errors.questionCount ? true : undefined}
                aria-describedby={errors.questionCount ? "paper-count-error" : undefined}
                className={inputClass(!!errors.questionCount)}
              />
            </FormField>

            <FormField id="paper-duration" label="Duration (minutes)" error={errors.durationMinutes}>
              <input
                id="paper-duration"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={form.durationMinutes}
                onChange={(e) => onChange({ durationMinutes: e.target.value })}
                aria-invalid={errors.durationMinutes ? true : undefined}
                aria-describedby={errors.durationMinutes ? "paper-duration-error" : undefined}
                placeholder={`${MIN_DURATION}-${MAX_DURATION}`}
                className={inputClass(!!errors.durationMinutes)}
              />
            </FormField>
          </div>
        </Section>

        <Section
          title="Question-type distribution"
          description="How many questions of each type the paper must contain."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TYPE_OPTIONS.map((o) => (
              <FormField key={o.value} id={`paper-type-${o.value}`} label={o.label}>
                <input
                  id={`paper-type-${o.value}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={form.typeCounts[o.value]}
                  onChange={(e) =>
                    onChange({ typeCounts: { ...form.typeCounts, [o.value]: e.target.value } })
                  }
                  aria-invalid={errors.types ? true : undefined}
                  aria-describedby={errors.types ? "paper-types-error" : undefined}
                  className={inputClass(!!errors.types)}
                />
              </FormField>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Counts add up to <span className="font-semibold tabular-nums">{typeSum}</span>; they must
            equal the question count.
          </p>
          <GroupMessage id="paper-types-error" message={errors.types} />
        </Section>

        <Section
          title="Difficulty distribution"
          description={`Share of total marks. The selection may differ by up to ${DIFFICULTY_TOLERANCE} percentage points.`}
        >
          <div className="grid grid-cols-3 gap-4">
            {DIFFICULTY_OPTIONS.map((o) => (
              <FormField key={o.value} id={`paper-difficulty-${o.value}`} label={`${o.label} (%)`}>
                <input
                  id={`paper-difficulty-${o.value}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={form.difficultyPercent[o.value]}
                  onChange={(e) =>
                    onChange({
                      difficultyPercent: { ...form.difficultyPercent, [o.value]: e.target.value },
                    })
                  }
                  aria-invalid={errors.difficulty ? true : undefined}
                  aria-describedby={errors.difficulty ? "paper-difficulty-error" : undefined}
                  className={inputClass(!!errors.difficulty)}
                />
              </FormField>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Shares add up to <span className="font-semibold tabular-nums">{difficultySum}%</span>; they
            must total 100%.
          </p>
          <GroupMessage id="paper-difficulty-error" message={errors.difficulty} />
        </Section>

        <Section
          title="Unit and topic coverage"
          description="Optional. Set exact marks for a unit, and mark topics that must appear."
        >
          <div className="space-y-3">
            {units.map((unit) => {
              const requiredHere = unit.topics.filter((t) => form.requiredTopicIds.includes(t.id)).length;
              return (
                <div key={unit.id} className="rounded-md border border-slate-200 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
                        Unit {unit.number}
                      </p>
                      <p className="font-medium text-slate-900">{unit.title}</p>
                    </div>
                    <div className="w-full sm:w-44">
                      <FormField id={`paper-unit-${unit.id}`} label={`Unit ${unit.number} marks`}>
                        <input
                          id={`paper-unit-${unit.id}`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          value={form.unitMarks[unit.id] ?? ""}
                          onChange={(e) =>
                            onChange({ unitMarks: { ...form.unitMarks, [unit.id]: e.target.value } })
                          }
                          aria-invalid={errors.units ? true : undefined}
                          aria-describedby={errors.units ? "paper-units-error" : undefined}
                          placeholder="No target"
                          className={inputClass(!!errors.units)}
                        />
                      </FormField>
                    </div>
                  </div>

                  <details className="mt-3">
                    <summary className="cursor-pointer rounded text-sm font-medium text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
                      Required topics ({requiredHere} of {unit.topics.length})
                    </summary>
                    <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                      {unit.topics.map((topic) => (
                        <li key={topic.id}>
                          <label className="flex items-start gap-2 rounded px-1 py-1 text-sm text-slate-700 hover:bg-slate-50">
                            <input
                              type="checkbox"
                              checked={form.requiredTopicIds.includes(topic.id)}
                              onChange={(e) => toggleTopic(topic.id, e.target.checked)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-amber-600"
                            />
                            {topic.title}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Unit targets add up to <span className="font-semibold tabular-nums">{unitSum}</span> marks.
            Units left blank are unconstrained.
          </p>
          <GroupMessage id="paper-units-error" message={errors.units} />
        </Section>
      </fieldset>

      <div className="flex justify-end">
        <Button variant="primary" onClick={onContinue}>
          Continue to question selection
          <Icon name="arrow" className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
