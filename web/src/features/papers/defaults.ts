import type { PaperConfigForm } from "./types";

/** Starting setup for a subject: a small, plausible demo configuration. */
export function defaultConfigForm(subjectId: string): PaperConfigForm {
  return {
    subjectId,
    examName: "Demo End-Semester Examination 2026-27",
    totalMarks: "30",
    questionCount: "4",
    durationMinutes: "90",
    typeCounts: { MCQ: "0", SHORT_ANSWER: "1", LONG_ANSWER: "2", NUMERICAL: "1" },
    difficultyPercent: { EASY: "10", MEDIUM: "60", HARD: "30" },
    unitMarks: {},
    requiredTopicIds: [],
  };
}
