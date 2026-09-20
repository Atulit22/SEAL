import { Card } from "../../../components/ui/Card";
import { Icon } from "../../../components/ui/Icon";
import { LIFECYCLE, type PaperStatus } from "../types";

interface PaperStatusTrackerProps {
  status: PaperStatus;
  version: number;
  savedAt: string | null;
}

export function PaperStatusTracker({ status, version, savedAt }: PaperStatusTrackerProps) {
  const currentIndex = LIFECYCLE.findIndex((l) => l.value === status);

  return (
    <Card>
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            Paper status
          </p>
          <p className="text-xs text-slate-500">
            Version {String(version).padStart(2, "0")}
            {" · "}
            {savedAt ? `Draft saved locally at ${savedAt}` : "Not saved"}
          </p>
        </div>

        <ol aria-label="Paper lifecycle" className="grid gap-2 sm:grid-cols-4">
          {LIFECYCLE.map((step, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            return (
              <li
                key={step.value}
                aria-current={current ? "step" : undefined}
                className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${
                  current
                    ? "border-amber-400 bg-amber-50"
                    : done
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-slate-50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    current
                      ? "bg-amber-500 text-white"
                      : done
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-semibold ${current ? "text-slate-900" : done ? "text-emerald-800" : "text-slate-500"}`}
                  >
                    {step.label}
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    {current ? "Current" : done ? "Complete" : "Pending"}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <p className="text-xs text-slate-500">
          Prototype workflow only. Later lifecycle stages are not built yet, and nothing is stored
          outside this browser tab.
        </p>
      </div>
    </Card>
  );
}
