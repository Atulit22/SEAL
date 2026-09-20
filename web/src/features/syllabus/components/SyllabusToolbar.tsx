import { Icon } from "../../../components/ui/Icon";
import { inputClass } from "../../../components/ui/formStyles";

export interface SubjectOption {
  id: string;
  label: string;
}

interface SyllabusToolbarProps {
  subjects: SubjectOption[];
  subjectId: string;
  onSubjectChange: (id: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export function SyllabusToolbar({
  subjects,
  subjectId,
  onSubjectChange,
  query,
  onQueryChange,
}: SyllabusToolbarProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="syllabus-subject" className="block text-sm font-medium text-slate-800">
          Subject
        </label>
        <select
          id="syllabus-subject"
          value={subjectId}
          onChange={(e) => onSubjectChange(e.target.value)}
          className={`mt-1.5 ${inputClass(false)}`}
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="syllabus-search" className="block text-sm font-medium text-slate-800">
          Search units and topics
        </label>
        <div className="relative mt-1.5">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            id="syllabus-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="e.g. trees, unit 3"
            autoComplete="off"
            className={`${inputClass(false)} pl-9`}
          />
        </div>
      </div>
    </div>
  );
}
