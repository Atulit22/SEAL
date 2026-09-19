import { Badge, type BadgeTone } from "../../../components/ui/Badge";
import { statusLabel, type SubjectStatus } from "../types";

const TONES: Record<SubjectStatus, BadgeTone> = {
  ACTIVE: "success",
  DRAFT: "info",
  ARCHIVED: "neutral",
};

export function SubjectStatusBadge({ status }: { status: SubjectStatus }) {
  return <Badge tone={TONES[status]}>{statusLabel(status)}</Badge>;
}
