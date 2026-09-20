import type { Topic, Unit, UnitView } from "./types";

/**
 * Pure list operations on one subject's units. They return new arrays and never
 * mutate their input, so they are easy to test and to swap for API calls later.
 */

export function addUnit(units: Unit[], unit: Unit): Unit[] {
  return [...units, unit];
}

export function updateUnit(
  units: Unit[],
  id: string,
  patch: { number: number; title: string },
): Unit[] {
  return units.map((u) => (u.id === id ? { ...u, ...patch } : u));
}

export function deleteUnit(units: Unit[], id: string): Unit[] {
  return units.filter((u) => u.id !== id);
}

export function addTopic(units: Unit[], unitId: string, topic: Topic): Unit[] {
  return units.map((u) => (u.id === unitId ? { ...u, topics: [...u.topics, topic] } : u));
}

export function updateTopic(units: Unit[], unitId: string, topicId: string, title: string): Unit[] {
  return units.map((u) =>
    u.id === unitId
      ? { ...u, topics: u.topics.map((t) => (t.id === topicId ? { ...t, title } : t)) }
      : u,
  );
}

export function deleteTopic(units: Unit[], unitId: string, topicId: string): Unit[] {
  return units.map((u) =>
    u.id === unitId ? { ...u, topics: u.topics.filter((t) => t.id !== topicId) } : u,
  );
}

/**
 * Units ordered by number, filtered by a case-insensitive query. A unit whose number
 * or title matches is kept whole; otherwise only its matching topics are kept.
 */
export function filterUnits(units: Unit[], query: string): UnitView[] {
  const q = query.trim().toLowerCase();
  const sorted = [...units].sort((a, b) => a.number - b.number);
  if (q === "") return sorted.map((unit) => ({ unit, topics: unit.topics }));

  const views: UnitView[] = [];
  for (const unit of sorted) {
    const unitMatches = `unit ${unit.number}`.includes(q) || unit.title.toLowerCase().includes(q);
    const topics = unitMatches
      ? unit.topics
      : unit.topics.filter((t) => t.title.toLowerCase().includes(q));
    if (unitMatches || topics.length > 0) views.push({ unit, topics });
  }
  return views;
}
