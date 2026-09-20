import { getUnits } from "../questions/catalog";
import {
  DIFFICULTY_OPTIONS,
  TYPE_OPTIONS,
  statusLabel as questionStatusLabel,
  type Difficulty,
  type Question,
  type QuestionType,
} from "../questions/types";
import type { ConfigErrors, ConstraintCheck, PaperConfigForm, PaperEvaluation } from "./types";

export const MAX_TOTAL_MARKS = 200;
export const MAX_QUESTIONS = 50;
export const MIN_DURATION = 15;
export const MAX_DURATION = 360;
export const NAME_MAX = 80;
/** Allowed gap, in percentage points, between target and actual difficulty share. */
export const DIFFICULTY_TOLERANCE = 10;

const EPSILON = 1e-9;
const INTEGER = /^\d+$/;

const normalise = (s: string) => s.trim().replace(/\s+/g, " ");
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const percent = (n: number) => `${Math.round(n)}%`;

/** Whole number within [min, max], or null when the text is not one. */
function toInt(value: string, min: number, max: number): number | null {
  const text = value.trim();
  if (!INTEGER.test(text)) return null;
  const n = Number(text);
  return n >= min && n <= max ? n : null;
}

function parseGroup<K extends string>(
  keys: K[],
  values: Record<K, string>,
  min: number,
  max: number,
): Record<K, number> | null {
  const out = {} as Record<K, number>;
  for (const key of keys) {
    const n = toInt(values[key], min, max);
    if (n === null) return null;
    out[key] = n;
  }
  return out;
}

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/**
 * Deterministic validation of a paper configuration plus the current selection.
 *
 * `selected` is everything currently placed on the paper (any subject or status, so
 * inconsistencies are caught rather than assumed away); `pool` is the set of questions
 * that are eligible for the configured subject. Nothing here is AI-assisted, and an
 * invalid paper is reported, never silently accepted.
 */
