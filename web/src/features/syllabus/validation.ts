import { MAX_UNIT_NUMBER, type Topic, type Unit } from "./types";

const UNIT_TITLE_MAX = 120;
const TOPIC_TITLE_MAX = 150;

const normalise = (s: string) => s.trim().replace(/\s+/g, " ");

export type UnitFormErrors = Partial<Record<"number" | "title", string>>;

export type UnitValidation =
  | { ok: true; value: { number: number; title: string } }
  | { ok: false; errors: UnitFormErrors };

/** `existing` is the subject's current units; `editingId` excludes the unit being edited. */
export function validateUnit(
  values: { number: string; title: string },
  existing: Unit[],
  editingId?: string,
): UnitValidation {
  const errors: UnitFormErrors = {};

  const number = Number(values.number);
  if (values.number.trim() === "") {
    errors.number = "Enter a unit number.";
  } else if (!Number.isInteger(number) || number < 1 || number > MAX_UNIT_NUMBER) {
    errors.number = `Use a whole number from 1 to ${MAX_UNIT_NUMBER}.`;
  } else if (existing.some((u) => u.id !== editingId && u.number === number)) {
    errors.number = `Unit ${number} already exists for this subject.`;
  }

  const title = normalise(values.title);
  if (title === "") {
    errors.title = "Enter a unit title.";
  } else if (title.length > UNIT_TITLE_MAX) {
    errors.title = `Keep the title to ${UNIT_TITLE_MAX} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, value: { number, title } };
}

export type TopicValidation = { ok: true; title: string } | { ok: false; error: string };

/** `existing` is the unit's current topics; `editingId` excludes the topic being edited. */
export function validateTopic(
  rawTitle: string,
  existing: Topic[],
  editingId?: string,
): TopicValidation {
  const title = normalise(rawTitle);
  if (title === "") return { ok: false, error: "Enter a topic title." };
  if (title.length > TOPIC_TITLE_MAX) {
    return { ok: false, error: `Keep the title to ${TOPIC_TITLE_MAX} characters or fewer.` };
  }
  const lower = title.toLowerCase();
  if (existing.some((t) => t.id !== editingId && t.title.toLowerCase() === lower)) {
    return { ok: false, error: "This topic already exists in the unit." };
  }
  return { ok: true, title };
}
