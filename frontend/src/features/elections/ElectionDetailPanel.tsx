import { Pause, Play, Send, StopCircle } from 'lucide-react';

import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import type { Election, ElectionStatus } from '../../types/election';
import { ElectionStatusBadge } from './ElectionStatusBadge';
import { formatDateTime } from './electionUtils';

type ElectionDetailPanelProps = {
  election: Election;
  onStatusChange: (status: ElectionStatus) => void;
};

export function ElectionDetailPanel({ election, onStatusChange }: ElectionDetailPanelProps) {
  return (
    <Card className="election-detail-card">
      <CardHeader>
        <div className="card-title-with-badge">
          <CardTitle>{election.title}</CardTitle>
          <ElectionStatusBadge status={election.status} />
        </div>
        <CardDescription>{election.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="detail-grid">
          <DetailItem label="Office" value="Governorship" />
          <DetailItem label="State" value={election.state} />
          <DetailItem label="Election Date" value={formatDateTime(election.electionDate)} />
          <DetailItem label="Registration Window" value={`${formatDateTime(election.registrationStartsAt)} - ${formatDateTime(election.registrationEndsAt)}`} />
          <DetailItem label="Voting Window" value={`${formatDateTime(election.votingStartsAt)} - ${formatDateTime(election.votingEndsAt)}`} />
          <DetailItem label="Last Updated" value={formatDateTime(election.updatedAt)} />
        </div>

        <div className="rules-summary">
          <strong>Configured Rules</strong>
          <ul>
            <li>One vote per voter: {election.rules.allowOneVotePerVoter ? 'Enabled' : 'Disabled'}</li>
            <li>Face verification: {election.rules.requireFaceVerification ? 'Required' : 'Optional'}</li>
            <li>Fingerprint verification: {election.rules.requireFingerprintVerification ? 'Required' : 'Optional'}</li>
            <li>Results before close: {election.rules.allowResultsBeforeClose ? 'Allowed' : 'Blocked'}</li>
          </ul>
        </div>

        <div className="action-row">
          {election.status === 'DRAFT' ? (
            <Button onClick={() => onStatusChange('PUBLISHED')}>
              <Send size={16} />
              Publish
            </Button>
          ) : null}
          {election.status === 'PUBLISHED' || election.status === 'PAUSED' ? (
            <Button onClick={() => onStatusChange('ACTIVE')}>
              <Play size={16} />
              Activate
            </Button>
          ) : null}
          {election.status === 'ACTIVE' ? (
            <Button onClick={() => onStatusChange('PAUSED')} variant="secondary">
              <Pause size={16} />
              Pause
            </Button>
          ) : null}
          {election.status !== 'CLOSED' && election.status !== 'ARCHIVED' ? (
            <Button onClick={() => onStatusChange('CLOSED')} variant="danger">
              <StopCircle size={16} />
              Close
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