export function evaluatePaper(
  form: PaperConfigForm,
  selected: Question[],
  pool: Question[],
): PaperEvaluation {
  const examName = normalise(form.examName);
  const total = toInt(form.totalMarks, 1, MAX_TOTAL_MARKS);
  const count = toInt(form.questionCount, 1, MAX_QUESTIONS);
  const duration = toInt(form.durationMinutes, MIN_DURATION, MAX_DURATION);

  const typeKeys = TYPE_OPTIONS.map((o) => o.value);
  const difficultyKeys = DIFFICULTY_OPTIONS.map((o) => o.value);
  const typeTargets = parseGroup<QuestionType>(typeKeys, form.typeCounts, 0, MAX_QUESTIONS);
  const difficultyTargets = parseGroup<Difficulty>(
    difficultyKeys,
    form.difficultyPercent,
    0,
    100,
  );

  const units = getUnits(form.subjectId);
  const unitTargets: Record<string, number> = {};
  let unitInputInvalid = false;
  for (const u of units) {
    const raw = (form.unitMarks[u.id] ?? "").trim();
    if (raw === "") continue;
    const n = toInt(raw, 0, MAX_TOTAL_MARKS);
    if (n === null) unitInputInvalid = true;
    else unitTargets[u.id] = n;
  }

  // ---- Setup (form-level) errors -------------------------------------------------
  const configErrors: ConfigErrors = {};
  if (examName === "") configErrors.examName = "Enter an exam or session name.";
  else if (examName.length > NAME_MAX) {
    configErrors.examName = `Keep the name to ${NAME_MAX} characters or fewer.`;
  }
  if (total === null) {
    configErrors.totalMarks = `Total marks must be a whole number from 1 to ${MAX_TOTAL_MARKS}.`;
  }
  if (count === null) {
    configErrors.questionCount = `Question count must be a whole number from 1 to ${MAX_QUESTIONS}.`;
  } else if (total !== null && count > total) {
    configErrors.questionCount = "Question count cannot exceed total marks (each question carries at least 1 mark).";
  }
  if (duration === null) {
    configErrors.durationMinutes = `Duration must be a whole number of minutes from ${MIN_DURATION} to ${MAX_DURATION}.`;
  }
  if (typeTargets === null) {
    configErrors.types = "Each question-type count must be a whole number (0 or more).";
  } else if (count !== null && sum(Object.values(typeTargets)) !== count) {
    configErrors.types = `Type counts add up to ${sum(Object.values(typeTargets))}; they must equal the question count (${count}).`;
  }
  if (difficultyTargets === null) {
    configErrors.difficulty = "Each difficulty share must be a whole number from 0 to 100.";
  } else if (sum(Object.values(difficultyTargets)) !== 100) {
    configErrors.difficulty = `Difficulty shares add up to ${sum(Object.values(difficultyTargets))}%; they must total 100%.`;
  }
  if (unitInputInvalid) {
    configErrors.units = "Unit targets must be whole numbers of marks (leave blank for no target).";
  } else if (total !== null && sum(Object.values(unitTargets)) > total) {
    configErrors.units = `Unit targets add up to ${sum(Object.values(unitTargets))} marks, more than the total (${total}).`;
  }

  // ---- Selection measurements ----------------------------------------------------
  const selectedMarks = sum(selected.map((q) => q.marks));
  const marksByDifficulty: Record<Difficulty, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  const countByType: Record<QuestionType, number> = {
    MCQ: 0,
    SHORT_ANSWER: 0,
    LONG_ANSWER: 0,
    NUMERICAL: 0,
  };
  const marksByUnit: Record<string, number> = {};
  for (const q of selected) {
    marksByDifficulty[q.difficulty] += q.marks;
    countByType[q.type] += 1;
    marksByUnit[q.unitId] = (marksByUnit[q.unitId] ?? 0) + q.marks;
  }

  const checks: ConstraintCheck[] = [];
  const add = (c: Omit<ConstraintCheck, "ok">) => checks.push({ ...c, ok: c.messages.length === 0 });

  // Setup
  const setupMessages = Object.values(configErrors).filter((m): m is string => Boolean(m));
  add({
    id: "setup",
    label: "Paper setup",
    required: "All setup fields valid",
    actual: setupMessages.length === 0 ? "Valid" : plural(setupMessages.length, "problem"),
    messages: setupMessages,
  });

  // Total marks
  const totalMessages: string[] = [];
  if (total === null) totalMessages.push("Set valid total marks in paper setup.");
  else if (selectedMarks !== total) {
    const diff = total - selectedMarks;
    totalMessages.push(
      `Selected questions add up to ${selectedMarks} marks; the paper requires ${total} (${Math.abs(diff)} ${diff > 0 ? "short" : "over"}).`,
    );
  }
  add({
    id: "total-marks",
    label: "Total marks",
    required: total === null ? "Not set" : `${total} marks`,
    actual: `${selectedMarks} marks`,
    messages: totalMessages,
  });

  // Question count
  const countMessages: string[] = [];
  if (count === null) countMessages.push("Set a valid question count in paper setup.");
  else if (selected.length !== count) {
    const diff = count - selected.length;
    countMessages.push(
      `${plural(selected.length, "question")} selected; the paper requires ${count} (${Math.abs(diff)} ${diff > 0 ? "more needed" : "too many"}).`,
    );
  }
  add({
    id: "question-count",
    label: "Question count",
    required: count === null ? "Not set" : plural(count, "question"),
    actual: plural(selected.length, "question"),
    messages: countMessages,
  });

  // Difficulty distribution (share of selected marks)
  const difficultyMessages: string[] = [];
  const difficultyTotalOk = difficultyTargets !== null && sum(Object.values(difficultyTargets)) === 100;
  if (!difficultyTotalOk) {
    difficultyMessages.push("Set difficulty shares that total 100% in paper setup.");
  } else if (selectedMarks === 0) {
    difficultyMessages.push("Select questions to check the difficulty distribution.");
  } else {
    for (const o of DIFFICULTY_OPTIONS) {
      const actual = (marksByDifficulty[o.value] / selectedMarks) * 100;
      const target = difficultyTargets[o.value];
      if (Math.abs(actual - target) > DIFFICULTY_TOLERANCE + EPSILON) {
        difficultyMessages.push(
          `${o.label}: ${percent(actual)} of marks selected; target ${target}% (allowed ±${DIFFICULTY_TOLERANCE}).`,
        );
      }
    }
  }
  add({
    id: "difficulty",
    label: "Difficulty distribution",
    required: difficultyTargets
      ? `${DIFFICULTY_OPTIONS.map((o) => `${o.label} ${difficultyTargets[o.value]}%`).join(" · ")} (±${DIFFICULTY_TOLERANCE})`
      : "Not set",
    actual: DIFFICULTY_OPTIONS.map(
      (o) =>
        `${o.label} ${selectedMarks === 0 ? "0%" : percent((marksByDifficulty[o.value] / selectedMarks) * 100)}`,
    ).join(" · "),
    messages: difficultyMessages,
  });

  // Question-type distribution (exact counts)
  const typeMessages: string[] = [];
  const typeTotalOk = typeTargets !== null && count !== null && sum(Object.values(typeTargets)) === count;
  if (!typeTotalOk) {
    typeMessages.push("Set type counts that add up to the question count in paper setup.");
  } else {
    for (const o of TYPE_OPTIONS) {
      if (countByType[o.value] !== typeTargets[o.value]) {
        typeMessages.push(
          `${o.label}: ${countByType[o.value]} selected; ${typeTargets[o.value]} required.`,
        );
      }
    }
  }
  add({
    id: "types",
    label: "Question-type distribution",
    required: typeTargets
      ? TYPE_OPTIONS.map((o) => `${o.label} ${typeTargets[o.value]}`).join(" · ")
      : "Not set",
    actual: TYPE_OPTIONS.map((o) => `${o.label} ${countByType[o.value]}`).join(" · "),
    messages: typeMessages,
  });

  // Unit coverage (exact marks for each targeted unit)
  const targetedUnits = units.filter((u) => u.id in unitTargets);
  const unitMessages: string[] = [];
  for (const u of targetedUnits) {
    const actual = marksByUnit[u.id] ?? 0;
    if (actual !== unitTargets[u.id]) {
      unitMessages.push(`Unit ${u.number}: ${actual} marks selected; ${unitTargets[u.id]} required.`);
    }
  }
  add({
    id: "units",
    label: "Unit coverage",
    required:
      targetedUnits.length === 0
        ? "No unit targets set"
        : targetedUnits.map((u) => `Unit ${u.number} ${unitTargets[u.id]}`).join(" · "),
    actual:
      targetedUnits.length === 0
        ? "-"
        : targetedUnits.map((u) => `Unit ${u.number} ${marksByUnit[u.id] ?? 0}`).join(" · "),
    messages: unitMessages,
  });

  // Topic coverage (each required topic needs at least one selected question)
  const topicIndex = new Map<string, { title: string; unit: number }>();
  for (const u of units) for (const t of u.topics) topicIndex.set(t.id, { title: t.title, unit: u.number });
  const requiredTopics = form.requiredTopicIds.filter((id) => topicIndex.has(id));
  const coveredTopics = new Set(selected.map((q) => q.topicId));
  const missingTopics = requiredTopics.filter((id) => !coveredTopics.has(id));
  add({
    id: "topics",
    label: "Topic coverage",
    required: requiredTopics.length === 0 ? "No required topics" : plural(requiredTopics.length, "required topic"),
    actual: requiredTopics.length === 0 ? "-" : `${requiredTopics.length - missingTopics.length} covered`,
    messages: missingTopics.map((id) => {
      const t = topicIndex.get(id);
      return `Topic not covered: ${t?.title} (Unit ${t?.unit}).`;
    }),
  });

  // Individual question marks
  const marksMessages: string[] = [];
  for (const q of selected) {
    if (!Number.isInteger(q.marks) || q.marks < 1) {
      marksMessages.push(`${q.code} has invalid marks (${q.marks}).`);
    } else if (total !== null && q.marks > total) {
      marksMessages.push(`${q.code} carries ${q.marks} marks, more than the paper total (${total}).`);
    }
  }
  add({
    id: "question-marks",
    label: "Question marks",
    required: total === null ? "Whole marks, at most the total" : `Whole marks, at most ${total}`,
    actual: selected.length === 0 ? "-" : `${marksMessages.length === 0 ? "All" : "Some"} valid`,
    messages: marksMessages,
  });

  // Subject consistency
  const wrongSubject = selected.filter((q) => q.subjectId !== form.subjectId);
  add({
    id: "subject",
    label: "Subject consistency",
    required: "All questions from the selected subject",
    actual:
      selected.length === 0
        ? "-"
        : wrongSubject.length === 0
          ? "Consistent"
          : `${plural(wrongSubject.length, "question")} from another subject`,
    messages: wrongSubject.map((q) => `${q.code} belongs to a different subject.`),
  });

  // Eligibility (only reviewed questions belong on a paper)
  const notApproved = selected.filter((q) => q.status !== "APPROVED");
  add({
    id: "eligibility",
    label: "Question status",
    required: "Approved questions only",
    actual:
      selected.length === 0
        ? "-"
        : notApproved.length === 0
          ? "All approved"
          : `${notApproved.length} not approved`,
    messages: notApproved.map((q) => `${q.code} is ${questionStatusLabel(q.status)}, not Approved.`),
  });

  // Availability of eligible questions for the subject
  const poolMarks = sum(pool.map((q) => q.marks));
  const availabilityMessages: string[] = [];
  if (total !== null && poolMarks < total) {
    availabilityMessages.push(
      `Only ${poolMarks} marks of Approved questions exist for this subject; the paper requires ${total}.`,
    );
  }
  if (count !== null && pool.length < count) {
    availabilityMessages.push(
      `Only ${plural(pool.length, "Approved question")} exist for this subject; the paper requires ${count}.`,
    );
  }
  add({
    id: "availability",
    label: "Question availability",
    required: `${total ?? "?"} marks · ${count === null ? "?" : plural(count, "question")}`,
    actual: `${poolMarks} marks · ${plural(pool.length, "question")} available`,
    messages: availabilityMessages,
  });

  const failedCount = checks.filter((c) => !c.ok).length;
  return {
    configErrors,
    checks,
    failedCount,
    valid: failedCount === 0,
    selectedCount: selected.length,
    selectedMarks,
    config: { examName, totalMarks: total, questionCount: count, durationMinutes: duration },
  };
}
