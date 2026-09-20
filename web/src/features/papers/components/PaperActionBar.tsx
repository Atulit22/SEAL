import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/ui/Icon";
import type { PaperStatus } from "../types";

interface PaperActionBarProps {
  status: PaperStatus;
  onSaveDraft: () => void;
  onValidate: () => void;
  onSendToReview: () => void;
  onApprove: () => void;
  onReturnToDraft: () => void;
  onRevise: () => void;
}

const HINTS: Record<PaperStatus, string> = {
  DRAFT: "Edit freely. Validate when the constraint summary is clear.",
  VALIDATED: "Constraints were satisfied. Any further edit returns the paper to Draft.",
  TEACHER_REVIEW: "Content is read-only while under review. Approve, or return it to Draft to edit.",
  APPROVED: "Approved content is read-only. Changing it starts a new version as a Draft.",
};

/** Actions available for the current status; they change local demo state only. */
export function PaperActionBar({
  status,
  onSaveDraft,
  onValidate,
  onSendToReview,
  onApprove,
  onReturnToDraft,
  onRevise,
}: PaperActionBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-xs text-slate-500 sm:max-w-md">{HINTS[status]}</p>
      <div className="flex flex-wrap gap-2">
        {(status === "DRAFT" || status === "VALIDATED") && (
          <>
            <Button onClick={onSaveDraft}>Save draft</Button>
            <Button variant={status === "DRAFT" ? "primary" : "secondary"} onClick={onValidate}>
              <Icon name="check" className="h-4 w-4" />
              {status === "DRAFT" ? "Validate paper" : "Re-validate"}
            </Button>
          </>
        )}
        {status === "VALIDATED" && (
          <Button variant="primary" onClick={onSendToReview}>
            Send to teacher review
          </Button>
        )}
        {status === "TEACHER_REVIEW" && (
          <>
            <Button onClick={onReturnToDraft}>Return to draft</Button>
            <Button variant="primary" onClick={onApprove}>
              Approve paper
            </Button>
          </>
        )}
        {status === "APPROVED" && (
          <Button variant="primary" onClick={onRevise}>
            Revise as new version
          </Button>
        )}
      </div>
    </div>
  );
}
