import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/ui/Card";
import { RECENT_ACTIVITY } from "../demoData";

export function RecentActivity() {
  return (
    <Card
      title="Recent activity"
      description="Static sample entries showing the intended audit-trail layout."
      action={<Badge tone="demo">Demo data</Badge>}
    >
      <ul className="divide-y divide-slate-100">
        {RECENT_ACTIVITY.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900">{item.action}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {item.actor} · {item.target}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-slate-500">
              <Badge tone={item.result.tone}>{item.result.label}</Badge>
              <span className="w-16 text-right tabular-nums">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
