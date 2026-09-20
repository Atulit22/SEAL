import { DEMO_QUESTIONS } from "../questions/demoData";
import type { Question } from "../questions/types";

/**
 * The paper builder reads the Question Bank demo data directly; it keeps no catalog of
 * its own. Edits made on the Question Bank page live in that page's state and do not
 * reach this module. A backend would replace this with an API lookup.
 */
export const BANK: Question[] = DEMO_QUESTIONS;

export const BANK_BY_ID = new Map(BANK.map((q) => [q.id, q]));

/** Questions that may be placed on a paper: same subject and reviewed as Approved. */
export function eligibleQuestions(subjectId: string): Question[] {
  return BANK.filter((q) => q.subjectId === subjectId && q.status === "APPROVED");
}

/** Subject questions that exist but are not eligible (Draft or Archived). */
export function ineligibleCount(subjectId: string): number {
  return BANK.filter((q) => q.subjectId === subjectId && q.status !== "APPROVED").length;
}
