import { Badge } from "../ui/Badge";

/**
 * Static profile placeholder. Real identity, role and college must come from
 * the authenticated backend session, never from frontend values.
 */
export function UserMenu() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium leading-tight text-slate-900">Demo User</p>
        <p className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-slate-500">
          Question Setter
          <Badge tone="demo">Demo</Badge>
        </p>
      </div>
      <span
        role="img"
        aria-label="Demo user avatar"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold tracking-wide text-amber-300 ring-2 ring-slate-200"
      >
        DU
      </span>
    </div>
  );
}
