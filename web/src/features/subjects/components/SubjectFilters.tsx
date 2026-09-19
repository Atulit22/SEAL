import { Icon } from "../../../components/ui/Icon";
import { SEMESTERS, STATUS_OPTIONS, type SubjectFilterState } from "../types";

const CONTROL =
  "block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30";

interface SubjectFiltersProps {
  filters: SubjectFilterState;
  onChange: (next: SubjectFilterState) => void;
}

export function SubjectFilters({ filters, onChange }: SubjectFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_10rem_10rem]">
      <div className="relative">
        <label htmlFor="subject-search" className="sr-only">
          Search subjects by code or name
        </label>
        <Icon
          name="search"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
        <input
          id="subject-search"
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search by code or name"
          autoComplete="off"
          className={`${CONTROL} pl-9`}
        />
      </div>

      <div>
        <label htmlFor="subject-filter-status" className="sr-only">
          Filter by status
        </label>
        <select
          id="subject-filter-status"
          value={filters.status}
          onChange={(e) =>
            onChange({ ...filters, status: e.target.value as SubjectFilterState["status"] })
          }
          className={CONTROL}
        >
          <option value="ALL">All statuses</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject-filter-semester" className="sr-only">
          Filter by semester
        </label>
        <select
          id="subject-filter-semester"
          value={filters.semester}
          onChange={(e) => onChange({ ...filters, semester: e.target.value })}
          className={CONTROL}
        >
          <option value="ALL">All semesters</option>
          {SEMESTERS.map((s) => (
            <option key={s} value={String(s)}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
