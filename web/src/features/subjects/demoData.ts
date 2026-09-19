import type { Subject } from "./types";

/**
 * STATIC DEMO DATA - not read from any backend or database, and not real
 * university records. Edits are held in memory only and reset on page reload.
 */
export const DEMO_SUBJECTS: Subject[] = [
  { id: "demo-1", code: "DEMO-CS301", name: "Data Structures", semester: 3, status: "ACTIVE" },
  { id: "demo-2", code: "DEMO-CS302", name: "Discrete Mathematics", semester: 3, status: "ACTIVE" },
  { id: "demo-3", code: "DEMO-CS401", name: "Operating Systems", semester: 4, status: "ACTIVE" },
  { id: "demo-4", code: "DEMO-CS402", name: "Database Management Systems", semester: 4, status: "ACTIVE" },
  { id: "demo-5", code: "DEMO-CS501", name: "Computer Networks", semester: 5, status: "DRAFT" },
  { id: "demo-6", code: "DEMO-CS502", name: "Theory of Automata", semester: 5, status: "ACTIVE" },
  { id: "demo-7", code: "DEMO-CS601", name: "Compiler Design", semester: 6, status: "DRAFT" },
  { id: "demo-8", code: "DEMO-CS602", name: "Software Engineering", semester: 6, status: "ARCHIVED" },
];
