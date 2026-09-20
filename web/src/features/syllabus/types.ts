export interface Topic {
  id: string;
  title: string;
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  topics: Topic[];
}

/** A unit as displayed: `topics` is the (possibly search-filtered) subset. */
export interface UnitView {
  unit: Unit;
  topics: Topic[];
}

/** Syllabus keyed by subject id. */
export type SyllabusBySubject = Record<string, Unit[]>;

export const MAX_UNIT_NUMBER = 20;
