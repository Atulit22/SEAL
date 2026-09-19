import { NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Brand } from "./Brand";
import { NAV_GROUPS } from "./navigation";

interface SidebarProps {
  onNavigate?: () => void;
  onClose?: () => void;
}

export function Sidebar({ onNavigate, onClose }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Brand />
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-slate-400 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Icon name="close" />
          </button>
        )}
      </div>

      <nav aria-label="Primary" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {group.heading}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md border-l-2 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        isActive
                          ? "border-amber-400 bg-white/10 text-white"
                          : "border-transparent hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Academic prototype
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          AKTU-style workflow. Not an official or production system.
        </p>
      </div>
    </div>
  );
}
