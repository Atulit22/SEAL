import { Link } from "react-router-dom";
import { Badge } from "../../../components/ui/Badge";
import { Icon } from "../../../components/ui/Icon";
import type { SummaryCardData } from "../demoData";

export function SummaryCard({ title, value, caption, icon, to }: SummaryCardData) {
  const body = (
    <>
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-900 text-amber-300">
          <Icon name={icon} />
        </span>
        <Badge tone="demo">Demo</Badge>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>
      <p className="mt-1 font-serif text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
      {to && (
        <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-amber-700">
          Open module
          <Icon name="arrow" className="h-3.5 w-3.5" />
        </p>
      )}
    </>
  );

  const base = "block rounded-lg border border-slate-200 border-t-2 border-t-amber-500 bg-white p-5 shadow-sm";

  return to ? (
    <Link
      to={to}
      className={`group ${base} transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500`}
    >
      {body}
    </Link>
  ) : (
    <div className={base}>{body}</div>
  );
}
