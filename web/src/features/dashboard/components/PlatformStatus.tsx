import { Card } from "../../../components/ui/Card";
import { PLATFORM_COMPONENTS } from "../demoData";

export function PlatformStatus() {
  return (
    <Card
      title="Prototype status"
      description="Only the interface shell exists at this stage."
    >
      <ul className="divide-y divide-slate-100">
        {PLATFORM_COMPONENTS.map((c) => (
          <li key={c.name} className="flex items-center justify-between px-5 py-3 text-sm">
            <span className="text-slate-700">{c.name}</span>
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
              {c.note}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
