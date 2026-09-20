import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Icon } from "../../../components/ui/Icon";
import { describeLocation, getSubject } from "../../questions/catalog";
import type { Question } from "../../questions/types";
import { buildPaperStructure } from "../structure";
import { statusLabel, type PaperEvaluation, type PaperStatus } from "../types";

interface PaperPreviewStepProps {
  subjectId: string;
  evaluation: PaperEvaluation;
  /** Questions on the paper, in selection order. */
  selected: Question[];
  status: PaperStatus;
  version: number;
  canReplace: boolean;
  onBack: () => void;
  onGoToQuestions: () => void;
  onReplace: () => void;
}

export function PaperPreviewStep({
  subjectId,
  evaluation,
  selected,
  status,
  version,
  canReplace,
  onBack,
  onGoToQuestions,
  onReplace,
}: PaperPreviewStepProps) {
  const [showTags, setShowTags] = useState(true);
  const subject = getSubject(subjectId);
  const { config, valid, failedCount, selectedMarks } = evaluation;
  const sections = buildPaperStructure(selected);
  const marksDiffer = config.totalMarks !== null && config.totalMarks !== selectedMarks;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button onClick={onBack}>
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Back to configuration
        </Button>
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={showTags}
              onChange={(e) => setShowTags(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 accent-amber-600"
            />
            Show syllabus tags
          </label>
          <Button onClick={onReplace} disabled={!canReplace}>
            Regenerate / replace selection
          </Button>
        </div>
      </div>

      {!valid && (
        <div
          role="note"
          className="flex items-start gap-2 rounded-md border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900"
        >
          <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            This configuration needs attention ({failedCount}{" "}
            {failedCount === 1 ? "check" : "checks"} failing). The preview shows the current
            selection as it stands and cannot be validated until the summary is clear.
          </p>
        </div>
      )}

      {selected.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          <EmptyState
            title="Nothing to preview yet"
            description="Select questions first, and the paper layout will appear here."
            action={<Button onClick={onGoToQuestions}>Go to question selection</Button>}
          />
        </div>
      ) : (
        <article
          aria-label="Paper preview"
          className="overflow-hidden rounded-lg border border-slate-300 bg-white shadow-sm"
        >
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
            Demo / preview · not an examination paper
          </div>

          <div className="px-5 py-8 sm:px-10">
            <header className="border-b border-slate-300 pb-5 text-center">
              <p className="text-sm text-slate-500">[Institution / college name placeholder]</p>
              <h2 className="mt-2 font-serif text-xl font-semibold text-slate-900 sm:text-2xl">
                {config.examName || "[Exam / session name]"}
              </h2>
              <p className="mt-1 text-base text-slate-800">
                {subject ? `${subject.name} (${subject.code})` : "[Subject]"}
              </p>
              <dl className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm text-slate-700">
                <div className="flex gap-1.5">
                  <dt className="font-medium">Time:</dt>
                  <dd>{config.durationMinutes ? `${config.durationMinutes} minutes` : "[Duration]"}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt className="font-medium">Maximum marks:</dt>
                  <dd>{config.totalMarks ?? "[Marks]"}</dd>
                </div>
                {subject && (
                  <div className="flex gap-1.5">
                    <dt className="font-medium">Semester:</dt>
                    <dd>{subject.semester}</dd>
                  </div>
                )}
              </dl>
            </header>

            <section aria-label="Instructions" className="mt-5 text-sm text-slate-700">
              <h3 className="font-semibold text-slate-900">Instructions</h3>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-slate-500">
                <li>[Instruction placeholder]</li>
                <li>[Instruction placeholder]</li>
              </ol>
            </section>

            {marksDiffer && (
              <p className="mt-4 rounded bg-orange-50 px-3 py-2 text-xs text-orange-800">
                The questions below add up to {selectedMarks} marks, but the paper is set to{" "}
                {config.totalMarks}.
              </p>
            )}

            <div className="mt-6 space-y-7">
              {sections.map((section) => (
                <section key={section.key} aria-label={`${section.name}: ${section.title}`}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 pb-1.5">
                    <h3 className="font-serif text-base font-semibold text-slate-900">
                      {section.name}
                      <span className="font-sans text-sm font-normal text-slate-600">
                        {" "}
                        · {section.title}
                      </span>
                    </h3>
                    <p className="shrink-0 text-xs text-slate-500">
                      {section.marks} {section.marks === 1 ? "mark" : "marks"}
                    </p>
                  </div>

                  <ol className="mt-3 space-y-4">
                    {section.questions.map(({ number, question }) => {
                      const loc = describeLocation(question);
                      return (
                        <li key={question.id} className="flex gap-3">
                          <span className="w-9 shrink-0 text-sm font-semibold text-slate-900">
                            Q{number}.
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed text-slate-900">{question.text}</p>
                            {showTags && (
                              <p className="mt-1 text-[11px] text-slate-400">
                                {question.code} · {loc.unit} · {loc.topic}
                              </p>
                            )}
                          </div>
                          <span className="shrink-0 text-sm tabular-nums text-slate-700">
                            [{question.marks}]
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>

            <footer className="mt-8 border-t border-slate-300 pt-3 text-[11px] text-slate-500">
              <p>
                College: [placeholder] · Session: [placeholder] · Paper ID: DEMO-PAPER-0001 · Version{" "}
                {String(version).padStart(2, "0")} · Status: {statusLabel(status)}
              </p>
              <p className="mt-0.5">
                Identifiers are placeholders. No watermarking or security marking is applied in this
                prototype.
              </p>
            </footer>
          </div>
        </article>
      )}
    </div>
  );
}
