import { Icon } from "../../../components/ui/Icon";
import { describeLocation } from "../catalog";
import type { Question } from "../types";
import { DifficultyLabel, QuestionStatusBadge, QuestionTypeBadge } from "./QuestionBadges";

interface QuestionTableProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (question: Question) => void;
}

const ICON_BUTTON =
  "rounded-md p-2 text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500";

function RowActions({
  question,
  onEdit,
  onDelete,
}: {
  question: Question;
  onEdit: (q: Question) => void;
  onDelete: (q: Question) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(question)}
        aria-label={`Edit ${question.code}`}
        className={`${ICON_BUTTON} hover:bg-slate-100 hover:text-slate-900`}
      >
        <Icon name="edit" className="h-[18px] w-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(question)}
        aria-label={`Delete ${question.code}`}
        className={`${ICON_BUTTON} hover:bg-red-50 hover:text-red-700`}
      >
        <Icon name="trash" className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

const marksText = (m: number) => `${m} ${m === 1 ? "mark" : "marks"}`;

export function QuestionTable({ questions, onEdit, onDelete }: QuestionTableProps) {
  return (
    <>
      {/* Wide screens: table */}
      <table className="hidden w-full text-left text-sm xl:table">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th scope="col" className="px-5 py-3 font-semibold">Code</th>
            <th scope="col" className="px-3 py-3 font-semibold">Question</th>
            <th scope="col" className="px-3 py-3 font-semibold">Syllabus</th>
            <th scope="col" className="px-3 py-3 font-semibold">Marks</th>
            <th scope="col" className="px-3 py-3 font-semibold">Difficulty</th>
            <th scope="col" className="px-3 py-3 font-semibold">Type</th>
            <th scope="col" className="px-3 py-3 font-semibold">Status</th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {questions.map((q) => {
            const loc = describeLocation(q);
            return (
              <tr key={q.id} className="align-top hover:bg-slate-50/70">
                <td className="whitespace-nowrap px-5 py-3">
                  <span className="font-mono text-xs font-medium text-slate-900">{q.code}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">v{q.version}</span>
                </td>
                <td className="max-w-md px-3 py-3 text-slate-800">
                  <p className="line-clamp-3">{q.text}</p>
                </td>
                <td className="px-3 py-3 text-xs text-slate-600">
                  <p className="font-medium text-slate-800">
                    {loc.subjectCode} · {loc.subjectName}
                  </p>
                  <p className="mt-0.5">{loc.unit}</p>
                  <p className="mt-0.5 text-slate-500">{loc.topic}</p>
                </td>
                <td className="whitespace-nowrap px-3 py-3 tabular-nums text-slate-700">{q.marks}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <DifficultyLabel difficulty={q.difficulty} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <QuestionTypeBadge type={q.type} />
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <QuestionStatusBadge status={q.status} />
                </td>
                <td className="px-3 py-1.5">
                  <RowActions question={q} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Smaller screens: stacked cards */}
      <ul className="divide-y divide-slate-100 xl:hidden">
        {questions.map((q) => {
          const loc = describeLocation(q);
          return (
            <li key={q.id} className="px-4 py-4 sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-xs font-medium text-slate-500">
                  {q.code} · v{q.version}
                </p>
                <QuestionStatusBadge status={q.status} />
              </div>
              <p className="mt-2 text-sm text-slate-900">{q.text}</p>
              <p className="mt-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">
                  {loc.subjectCode} · {loc.subjectName}
                </span>
                <br />
                {loc.unit} · {loc.topic}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="text-sm font-medium tabular-nums text-slate-700">
                    {marksText(q.marks)}
                  </span>
                  <DifficultyLabel difficulty={q.difficulty} />
                  <QuestionTypeBadge type={q.type} />
                </div>
                <RowActions question={q} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
