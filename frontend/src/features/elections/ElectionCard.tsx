import { CalendarDays, Clock3, ShieldCheck } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import type { Election } from '../../types/election';
import { ElectionStatusBadge } from './ElectionStatusBadge';
import { formatDateTime } from './electionUtils';

type ElectionCardProps = {
  election: Election;
  isSelected: boolean;
  onSelect: () => void;
};

export function ElectionCard({ election, isSelected, onSelect }: ElectionCardProps) {
  return (
    <Card className={isSelected ? 'election-card selected' : 'election-card'}>
      <CardHeader>
        <div className="card-title-with-badge">
          <CardTitle>{election.title}</CardTitle>
          <ElectionStatusBadge status={election.status} />
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="meta-list">
          <span>
            <CalendarDays size={16} />
            Election: {formatDateTime(election.electionDate)}
          </span>
          <span>
            <Clock3 size={16} />
            Voting: {formatDateTime(election.votingStartsAt)} - {formatDateTime(election.votingEndsAt)}
          </span>
          <span>
            <ShieldCheck size={16} />
            Face verification {election.rules.requireFaceVerification ? 'required' : 'optional'}
          </span>
        </div>
        <Button onClick={onSelect} variant={isSelected ? 'secondary' : 'primary'}>
          {isSelected ? 'Selected' : 'Review Election'}
        </Button>
      </CardContent>
    </Card>
  );
}
