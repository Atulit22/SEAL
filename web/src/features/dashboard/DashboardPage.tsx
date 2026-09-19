import { Badge } from "../../components/ui/Badge";
import { PageHeader } from "../../components/ui/PageHeader";
import { PlatformStatus } from "./components/PlatformStatus";
import { RecentActivity } from "./components/RecentActivity";
import { SummaryCard } from "./components/SummaryCard";
import { SUMMARY_CARDS } from "./demoData";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Examination control"
        title="Dashboard"
        description="Overview of subjects, question bank, examinations and security activity."
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
      >
        <Badge tone="demo">Demo</Badge>
        <p>
          All figures and activity below are static sample data. No backend, database or
          authentication is connected yet.
        </p>
      </div>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <PlatformStatus />
      </div>
    </div>
  );
}
