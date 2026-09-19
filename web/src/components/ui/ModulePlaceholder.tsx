import { Badge } from "./Badge";
import { PageHeader } from "./PageHeader";

interface ModulePlaceholderProps {
  title: string;
  description: string;
}

/** Stand-in body for routes whose feature is not built yet. */
export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <Badge tone="neutral">Not implemented</Badge>
        <p className="mt-3 max-w-md text-sm text-slate-500">
          This module is a placeholder. Only the application shell exists at this stage.
        </p>
      </div>
    </div>
  );
}
