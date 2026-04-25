import { useState } from 'react';

import { PageHeader } from '../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { initialElectionForm, seedElections } from '../data/elections';
import { ElectionCard } from '../features/elections/ElectionCard';
import { ElectionDetailPanel } from '../features/elections/ElectionDetailPanel';
import { ElectionForm } from '../features/elections/ElectionForm';
import { ElectionTimeline } from '../features/elections/ElectionTimeline';
import { applyElectionStatus, createElectionFromForm } from '../features/elections/electionUtils';
import type { Election, ElectionFormValues, ElectionStatus } from '../types/election';

export function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>(seedElections);
  const [selectedElectionId, setSelectedElectionId] = useState(seedElections[0]?.id);
  const [formValues, setFormValues] = useState<ElectionFormValues>(initialElectionForm);

  const selectedElection = elections.find((election) => election.id === selectedElectionId) ?? elections[0];

  function createElection() {
    const election = createElectionFromForm(formValues);

    setElections((current) => [election, ...current]);
    setSelectedElectionId(election.id);
    setFormValues(initialElectionForm);
  }

  function updateSelectedElectionStatus(status: ElectionStatus) {
    if (!selectedElection) {
      return;
    }

    setElections((current) =>
      current.map((election) =>
        election.id === selectedElection.id ? applyElectionStatus(election, status) : election
      )
    );
  }

  return (
    <>
      <PageHeader
        description="Create the core election object, control lifecycle status, and define the rules that later power candidates, ballots, monitoring, and results."
        eyebrow="Election Setup"
        title="Build the Ondo governorship election foundation."
      />

      <section className="elections-layout">
        <div className="elections-main">
          <Card>
            <CardHeader>
              <CardTitle>Configured Elections</CardTitle>
              <CardDescription>Select an election to inspect lifecycle, rules, and timing.</CardDescription>
            </CardHeader>
            <CardContent className="election-list">
              {elections.map((election) => (
                <ElectionCard
                  election={election}
                  isSelected={election.id === selectedElection?.id}
                  key={election.id}
                  onSelect={() => setSelectedElectionId(election.id)}
                />
              ))}
            </CardContent>
          </Card>

          <ElectionForm values={formValues} onChange={setFormValues} onSubmit={createElection} />
        </div>

        <aside className="elections-side">
          {selectedElection ? (
            <>
              <ElectionDetailPanel election={selectedElection} onStatusChange={updateSelectedElectionStatus} />
              <ElectionTimeline election={selectedElection} />
            </>
          ) : null}
        </aside>
      </section>
    </>
  );
}
