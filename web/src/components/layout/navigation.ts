import type { IconName } from "../ui/Icon";

export interface NavItem {
  label: string;
  to: string;
  icon: IconName;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: "dashboard" }],
  },
  {
    heading: "Academic",
    items: [
      { label: "Subjects", to: "/subjects", icon: "subjects" },
      { label: "Syllabus", to: "/syllabus", icon: "syllabus" },
      { label: "Question Bank", to: "/questions", icon: "questions" },
    ],
  },
  {
    heading: "Examination",
    items: [{ label: "Paper Generator", to: "/papers", icon: "papers" }],
  },
  {
    heading: "Governance",
    items: [{ label: "Security", to: "/security", icon: "security" }],
  },
];
