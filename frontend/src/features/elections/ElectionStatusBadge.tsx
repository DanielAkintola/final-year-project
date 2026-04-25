import { Badge } from '../../components/ui/Badge';
import { electionStatusLabels, electionStatusTones } from '../../data/elections';
import type { ElectionStatus } from '../../types/election';

type ElectionStatusBadgeProps = {
  status: ElectionStatus;
};

export function ElectionStatusBadge({ status }: ElectionStatusBadgeProps) {
  return <Badge tone={electionStatusTones[status]}>{electionStatusLabels[status]}</Badge>;
}
