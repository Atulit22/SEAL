import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ModulePlaceholder } from "../components/ui/ModulePlaceholder";
import LoginPage from "../features/auth/LoginPage";
import DashboardPage from "../features/dashboard/DashboardPage";
import SubjectsPage from "../features/subjects/SubjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/subjects",
        element: <SubjectsPage />,
      },
      {
        path: "/syllabus",
        element: (
          <ModulePlaceholder
            title="Syllabus"
            description="Units and topics that questions are validated against."
          />
        ),
      },
      {
        path: "/questions",
        element: (
          <ModulePlaceholder
            title="Question Bank"
            description="Questions with subject, unit, marks, difficulty and version metadata."
          />
        ),
      },
      {
        path: "/papers",
        element: (
          <ModulePlaceholder
            title="Paper Generator"
            description="Assemble, review and version examination papers."
          />
        ),
      },
      {
        path: "/security",
        element: (
          <ModulePlaceholder
            title="Security"
            description="Audit trail, access events and risk indicators."
          />
        ),
      },
    ],
  },
]);
