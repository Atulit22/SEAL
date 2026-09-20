import { Icon } from "../../../components/ui/Icon";
import type { Topic, UnitView } from "../types";

interface UnitCardProps {
  view: UnitView;
  open: boolean;
  /** True while a search is active: matching units are forced open. */
  searching: boolean;
  onToggle: () => void;
  onEditUnit: () => void;
  onDeleteUnit: () => void;
  onAddTopic: () => void;
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (topic: Topic) => void;
}

const ICON_BUTTON =
  "rounded-md p-2 text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500";

export function UnitCard({
  view,
  open,
  searching,
  onToggle,
  onEditUnit,
  onDeleteUnit,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
}: UnitCardProps) {
  const { unit, topics } = view;
  const total = unit.topics.length;
  const panelId = `unit-panel-${unit.id}`;
  const countLabel =
    topics.length === total
      ? `${total} ${total === 1 ? "topic" : "topics"}`
      : `${topics.length} of ${total} topics`;

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-1 pr-2">
        <button
          type="button"
          onClick={onToggle}
          disabled={searching}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-4 py-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-default"
        >
          <Icon
            name="chevronDown"
            className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "" : "-rotate-90"}`}
          />
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-700">
              Unit {unit.number}
            </span>
            <span className="block truncate font-serif text-base font-semibold text-slate-900">
              {unit.title}
            </span>
          </span>
          <span className="ml-auto shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            {countLabel}
          </span>
        </button>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onEditUnit}
            aria-label={`Edit unit ${unit.number}`}
            className={`${ICON_BUTTON} hover:bg-slate-100 hover:text-slate-900`}
          >
            <Icon name="edit" className="h-[18px] w-[18px]" />
          </button>
          <button
            type="button"
            onClick={onDeleteUnit}
            aria-label={`Delete unit ${unit.number}`}
            className={`${ICON_BUTTON} hover:bg-red-50 hover:text-red-700`}
          >
            <Icon name="trash" className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {open && (
        <div id={panelId} className="border-t border-slate-100">
          {topics.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {topics.map((topic) => (
                <li key={topic.id} className="flex items-center justify-between gap-3 py-1 pl-12 pr-2">
                  <span className="min-w-0 py-2 text-sm text-slate-800">{topic.title}</span>
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => onEditTopic(topic)}
                      aria-label={`Edit topic ${topic.title}`}
                      className={`${ICON_BUTTON} hover:bg-slate-100 hover:text-slate-900`}
                    >
                      <Icon name="edit" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteTopic(topic)}
                      aria-label={`Delete topic ${topic.title}`}
                      className={`${ICON_BUTTON} hover:bg-red-50 hover:text-red-700`}
                    >
                      <Icon name="trash" className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-3 pl-12 pr-4 text-sm text-slate-500">No topics in this unit yet.</p>
          )}

          <div className="border-t border-slate-100 py-2 pl-11 pr-4">
            <button
              type="button"
              onClick={onAddTopic}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Icon name="plus" className="h-4 w-4" />
              Add topic
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
