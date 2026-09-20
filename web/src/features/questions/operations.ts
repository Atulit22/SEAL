import { DEFAULT_FILTERS, type Question, type QuestionFilterState, type QuestionInput } from "./types";

export function hasActiveFilters(f: QuestionFilterState): boolean {
  return (Object.keys(DEFAULT_FILTERS) as (keyof QuestionFilterState)[]).some(
    (k) => (k === "query" ? f.query.trim() !== "" : f[k] !== DEFAULT_FILTERS[k]),
  );
}

/** All filters combine with AND. Search matches question text or code. */
export function matchesFilters(q: Question, f: QuestionFilterState): boolean {
  if (f.subjectId !== "ALL" && q.subjectId !== f.subjectId) return false;
  if (f.unitId !== "ALL" && q.unitId !== f.unitId) return false;
  if (f.topicId !== "ALL" && q.topicId !== f.topicId) return false;
  if (f.difficulty !== "ALL" && q.difficulty !== f.difficulty) return false;
  if (f.marks !== "ALL" && String(q.marks) !== f.marks) return false;
  if (f.type !== "ALL" && q.type !== f.type) return false;
  if (f.status !== "ALL" && q.status !== f.status) return false;

  const needle = f.query.trim().toLowerCase();
  if (needle === "") return true;
  return q.text.toLowerCase().includes(needle) || q.code.toLowerCase().includes(needle);
}

export function filterQuestions(questions: Question[], f: QuestionFilterState): Question[] {
  return questions.filter((q) => matchesFilters(q, f)).sort((a, b) => a.code.localeCompare(b.code));
}

/** True when saving `input` over `q` would change any editable field. */
export function differs(q: Question, input: QuestionInput): boolean {
  return (Object.keys(input) as (keyof QuestionInput)[]).some((k) => q[k] !== input[k]);
}

/** Distinct marks values present in the bank (plus `keep`), ascending. */
export function marksOptions(questions: Question[], keep: string): number[] {
  const set = new Set(questions.map((q) => q.marks));
  if (keep !== "ALL") set.add(Number(keep));
  return [...set].sort((a, b) => a - b);
}
