import { typeLabel, type Question, type QuestionType } from "../questions/types";

export interface PaperSectionQuestion {
  number: number;
  question: Question;
}

export interface PaperSection {
  key: QuestionType;
  /** e.g. "Section A". */
  name: string;
  title: string;
  marks: number;
  questions: PaperSectionQuestion[];
}

const SECTION_ORDER: QuestionType[] = ["MCQ", "SHORT_ANSWER", "LONG_ANSWER", "NUMERICAL"];

/**
 * Lay the selection out as paper sections, one per question type present, with
 * continuous question numbers. Questions keep the order in which they were selected.
 */
export function buildPaperStructure(selected: Question[]): PaperSection[] {
  const sections: PaperSection[] = [];
  let number = 1;
  for (const type of SECTION_ORDER) {
    const inSection = selected.filter((q) => q.type === type);
    if (inSection.length === 0) continue;
    sections.push({
      key: type,
      name: `Section ${String.fromCharCode(65 + sections.length)}`,
      title: `${typeLabel(type)} questions`,
      marks: inSection.reduce((n, q) => n + q.marks, 0),
      questions: inSection.map((question) => ({ number: number++, question })),
    });
  }
  return sections;
}
