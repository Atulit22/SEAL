import { Icon } from "../ui/Icon";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  onOpenNav: () => void;
}

export function Header({ onOpenNav }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 lg:hidden"
      >
        <Icon name="menu" />
      </button>

      <div className="hidden min-w-0 md:block">
        <p className="truncate text-sm font-semibold text-slate-900">Demo College</p>
        <p className="truncate text-xs text-slate-500">Session 2026-27 · placeholder</p>
      </div>

      <div className="relative ml-auto hidden w-full max-w-xs md:block">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          disabled
          placeholder="Search (not connected)"
          aria-label="Search (not connected)"
          className="w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm placeholder:text-slate-400"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 md:ml-0">
        <button
          type="button"
          disabled
          aria-label="Notifications (not connected)"
          className="cursor-not-allowed rounded-md p-2 text-slate-400"
        >
          <Icon name="bell" />
        </button>
        <span className="hidden h-6 w-px bg-slate-200 sm:block" aria-hidden="true" />
        <UserMenu />
      </div>
    </header>
  );
}
