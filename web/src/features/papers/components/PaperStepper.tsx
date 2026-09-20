import type { PaperStep } from "../types";

const STEPS: { value: PaperStep; label: string }[] = [
  { value: "setup", label: "Setup" },
  { value: "questions", label: "Questions" },
  { value: "preview", label: "Preview and review" },
];

interface PaperStepperProps {
  step: PaperStep;
  onChange: (step: PaperStep) => void;
}

export function PaperStepper({ step, onChange }: PaperStepperProps) {
  return (
    <nav aria-label="Paper builder steps">
      <ol className="grid grid-cols-3 gap-2 rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
        {STEPS.map((s, i) => {
          const active = s.value === step;
          return (
            <li key={s.value}>
              <button
                type="button"
                onClick={() => onChange(s.value)}
                aria-current={active ? "step" : undefined}
                className={`flex w-full items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`hidden h-5 w-5 items-center justify-center rounded-full text-[11px] sm:flex ${
                    active ? "bg-amber-400 text-slate-900" : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {i + 1}
                </span>
                {s.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
