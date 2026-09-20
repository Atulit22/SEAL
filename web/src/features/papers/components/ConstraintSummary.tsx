import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../components/ui/Icon";
import type { PaperEvaluation } from "../types";

interface ConstraintSummaryProps {
  evaluation: PaperEvaluation;
}

/** Live view of every configured constraint against the current selection. */
export function ConstraintSummary({ evaluation }: ConstraintSummaryProps) {
  const { valid, failedCount, checks, selectedCount, selectedMarks, config } = evaluation;

  return (
    <Card
      title="Constraint summary"
      description="Recalculated on every change."
      action={<Badge tone={valid ? "success" : "warning"}>{valid ? "Valid" : "Needs attention"}</Badge>}
    >
      <div
        role="status"
        className={`flex items-start gap-2 border-b px-5 py-3 text-sm ${
          valid
            ? "border-emerald-100 bg-emerald-50 text-emerald-900"
            : "border-orange-100 bg-orange-50 text-orange-900"
        }`}
      >
        <Icon name={valid ? "check" : "alert"} className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          {valid
            ? "All configured constraints are satisfied. This is a rule check, not a review or approval."
            : `${failedCount} of ${checks.length} checks need attention.`}
        </p>
      </div>

      <dl className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100 text-center">
        <div className="px-3 py-3">
          <dt className="text-xs text-slate-500">Marks</dt>
          <dd className="mt-0.5 font-serif text-xl font-semibold tabular-nums text-slate-900">
            {selectedMarks}
            <span className="text-sm font-normal text-slate-500"> / {config.totalMarks ?? "?"}</span>
          </dd>
        </div>
        <div className="px-3 py-3">
          <dt className="text-xs text-slate-500">Questions</dt>
          <dd className="mt-0.5 font-serif text-xl font-semibold tabular-nums text-slate-900">
            {selectedCount}
            <span className="text-sm font-normal text-slate-500">
              {" "}
              / {config.questionCount ?? "?"}
            </span>
          </dd>
        </div>
      </dl>

      <ul className="divide-y divide-slate-100">
        {checks.map((check) => (
          <li key={check.id} className="px-5 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-900">{check.label}</p>
              <span
                className={`flex shrink-0 items-center gap-1 text-xs font-semibold ${check.ok ? "text-emerald-700" : "text-orange-700"}`}
              >
                <Icon name={check.ok ? "check" : "alert"} className="h-3.5 w-3.5" />
                {check.ok ? "OK" : "Attention"}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              <span className="font-medium text-slate-600">Required:</span> {check.required}
            </p>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-600">Selected:</span> {check.actual}
            </p>
            {check.messages.length > 0 && (
              <ul className="mt-2 list-disc space-y-0.5 pl-4 text-xs text-orange-800">
                {check.messages.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
