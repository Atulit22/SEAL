import { getSubject, getTopics, getUnits } from "./catalog";
import {
  DIFFICULTY_OPTIONS,
  MAX_MARKS,
  STATUS_OPTIONS,
  TEXT_MAX,
  TEXT_MIN,
  TYPE_OPTIONS,
  type QuestionInput,
} from "./types";

/** Raw form state: every field is a string until validated. */
export interface QuestionFormValues {
  text: string;
  subjectId: string;
  unitId: string;
  topicId: string;
  marks: string;
  difficulty: string;
  type: string;
  status: string;
}

export type QuestionField = keyof QuestionFormValues;
export type QuestionFormErrors = Partial<Record<QuestionField, string>>;

export type QuestionValidation =
  | { ok: true; value: QuestionInput }
  | { ok: false; errors: QuestionFormErrors };

/** Order used to focus the first invalid field. */
export const FIELD_ORDER: QuestionField[] = [
  "text",
  "subjectId",
  "unitId",
  "topicId",
  "marks",
  "difficulty",
  "type",
  "status",
];

const oneOf = (options: { value: string }[], v: string) => options.some((o) => o.value === v);

/**
 * Deterministic question validation. Beyond required/format checks it enforces that
 * the subject exists, the unit belongs to that subject, and the topic belongs to that
 * unit, so a question can never point at an inconsistent syllabus path.
 */
export function validateQuestion(values: QuestionFormValues): QuestionValidation {
  const errors: QuestionFormErrors = {};

  const text = values.text.trim();
  if (text === "") {
    errors.text = "Enter the question text.";
  } else if (text.length < TEXT_MIN) {
    errors.text = `Question text must be at least ${TEXT_MIN} characters.`;
  } else if (text.length > TEXT_MAX) {
    errors.text = `Keep the question to ${TEXT_MAX} characters or fewer.`;
  }

  if (values.subjectId === "") {
    errors.subjectId = "Select a subject.";
  } else if (!getSubject(values.subjectId)) {
    errors.subjectId = "Select a subject that has a syllabus.";
  }

  if (values.unitId === "") {
    errors.unitId = "Select a unit.";
  } else if (!errors.subjectId && !getUnits(values.subjectId).some((u) => u.id === values.unitId)) {
    errors.unitId = "This unit does not belong to the selected subject.";
  }

  if (values.topicId === "") {
    errors.topicId = "Select a topic.";
  } else if (
    !errors.subjectId &&
    !errors.unitId &&
    !getTopics(values.subjectId, values.unitId).some((t) => t.id === values.topicId)
  ) {
    errors.topicId = "This topic does not belong to the selected unit.";
  }

  const marksText = values.marks.trim();
  const marks = Number(marksText);
  if (marksText === "") {
    errors.marks = "Enter the marks.";
  } else if (!/^\d+$/.test(marksText) || marks < 1 || marks > MAX_MARKS) {
    errors.marks = `Marks must be a whole number from 1 to ${MAX_MARKS}.`;
  }

  if (values.difficulty === "") errors.difficulty = "Select a difficulty.";
  else if (!oneOf(DIFFICULTY_OPTIONS, values.difficulty)) errors.difficulty = "Select a valid difficulty.";

  if (values.type === "") errors.type = "Select a question type.";
  else if (!oneOf(TYPE_OPTIONS, values.type)) errors.type = "Select a valid question type.";

  if (!oneOf(STATUS_OPTIONS, values.status)) errors.status = "Select a valid status.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      text,
      subjectId: values.subjectId,
      unitId: values.unitId,
      topicId: values.topicId,
      marks,
      difficulty: values.difficulty as QuestionInput["difficulty"],
      type: values.type as QuestionInput["type"],
      status: values.status as QuestionInput["status"],
    },
  };
}
