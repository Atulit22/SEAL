import { Icon } from "../../../components/ui/Icon";
import type { Subject } from "../types";
import { SubjectStatusBadge } from "./SubjectStatusBadge";

interface SubjectTableProps {
  subjects: Subject[];
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}

const ICON_BUTTON =
  "rounded-md p-2 text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500";

function RowActions({
  subject,
  onEdit,
  onDelete,
}: {
  subject: Subject;
  onEdit: (subject: Subject) => void;
  onDelete: (subject: Subject) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(subject)}
        aria-label={`Edit ${subject.code}`}
        className={`${ICON_BUTTON} hover:bg-slate-100 hover:text-slate-900`}
      >
        <Icon name="edit" className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(subject)}
        aria-label={`Delete ${subject.code}`}
        className={`${ICON_BUTTON} hover:bg-red-50 hover:text-red-700`}
      >
        <Icon name="trash" className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

export function SubjectTable({ subjects, onEdit, onDelete }: SubjectTableProps) {
  return (
    <>
      {/* Tablet / desktop: table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="px-5 py-3 font-semibold">Code</th>
            <th scope="col" className="px-5 py-3 font-semibold">Subject name</th>
            <th scope="col" className="px-5 py-3 font-semibold">Semester</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subjects.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50/70">
              <td className="whitespace-nowrap px-5 py-3 font-mono text-xs font-medium text-slate-900">
                {s.code}
              </td>
              <td className="px-5 py-3 text-slate-800">{s.name}</td>
              <td className="whitespace-nowrap px-5 py-3 text-slate-600">Semester {s.semester}</td>
              <td className="px-5 py-3">
                <SubjectStatusBadge status={s.status} />
              </td>
              <td className="px-3 py-1.5">
                <RowActions subject={s} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {subjects.map((s) => (
          <li key={s.id} className="flex items-start justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <p className="font-mono text-xs font-medium text-slate-500">{s.code}</p>
              <p className="mt-0.5 text-sm font-medium text-slate-900">{s.name}</p>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <SubjectStatusBadge status={s.status} />
                Semester {s.semester}
              </p>
            </div>
            <RowActions subject={s} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </>
  );
}
