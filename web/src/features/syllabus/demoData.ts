import type { SyllabusBySubject, Unit } from "./types";

/**
 * STATIC DEMO DATA - illustrative outlines, not an official AKTU (or any university)
 * syllabus, and not read from any backend. Keys are subject ids from the Subjects
 * demo list. Edits are held in memory only and reset on page reload.
 */

function unit(subjectKey: string, number: number, title: string, topics: string[]): Unit {
  const id = `${subjectKey}-u${number}`;
  return {
    id,
    number,
    title,
    topics: topics.map((t, i) => ({ id: `${id}-t${i + 1}`, title: t })),
  };
}

export const DEMO_SYLLABUS: SyllabusBySubject = {
  // DEMO-CS301 Data Structures
  "demo-1": [
    unit("s1", 1, "Introduction and Algorithm Analysis", [
      "Abstract data types",
      "Arrays and their representation",
      "Asymptotic notations",
      "Time and space complexity",
      "Recursion",
    ]),
    unit("s1", 2, "Stacks and Queues", [
      "Stack operations and applications",
      "Infix to postfix conversion",
      "Queue and circular queue",
      "Priority queue",
      "Deque",
    ]),
    unit("s1", 3, "Linked Lists", [
      "Singly linked list",
      "Doubly linked list",
      "Circular linked list",
      "Polynomial representation",
    ]),
    unit("s1", 4, "Trees", [
      "Binary trees and traversals",
      "Binary search trees",
      "AVL trees",
      "B-trees",
      "Heaps and heap sort",
    ]),
    unit("s1", 5, "Graphs, Searching and Sorting", [
      "Graph representations",
      "Breadth-first and depth-first search",
      "Shortest path algorithms",
      "Hashing and collision resolution",
      "Sorting algorithms",
    ]),
  ],
  // DEMO-CS401 Operating Systems
  "demo-3": [
    unit("s3", 1, "Introduction and Process Management", [
      "Operating system structure",
      "Processes and threads",
      "Inter-process communication",
    ]),
    unit("s3", 2, "CPU Scheduling and Synchronisation", [
      "Scheduling algorithms",
      "Critical section problem",
      "Semaphores and monitors",
      "Deadlocks",
    ]),
    unit("s3", 3, "Memory Management", [
      "Paging and segmentation",
      "Virtual memory",
      "Page replacement algorithms",
    ]),
    unit("s3", 4, "File Systems and I/O", [
      "File allocation methods",
      "Directory structure",
      "Disk scheduling",
    ]),
  ],
  // DEMO-CS402 Database Management Systems
  "demo-4": [
    unit("s4", 1, "Introduction and ER Model", [
      "Database system architecture",
      "Entity-relationship modelling",
      "Keys and constraints",
    ]),
    unit("s4", 2, "Relational Model and SQL", [
      "Relational algebra",
      "SQL queries and joins",
      "Views and indexes",
    ]),
    unit("s4", 3, "Normalisation", [
      "Functional dependencies",
      "Normal forms up to BCNF",
      "Decomposition",
    ]),
    unit("s4", 4, "Transactions and Concurrency", [
      "ACID properties",
      "Serialisability",
      "Locking protocols",
      "Recovery techniques",
    ]),
  ],
  // Subjects without an entry (e.g. DEMO-CS302) intentionally show the empty state.
};
