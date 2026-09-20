import { useState, type SubmitEvent } from "react";
import { FormField } from "../../../components/ui/FormField";
import { inputClass } from "../../../components/ui/formStyles";
import { Modal } from "../../../components/ui/Modal";
import { validateTopic } from "../validation";
import type { Topic, Unit } from "../types";

interface TopicFormModalProps {
  /** Unit the topic belongs to. */
  unit: Unit;
  /** Topic being edited, or null when adding. */
  topic: Topic | null;
  onSave: (title: string) => void;
  onClose: () => void;
}

export function TopicFormModal({ unit, topic, onSave, onClose }: TopicFormModalProps) {
  const editing = topic !== null;
  const [title, setTitle] = useState(topic?.title ?? "");
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = validateTopic(title, unit.topics, topic?.id);
    if (!result.ok) {
      setError(result.error);
      document.getElementById("topic-title")?.focus();
      return;
    }
    onSave(result.title);
  };

  return (
    <Modal
      title={editing ? "Edit topic" : "Add topic"}
      description={`Unit ${unit.number}: ${unit.title}`}
      onClose={onClose}
    >
      <form noValidate onSubmit={handleSubmit}>
        <div className="px-5 py-4">
          <FormField id="topic-title" label="Topic title" error={error}>
            <input
              id="topic-title"
              type="text"
              autoComplete="off"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(undefined);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "topic-title-error" : undefined}
              placeholder="e.g. Binary search trees"
              className={inputClass(!!error)}
            />
          </FormField>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {editing ? "Save changes" : "Add topic"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
