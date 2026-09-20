import type { ReactNode } from "react";
import { Icon } from "../../../components/ui/Icon";
import { inputClass } from "../../../components/ui/formStyles";
import { QUESTION_SUBJECTS, getTopics, getUnits, subjectLabel, unitLabel } from "../catalog";
import {
  DIFFICULTY_OPTIONS,
  STATUS_OPTIONS,
  TYPE_OPTIONS,
  type QuestionFilterState,
} from "../types";

interface QuestionFiltersProps {
  filters: QuestionFilterState;
  marksOptions: number[];
  active: boolean;
  onChange: (next: QuestionFilterState) => void;
  onClear: () => void;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}

function FilterSelect({ id, label, value, disabled, onChange, children }: FilterSelectProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${inputClass(false)} py-2`}
      >
        {children}
      </select>
    </div>
  );
}

export function QuestionFilters({
  filters,
  marksOptions,
  active,
  onChange,
  onClear,
}: QuestionFiltersProps) {
  const units = filters.subjectId !== "ALL" ? getUnits(filters.subjectId) : [];
  const topics =
    filters.subjectId !== "ALL" && filters.unitId !== "ALL"
      ? getTopics(filters.subjectId, filters.unitId)
      : [];

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="question-search" className="block text-xs font-medium text-slate-600">
          Search question text or code
        </label>
        <div className="relative mt-1">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            id="question-search"
            type="search"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="e.g. AVL, deadlock, DEMO-Q-007"
            autoComplete="off"
            className={`${inputClass(false)} py-2 pl-9`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        <FilterSelect
          id="filter-subject"
          label="Subject"
          value={filters.subjectId}
          onChange={(subjectId) => onChange({ ...filters, subjectId, unitId: "ALL", topicId: "ALL" })}
        >
          <option value="ALL">All subjects</option>
          {QUESTION_SUBJECTS.map((s) => (
            <option key={s.id} value={s.id}>
              {subjectLabel(s)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-unit"
          label="Unit"
          value={filters.unitId}
          disabled={filters.subjectId === "ALL"}
          onChange={(unitId) => onChange({ ...filters, unitId, topicId: "ALL" })}
        >
          <option value="ALL">{filters.subjectId === "ALL" ? "Select subject first" : "All units"}</option>
          {units.map((u) => (
            <option key={u.id} value={u.id}>
              {unitLabel(u)}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-topic"
          label="Topic"
          value={filters.topicId}
          disabled={filters.unitId === "ALL"}
          onChange={(topicId) => onChange({ ...filters, topicId })}
        >
          <option value="ALL">{filters.unitId === "ALL" ? "Select unit first" : "All topics"}</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-difficulty"
          label="Difficulty"
          value={filters.difficulty}
          onChange={(v) => onChange({ ...filters, difficulty: v as QuestionFilterState["difficulty"] })}
        >
          <option value="ALL">All difficulties</option>
          {DIFFICULTY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-marks"
          label="Marks"
          value={filters.marks}
          onChange={(marks) => onChange({ ...filters, marks })}
        >
          <option value="ALL">All marks</option>
          {marksOptions.map((m) => (
            <option key={m} value={String(m)}>
              {m} {m === 1 ? "mark" : "marks"}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-type"
          label="Question type"
          value={filters.type}
          onChange={(v) => onChange({ ...filters, type: v as QuestionFilterState["type"] })}
        >
          <option value="ALL">All types</option>
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          id="filter-status"
          label="Status"
          value={filters.status}
          onChange={(v) => onChange({ ...filters, status: v as QuestionFilterState["status"] })}
        >
          <option value="ALL">All statuses</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </FilterSelect>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onClear}
            disabled={!active}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
