import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";

export function Brand() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-amber-400/60 bg-amber-400/10 text-amber-300"
      >
        <Icon name="security" />
      </span>
      <span className="leading-tight">
        <span className="block font-serif text-lg font-semibold tracking-[0.18em] text-white">
          SEAL
        </span>
        <span className="block text-[10px] uppercase tracking-[0.14em] text-slate-400">
          Secure Exam Platform
        </span>
      </span>
    </Link>
  );
}
