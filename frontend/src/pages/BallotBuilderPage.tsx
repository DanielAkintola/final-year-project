import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, ListChecks, Plus, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Select } from '../components/ui/Form';

type CandidateRecord = {
  id: string;
  name: string;
  party: string;
  election: string;
  status: 'DRAFT' | 'APPROVED' | 'DISQUALIFIED' | 'WITHDRAWN';
};

type BallotRecord = {
  id: string;
  election: string;
  title: string;
  version: number;
  status: 'DRAFT' | 'PUBLISHED';
  candidateIds: string[];
  createdAt: string;
  publishedAt?: string;
};

const CANDIDATES_KEY = 'ondo-candidates';
const BALLOTS_KEY = 'ondo-ballots';

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function loadCandidates(): CandidateRecord[] {
  try {
    const raw = localStorage.getItem(CANDIDATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CandidateRecord[];
  } catch {
    return [];
  }
}

function loadBallots(): BallotRecord[] {
  try {
    const raw = localStorage.getItem(BALLOTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BallotRecord[];
  } catch {
    return [];
  }
}

export function BallotBuilderPage() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [ballots, setBallots] = useState<BallotRecord[]>([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const loadedCandidates = loadCandidates();
    setCandidates(loadedCandidates);

    const loadedBallots = loadBallots();
    setBallots(loadedBallots);

    const firstElection = loadedCandidates.find((candidate) => candidate.election)?.election ?? 'elec-1';
    setSelectedElection(firstElection);
  }, []);

  useEffect(() => {
    localStorage.setItem(BALLOTS_KEY, JSON.stringify(ballots));
  }, [ballots]);

  const approvedCandidates = useMemo(
    () =>
      candidates.filter(
        (candidate) => candidate.status === 'APPROVED' && candidate.election === selectedElection,
      ),
    [candidates, selectedElection],
  );

  const currentBallot = useMemo(
    () =>
      ballots
        .filter((ballot) => ballot.election === selectedElection)
        .sort((a, b) => b.version - a.version)[0] ?? null,
    [ballots, selectedElection],
  );

  useEffect(() => {
    if (currentBallot) {
      setSelectedCandidateIds(currentBallot.candidateIds);
      return;
    }
    setSelectedCandidateIds(approvedCandidates.map((candidate) => candidate.id));
  }, [currentBallot, approvedCandidates]);

  function showFeedback(message: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message, type });
    window.setTimeout(() => setFeedback(null), 2500);
  }

  function moveCandidate(id: string, direction: 'up' | 'down') {
    const index = selectedCandidateIds.indexOf(id);
    if (index < 0) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedCandidateIds.length - 1) return;

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    const next = [...selectedCandidateIds];
    const [removed] = next.splice(index, 1);
    next.splice(nextIndex, 0, removed);
    setSelectedCandidateIds(next);
  }

  function toggleCandidate(id: string) {
    if (selectedCandidateIds.includes(id)) {
      setSelectedCandidateIds((current) => current.filter((item) => item !== id));
      return;
    }
    setSelectedCandidateIds((current) => [...current, id]);
  }

  function saveDraft() {
    if (!selectedElection) {
      showFeedback('Select an election first.', 'error');
      return;
    }
    if (selectedCandidateIds.length === 0) {
      showFeedback('Add at least one approved candidate to the ballot.', 'error');
      return;
    }

    const latestVersion =
      ballots
        .filter((ballot) => ballot.election === selectedElection)
        .reduce((maxVersion, ballot) => Math.max(maxVersion, ballot.version), 0) + 1;

    const draft: BallotRecord = {
      id: createId('ballot'),
      election: selectedElection,
      title: `Ballot ${selectedElection.toUpperCase()} v${latestVersion}`,
      version: latestVersion,
      status: 'DRAFT',
      candidateIds: selectedCandidateIds,
      createdAt: new Date().toISOString(),
    };

    setBallots((current) => [draft, ...current]);
    showFeedback(`Draft ballot v${latestVersion} saved.`);
  }

  function publishBallot() {
    if (!currentBallot) {
      showFeedback('Save a draft before publishing.', 'error');
      return;
    }

    setBallots((current) =>
      current.map((ballot) =>
        ballot.id === currentBallot.id
          ? { ...ballot, status: 'PUBLISHED', publishedAt: new Date().toISOString() }
          : ballot,
      ),
    );
    showFeedback(`Ballot v${currentBallot.version} published.`);
  }

  const selectedCandidates = selectedCandidateIds
    .map((id) => approvedCandidates.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is CandidateRecord => Boolean(candidate));

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Ballot Builder"
        description="Compose candidate order, save draft ballot versions, and publish final ballots for each election."
      />

      {feedback && (
        <div className={`geo-feedback ${feedback.type === 'success' ? 'geo-feedback-success' : 'geo-feedback-error'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>Ballot Composer</CardTitle>
            <CardDescription>Pick an election and arrange approved candidates in display order.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Election</FieldLabel>
              <Select value={selectedElection} onChange={(event) => setSelectedElection(event.target.value)}>
                {Array.from(new Set(candidates.map((candidate) => candidate.election))).map((electionId) => (
                  <option key={electionId} value={electionId}>
                    {electionId}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="geo-table" style={{ marginTop: 16 }}>
              <div className="geo-table-header">
                <div className="geo-col-name">Candidate</div>
                <div className="geo-col-code">Party</div>
                <div className="geo-col-status">Included</div>
                <div className="geo-col-actions">Actions</div>
              </div>
              <div className="geo-table-body">
                {approvedCandidates.map((candidate) => {
                  const included = selectedCandidateIds.includes(candidate.id);
                  return (
                    <div key={candidate.id} className="geo-table-row">
                      <div className="geo-col-name">
                        <strong>{candidate.name}</strong>
                      </div>
                      <div className="geo-col-code">{candidate.party}</div>
                      <div className="geo-col-status">
                        <span className={`geo-status-badge ${included ? 'geo-status-active' : 'geo-status-inactive'}`}>
                          {included ? 'Selected' : 'Excluded'}
                        </span>
                      </div>
                      <div className="geo-col-actions">
                        <Button type="button" variant="ghost" onClick={() => toggleCandidate(candidate.id)}>
                          {included ? 'Remove' : 'Add'}
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => moveCandidate(candidate.id, 'up')}>
                          <ArrowUp size={16} />
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => moveCandidate(candidate.id, 'down')}>
                          <ArrowDown size={16} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="geo-form-actions" style={{ marginTop: 16 }}>
              <Button type="button" onClick={saveDraft}>
                <Plus size={16} />
                Save Draft
              </Button>
              <Button type="button" variant="secondary" onClick={publishBallot}>
                Publish Current
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <CardTitle>Current Ballot Snapshot</CardTitle>
            <CardDescription>
              {currentBallot
                ? `Version ${currentBallot.version} (${currentBallot.status})`
                : 'No ballot version saved yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-empty-state" style={{ alignItems: 'flex-start', textAlign: 'left' }}>
              <ListChecks size={20} />
              {selectedCandidates.length === 0 ? (
                <p className="geo-empty-title">No candidates selected for this ballot.</p>
              ) : (
                <ol style={{ margin: 0, paddingLeft: 18, width: '100%' }}>
                  {selectedCandidates.map((candidate) => (
                    <li key={candidate.id} style={{ marginBottom: 10 }}>
                      <strong>{candidate.name}</strong> <span style={{ color: '#64748B' }}>({candidate.party})</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
