import { useMemo, useRef, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Modal } from "../../components/ui/Modal";
import { PageHeader } from "../../components/ui/PageHeader";
import { QUESTION_SUBJECTS, getSubject } from "../questions/catalog";
import { BANK_BY_ID, eligibleQuestions, ineligibleCount } from "./bank";
import { ConstraintSummary } from "./components/ConstraintSummary";
import { PaperActionBar } from "./components/PaperActionBar";
import { PaperPreviewStep } from "./components/PaperPreviewStep";
import { PaperQuestionsStep } from "./components/PaperQuestionsStep";
import { PaperSetupStep } from "./components/PaperSetupStep";
import { PaperStatusTracker } from "./components/PaperStatusTracker";
import { PaperStepper } from "./components/PaperStepper";
import { defaultConfigForm } from "./defaults";
import { evaluatePaper } from "./evaluation";
import type { PaperConfigForm, PaperStatus, PaperStep, SelectionEntry } from "./types";

type Dialog = "approve" | "clear" | "replace" | null;

interface Notice {
  tone: "success" | "error" | "info";
  text: string;
}

const NOTICE_STYLES: Record<Notice["tone"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

export default function PapersPage() {
  const [form, setForm] = useState<PaperConfigForm>(() => defaultConfigForm(QUESTION_SUBJECTS[0].id));
  const [selection, setSelection] = useState<SelectionEntry[]>([]);
  const [status, setStatus] = useState<PaperStatus>("DRAFT");
  const [version, setVersion] = useState(1);
  const [step, setStep] = useState<PaperStep>("setup");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [pendingSubject, setPendingSubject] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Content is editable only before review; review and approval make it read-only.
  const readOnly = status === "TEACHER_REVIEW" || status === "APPROVED";

  const selectedItems = useMemo(
    () =>
      selection.flatMap((entry) => {
        const question = BANK_BY_ID.get(entry.questionId);
        return question ? [{ entry, question }] : [];
      }),
    [selection],
  );
  const selectedQuestions = useMemo(() => selectedItems.map((i) => i.question), [selectedItems]);
  const pool = useMemo(() => eligibleQuestions(form.subjectId), [form.subjectId]);
  const evaluation = useMemo(
    () => evaluatePaper(form, selectedQuestions, pool),
    [form, selectedQuestions, pool],
  );

  /** Any content edit invalidates an earlier validation. */
  const touch = () => {
    if (status === "VALIDATED") setStatus("DRAFT");
    setNotice(null);
  };

  const updateForm = (patch: Partial<PaperConfigForm>) => {
    if (readOnly) return;
    setForm((prev) => ({ ...prev, ...patch }));
    touch();
  };

  const applySubject = (subjectId: string) => {
    setForm((prev) => ({ ...prev, subjectId, unitMarks: {}, requiredTopicIds: [] }));
    setSelection([]);
    touch();
  };

  const requestSubjectChange = (subjectId: string) => {
    if (readOnly || subjectId === form.subjectId) return;
    if (selection.length > 0) setPendingSubject(subjectId);
    else applySubject(subjectId);
  };

  const addQuestion = (questionId: string) => {
    if (readOnly || selection.some((s) => s.questionId === questionId)) return;
    setSelection((prev) => [...prev, { questionId, source: "MANUAL" }]);
    touch();
  };

  const removeQuestion = (questionId: string) => {
    if (readOnly) return;
    setSelection((prev) => prev.filter((s) => s.questionId !== questionId));
    touch();
  };

  const clearSelection = () => {
    if (readOnly) return;
    setSelection([]);
    touch();
    setDialog(null);
  };

  const saveDraft = () => {
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setNotice({
      tone: "info",
      text: "Draft saved in this browser tab only. Nothing is persisted, and a reload discards it.",
    });
  };

  const showAttention = () => {
    const n = evaluation.failedCount;
    setNotice({
      tone: "error",
      text: `Cannot continue: ${n} ${n === 1 ? "constraint needs" : "constraints need"} attention. See the constraint summary.`,
    });
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const validate = () => {
    if (!evaluation.valid) return showAttention();
    setStatus("VALIDATED");
    setNotice({
      tone: "success",
      text: "All configured constraints are satisfied. Status set to Validated (demo).",
    });
  };

  const sendToReview = () => {
    if (!evaluation.valid) return showAttention();
    setStatus("TEACHER_REVIEW");
    setNotice({ tone: "info", text: "Paper sent to teacher review (demo). Content is now read-only." });
  };

  const approve = () => {
    setDialog(null);
    if (!evaluation.valid) return showAttention();
    setStatus("APPROVED");
    setNotice({ tone: "success", text: "Paper approved (demo). This only changes local state." });
  };

  const returnToDraft = () => {
    setStatus("DRAFT");
    setNotice({ tone: "info", text: "Returned to Draft. You can edit the paper again." });
  };

  const revise = () => {
    setStatus("DRAFT");
    setVersion((v) => v + 1);
    setNotice({
      tone: "info",
      text: `Started version ${String(version + 1).padStart(2, "0")} as a Draft. The approved version is not modified.`,
    });
  };

  const subject = getSubject(form.subjectId);
  const pendingSubjectName = pendingSubject ? getSubject(pendingSubject)?.name : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Examination"
        title="Paper Generator"
        description="Configure the constraints for a paper, choose questions from the bank, and review a preview."
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <Badge tone="demo">Demo</Badge>
        <p>
          Preview only. Questions come from the sample Question Bank, selection is manual, and
          nothing is generated by AI or saved outside this browser tab.
        </p>
      </div>

      <PaperStatusTracker status={status} version={version} savedAt={savedAt} />

      <PaperActionBar
        status={status}
        onSaveDraft={saveDraft}
        onValidate={validate}
        onSendToReview={sendToReview}
        onApprove={() => (evaluation.valid ? setDialog("approve") : showAttention())}
        onReturnToDraft={returnToDraft}
        onRevise={revise}
      />

      <div aria-live="polite">
        {notice && (
          <div
            role={notice.tone === "error" ? "alert" : "status"}
            className={`rounded-md border px-4 py-3 text-sm ${NOTICE_STYLES[notice.tone]}`}
          >
            {notice.text}
          </div>
        )}
      </div>

      <PaperStepper step={step} onChange={setStep} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          {step === "setup" && (
            <PaperSetupStep
              form={form}
              errors={evaluation.configErrors}
              readOnly={readOnly}
              onChange={updateForm}
              onSubjectChange={requestSubjectChange}
              onContinue={() => setStep("questions")}
            />
          )}
          {step === "questions" && (
            <PaperQuestionsStep
              subjectId={form.subjectId}
              selected={selectedItems}
              pool={pool}
              hiddenCount={ineligibleCount(form.subjectId)}
              evaluation={evaluation}
              readOnly={readOnly}
              onAdd={addQuestion}
              onRemove={removeQuestion}
              onClear={() => setDialog("clear")}
              onBack={() => setStep("setup")}
              onContinue={() => setStep("preview")}
            />
          )}
          {step === "preview" && (
            <PaperPreviewStep
              subjectId={form.subjectId}
              evaluation={evaluation}
              selected={selectedQuestions}
              status={status}
              version={version}
              canReplace={!readOnly}
              onBack={() => setStep("setup")}
              onGoToQuestions={() => setStep("questions")}
              onReplace={() => setDialog("replace")}
            />
          )}
        </div>

        <div
          ref={summaryRef}
          className="min-w-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
        >
          <ConstraintSummary evaluation={evaluation} />
        </div>
      </div>

      {pendingSubject && (
        <ConfirmDialog
          title="Change subject?"
          confirmLabel="Change subject"
          onConfirm={() => {
            applySubject(pendingSubject);
            setPendingSubject(null);
          }}
          onCancel={() => setPendingSubject(null)}
        >
          <p>
            Switching to <span className="font-semibold">{pendingSubjectName}</span> removes the{" "}
            {selection.length} {selection.length === 1 ? "question" : "questions"} selected for{" "}
            {subject?.name}, and clears the unit and topic coverage settings. Questions can only
            come from the selected subject.
          </p>
        </ConfirmDialog>
      )}

      {dialog === "clear" && (
        <ConfirmDialog
          title="Clear all selected questions?"
          confirmLabel="Clear selection"
          onConfirm={clearSelection}
          onCancel={() => setDialog(null)}
        >
          <p>
            All {selection.length} selected {selection.length === 1 ? "question" : "questions"} will
            be removed from the paper. The questions stay in the question bank.
          </p>
        </ConfirmDialog>
      )}

      {dialog === "approve" && (
        <ConfirmDialog
          title="Approve this paper?"
          confirmLabel="Approve paper"
          tone="neutral"
          onConfirm={approve}
          onCancel={() => setDialog(null)}
        >
          <p>
            The paper will be marked Approved and become read-only. Changing it afterwards starts a
            new version as a Draft.
          </p>
          <p className="mt-2 text-slate-500">
            Demo only: this changes local state and is not a real approval record.
          </p>
        </ConfirmDialog>
      )}

      {dialog === "replace" && (
        <Modal
          title="Regenerate or replace selection"
          description="Placeholder for a later feature."
          onClose={() => setDialog(null)}
        >
          <div className="space-y-3 px-5 py-4 text-sm text-slate-700">
            <p>
              Automatic selection is not part of this prototype. Questions are chosen manually from
              the Approved question bank.
            </p>
            <p>
              To replace a question, remove it in the question selection step and add another one.
              The constraint summary updates as you go.
            </p>
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
            <Button onClick={() => setDialog(null)}>Close</Button>
            <Button
              variant="primary"
              autoFocus
              onClick={() => {
                setDialog(null);
                setStep("questions");
              }}
            >
              Go to question selection
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
