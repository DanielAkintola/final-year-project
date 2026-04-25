import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import type { Election } from '../../types/election';
import { formatDateTime } from './electionUtils';

type ElectionTimelineProps = {
  election: Election;
};

export function ElectionTimeline({ election }: ElectionTimelineProps) {
  const events = [
    { label: 'Registration Opens', value: election.registrationStartsAt },
    { label: 'Registration Closes', value: election.registrationEndsAt },
    { label: 'Voting Opens', value: election.votingStartsAt },
    { label: 'Voting Closes', value: election.votingEndsAt },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Election Timeline</CardTitle>
        <CardDescription>These dates will later control mobile voting access and admin monitoring.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="timeline-list">
          {events.map((event) => (
            <li key={event.label}>
              <span />
              <div>
                <strong>{event.label}</strong>
                <p>{formatDateTime(event.value)}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
