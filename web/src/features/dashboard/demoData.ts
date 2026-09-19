import type { BadgeTone } from "../../components/ui/Badge";
import type { IconName } from "../../components/ui/Icon";

/**
 * STATIC DEMO DATA - not read from any backend or database.
 * Replace with API-backed data once the backend exists.
 */

export interface SummaryCardData {
  title: string;
  value: string;
  caption: string;
  icon: IconName;
  /** Route to open; omitted when the module has no page yet. */
  to?: string;
}

export const SUMMARY_CARDS: SummaryCardData[] = [
  {
    title: "Subjects",
    value: "12",
    caption: "Subjects registered for the session",
    icon: "subjects",
    to: "/subjects",
  },
  {
    title: "Question Bank",
    value: "1,480",
    caption: "Questions across all units",
    icon: "questions",
    to: "/questions",
  },
  {
    title: "Active Exams",
    value: "3",
    caption: "Exams in the current cycle",
    icon: "exams",
  },
  {
    title: "Security Events",
    value: "7",
    caption: "Events recorded in the last 24 hours",
    icon: "security",
    to: "/security",
  },
];

export interface ActivityItem {
  id: string;
  time: string;
  actor: string;
  action: string;
  target: string;
  result: { label: string; tone: BadgeTone };
}

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "DEMO-EVT-0007",
    time: "10:42",
    actor: "demo.setter",
    action: "Submitted question set for review",
    target: "Subject DEMO-CS-301, Unit 2",
    result: { label: "Recorded", tone: "info" },
  },
  {
    id: "DEMO-EVT-0006",
    time: "10:15",
    actor: "demo.examiner",
    action: "Approved paper draft",
    target: "Paper DEMO-CS-2027-001, v2",
    result: { label: "Approved", tone: "success" },
  },
  {
    id: "DEMO-EVT-0005",
    time: "09:58",
    actor: "demo.admin",
    action: "Failed sign-in attempt",
    target: "Account demo.admin",
    result: { label: "Denied", tone: "warning" },
  },
  {
    id: "DEMO-EVT-0004",
    time: "09:30",
    actor: "demo.setter",
    action: "Updated syllabus mapping",
    target: "Subject DEMO-CS-302",
    result: { label: "Recorded", tone: "info" },
  },
  {
    id: "DEMO-EVT-0003",
    time: "Yesterday",
    actor: "demo.auditor",
    action: "Exported audit summary",
    target: "Session 2026-27",
    result: { label: "Completed", tone: "success" },
  },
];

export interface PlatformComponent {
  name: string;
  note: string;
}

/** Components that do not exist yet; listed so the dashboard is honest about scope. */
export const PLATFORM_COMPONENTS: PlatformComponent[] = [
  { name: "Backend API", note: "Not built" },
  { name: "Authentication and RBAC", note: "Not built" },
  { name: "Question generation", note: "Not built" },
  { name: "Encryption and release", note: "Not built" },
  { name: "Audit and risk engine", note: "Not built" },
];
