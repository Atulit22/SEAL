import type { Difficulty, Question, QuestionStatus, QuestionType } from "./types";

/**
 * STATIC DEMO DATA - sample questions written for this prototype, not real examination
 * content, and not read from any backend. Subject/unit/topic ids point into the
 * Subjects and Syllabus demo data. Edits are held in memory only and reset on reload.
 * No answer keys are stored here.
 */

function q(
  n: number,
  topicPath: string, // e.g. "s1-u1-t3"
  type: QuestionType,
  marks: number,
  difficulty: Difficulty,
  status: QuestionStatus,
  text: string,
): Question {
  const [s, u] = topicPath.split("-");
  const subjectId = { s1: "demo-1", s3: "demo-3", s4: "demo-4" }[s] as string;
  return {
    id: `demo-q-${n}`,
    code: `DEMO-Q-${String(n).padStart(3, "0")}`,
    text,
    subjectId,
    unitId: `${s}-${u}`,
    topicId: topicPath,
    marks,
    difficulty,
    type,
    status,
    version: 1,
  };
}

export const DEMO_QUESTIONS: Question[] = [
  q(1, "s1-u1-t3", "MCQ", 1, "EASY", "APPROVED",
    "Which asymptotic notation describes a tight upper bound on the growth rate of a function?"),
  q(2, "s1-u1-t5", "SHORT_ANSWER", 2, "EASY", "APPROVED",
    "Define recursion and explain the role of the base case in a recursive function."),
  q(3, "s1-u1-t4", "LONG_ANSWER", 10, "MEDIUM", "APPROVED",
    "Explain time and space complexity with suitable examples, and derive the time complexity of binary search."),
  q(4, "s1-u2-t2", "NUMERICAL", 5, "MEDIUM", "APPROVED",
    "Convert the infix expression (A + B) * C - D / E to postfix and evaluate it for A = 2, B = 3, C = 4, D = 10, E = 5."),
  q(5, "s1-u2-t3", "SHORT_ANSWER", 2, "EASY", "DRAFT",
    "Differentiate between a linear queue and a circular queue."),
  q(6, "s1-u3-t2", "LONG_ANSWER", 10, "MEDIUM", "APPROVED",
    "Write algorithms to insert a node at a given position and to delete a node from a doubly linked list."),
  q(7, "s1-u4-t3", "LONG_ANSWER", 10, "HARD", "APPROVED",
    "Construct an AVL tree by inserting the keys 30, 20, 10, 25, 40, 50 and 60 in that order, showing each rotation."),
  q(8, "s1-u4-t5", "MCQ", 1, "MEDIUM", "DRAFT",
    "In a max-heap stored in an array with indexing from 1, at which index is the parent of the node at index i?"),
  q(9, "s1-u5-t3", "LONG_ANSWER", 10, "HARD", "DRAFT",
    "Explain Dijkstra's algorithm and show why it can give incorrect results on graphs with negative edge weights."),
  q(10, "s1-u5-t5", "SHORT_ANSWER", 5, "MEDIUM", "APPROVED",
    "Compare merge sort and quick sort with respect to worst-case time complexity, space usage and stability."),
  q(11, "s3-u2-t1", "NUMERICAL", 5, "MEDIUM", "APPROVED",
    "Four processes P1, P2, P3 and P4 arrive at time 0 with burst times 6, 8, 7 and 3 ms. Compute the average waiting time under non-preemptive SJF scheduling."),
  q(12, "s3-u2-t4", "SHORT_ANSWER", 5, "MEDIUM", "APPROVED",
    "State the four necessary conditions for a deadlock to occur in a system."),
  q(13, "s3-u3-t3", "LONG_ANSWER", 10, "HARD", "DRAFT",
    "Explain Belady's anomaly with an example using FIFO page replacement."),
  q(14, "s3-u4-t3", "MCQ", 1, "EASY", "ARCHIVED",
    "Which disk scheduling algorithm services requests strictly in the order in which they arrive?"),
  q(15, "s4-u1-t3", "MCQ", 1, "EASY", "APPROVED",
    "Which key uniquely identifies each tuple in a relation and cannot contain NULL values?"),
  q(16, "s4-u2-t2", "SHORT_ANSWER", 5, "MEDIUM", "DRAFT",
    "Write an SQL query to find the second highest salary from an Employee table."),
  q(17, "s4-u3-t2", "LONG_ANSWER", 10, "MEDIUM", "APPROVED",
    "Explain first, second and third normal forms and Boyce-Codd normal form with suitable examples."),
  q(18, "s4-u4-t1", "SHORT_ANSWER", 5, "EASY", "APPROVED",
    "Explain the ACID properties of a database transaction."),
];
