import { useMemo, useState } from 'react';
import { Activity, AlertTriangle, RefreshCcw, ShieldAlert, Users } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { mockTurnoutStats } from '../mocks/data';

type MonitorEvent = {
  id: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: string;
};

const seededEvents: MonitorEvent[] = [
  {
    id: 'evt-1',
    type: 'WARNING',
    message: 'Spike in failed biometric attempts in Akure South ward 2.',
    timestamp: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
  },
  {
    id: 'evt-2',
    type: 'INFO',
    message: 'Turnout crossed 72% in lga-1.',
    timestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
  },
  {
    id: 'evt-3',
    type: 'CRITICAL',
    message: 'Duplicate vote attempt blocked at polling unit PS2-AKR.',
    timestamp: new Date(Date.now() - 1000 * 60 * 52).toISOString(),
  },
];

export function MonitoringPage() {
  const [totalVotesCast, setTotalVotesCast] = useState(mockTurnoutStats.totalVotesCast);
  const [failedBiometricAttempts, setFailedBiometricAttempts] = useState(mockTurnoutStats.failedBiometricAttempts);
  const [duplicateVoteAttempts, setDuplicateVoteAttempts] = useState(mockTurnoutStats.duplicateVoteAttempts);
  const [events, setEvents] = useState<MonitorEvent[]>(seededEvents);

  const turnoutPercent = useMemo(
    () => Math.round((totalVotesCast / mockTurnoutStats.totalRegisteredVoters) * 100),
    [totalVotesCast],
  );

  function refreshSnapshot() {
    const addedVotes = Math.floor(Math.random() * 1400) + 250;
    const biometricDelta = Math.floor(Math.random() * 4);
    const duplicateDelta = Math.random() > 0.7 ? 1 : 0;

    setTotalVotesCast((current) => Math.min(current + addedVotes, mockTurnoutStats.totalRegisteredVoters));
    setFailedBiometricAttempts((current) => current + biometricDelta);
    setDuplicateVoteAttempts((current) => current + duplicateDelta);

    const nextEvent: MonitorEvent = {
      id: `evt-${Date.now()}`,
      type: duplicateDelta > 0 ? 'CRITICAL' : biometricDelta > 1 ? 'WARNING' : 'INFO',
      message:
        duplicateDelta > 0
          ? 'Duplicate vote attempt intercepted and logged.'
          : biometricDelta > 1
            ? 'Biometric retry alerts increased in the last interval.'
            : 'Turnout update received from polling units.',
      timestamp: new Date().toISOString(),
    };

    setEvents((current) => [nextEvent, ...current].slice(0, 12));
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Monitoring"
        description="Track live turnout, detect risky activity, and keep election operations stable in real time."
      />

      <div className="stats-grid stats-grid-wide">
        <Card className="stat-card">
          <span>Total Votes Cast</span>
          <strong>{totalVotesCast.toLocaleString()}</strong>
          <small>Registered voters: {mockTurnoutStats.totalRegisteredVoters.toLocaleString()}</small>
        </Card>
        <Card className="stat-card">
          <span>Turnout Coverage</span>
          <strong>{turnoutPercent}%</strong>
          <small>Live rolling update</small>
        </Card>
        <Card className="stat-card">
          <span>System Alerts</span>
          <strong>{failedBiometricAttempts + duplicateVoteAttempts}</strong>
          <small>Biometric + duplicate vote alerts</small>
        </Card>
      </div>

      <div className="dashboard-summary-grid">
        <Card>
          <CardHeader>
            <CardTitle>Operational Health</CardTitle>
            <CardDescription>High risk metrics that need immediate attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="dashboard-alert-grid">
              <div className="dashboard-alert" data-tone="warning">
                <span>
                  <AlertTriangle size={16} /> Failed biometric attempts
                </span>
                <strong>{failedBiometricAttempts}</strong>
              </div>
              <div className="dashboard-alert" data-tone="danger">
                <span>
                  <ShieldAlert size={16} /> Duplicate vote attempts
                </span>
                <strong>{duplicateVoteAttempts}</strong>
              </div>
              <div className="dashboard-alert dashboard-alert-wide" data-tone="info">
                <span>
                  <Users size={16} /> Participation trend
                </span>
                <strong>{turnoutPercent >= 75 ? 'Strong turnout' : 'Moderate turnout'}</strong>
                <small>Use this signal to allocate field officers.</small>
              </div>
            </div>
            <div className="geo-form-actions" style={{ marginTop: 16 }}>
              <Button type="button" onClick={refreshSnapshot}>
                <RefreshCcw size={16} />
                Refresh Snapshot
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
            <CardDescription>Latest field updates and automated anomaly detections.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="dashboard-activity-list">
              {events.map((event) => (
                <article className="dashboard-activity" key={event.id}>
                  <div>
                    <strong>
                      <Activity size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
                      {event.message}
                    </strong>
                    <p>
                      Severity:{' '}
                      <Badge tone={event.type === 'CRITICAL' ? 'danger' : event.type === 'WARNING' ? 'warning' : 'info'}>
                        {event.type}
                      </Badge>
                    </p>
                  </div>
                  <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
