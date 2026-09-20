import { DEMO_SUBJECTS } from "../subjects/demoData";
import type { Subject } from "../subjects/types";
import { DEMO_SYLLABUS } from "../syllabus/demoData";
import type { Topic, Unit } from "../syllabus/types";

/**
 * Read-only view of the Subjects and Syllabus demo data, so questions are always
 * attached to a valid subject -> unit -> topic path. Edits made on the Subjects or
 * Syllabus pages live in those pages' own state and do not reach this module; when a
 * backend exists this becomes an API lookup.
 */

/** Subjects that have at least one syllabus unit, i.e. can hold questions. */
export const QUESTION_SUBJECTS: Subject[] = DEMO_SUBJECTS.filter(
  (s) => (DEMO_SYLLABUS[s.id]?.length ?? 0) > 0,
);

export const subjectLabel = (s: Subject) => `${s.code} · ${s.name}`;

export function getSubject(subjectId: string): Subject | undefined {
  return QUESTION_SUBJECTS.find((s) => s.id === subjectId);
}

export function getUnits(subjectId: string): Unit[] {
  return [...(DEMO_SYLLABUS[subjectId] ?? [])].sort((a, b) => a.number - b.number);
}

export const unitLabel = (u: Unit) => `Unit ${u.number} · ${u.title}`;

export function getTopics(subjectId: string, unitId: string): Topic[] {
  return getUnits(subjectId).find((u) => u.id === unitId)?.topics ?? [];
}

export interface QuestionLocation {
  subjectCode: string;
  subjectName: string;
  unit: string;
  topic: string;
}

/** Human-readable subject/unit/topic for a question; "-" where an id is unknown. */
export function describeLocation(ref: {
  subjectId: string;
  unitId: string;
  topicId: string;
}): QuestionLocation {
  const subject = getSubject(ref.subjectId);
  const unit = getUnits(ref.subjectId).find((u) => u.id === ref.unitId);
  const topic = unit?.topics.find((t) => t.id === ref.topicId);
  return {
    subjectCode: subject?.code ?? "-",
    subjectName: subject?.name ?? "-",
    unit: unit ? `Unit ${unit.number} · ${unit.title}` : "-",
    topic: topic?.title ?? "-",
  };
}
