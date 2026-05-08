import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '../components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { initialElectionForm } from '../data/elections';
import { ElectionCard } from '../features/elections/ElectionCard';
import { ElectionDetailPanel } from '../features/elections/ElectionDetailPanel';
import { ElectionForm } from '../features/elections/ElectionForm';
import { ElectionTimeline } from '../features/elections/ElectionTimeline';
import { electionsService } from '../services/electionsService';
import type { Election, ElectionFormValues, ElectionStatus } from '../types/election';

export function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<string | undefined>(undefined);
  const [formValues, setFormValues] = useState<ElectionFormValues>(initialElectionForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadElections() {
      setIsLoading(true);
      setError(null);

      try {
        const loadedElections = await electionsService.listElections();

        if (!isMounted) {
          return;
        }

        setElections(loadedElections);
        setSelectedElectionId((current) => current ?? loadedElections[0]?.id);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        const message = loadError instanceof Error ? loadError.message : 'Failed to load elections.';
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadElections();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedElection = useMemo(
    () => elections.find((election) => election.id === selectedElectionId) ?? elections[0],
    [elections, selectedElectionId]
  );

  async function createElection() {
    setIsSaving(true);
    setError(null);

    try {
      const election = await electionsService.createElection(formValues);

      setElections((current) => [election, ...current]);
      setSelectedElectionId(election.id);
      setFormValues(initialElectionForm);
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Failed to create election.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function updateSelectedElectionStatus(status: ElectionStatus) {
    if (!selectedElection) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updatedElection = await electionsService.updateElectionStatus(selectedElection.id, status);

      setElections((current) =>
        current.map((election) => (election.id === updatedElection.id ? updatedElection : election))
      );
    } catch (statusError) {
      const message = statusError instanceof Error ? statusError.message : 'Failed to update election status.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
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
              {isLoading ? <p>Loading elections...</p> : null}
              {!isLoading && elections.length === 0 ? <p>No elections found yet.</p> : null}
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

          {error ? <p role="alert">{error}</p> : null}

          <ElectionForm
            disabled={isLoading || isSaving}
            values={formValues}
            onChange={setFormValues}
            onSubmit={createElection}
          />
        </div>

        <aside className="elections-side">
          {selectedElection ? (
            <>
              <ElectionDetailPanel
                disabled={isLoading || isSaving}
                election={selectedElection}
                onStatusChange={updateSelectedElectionStatus}
              />
              <ElectionTimeline election={selectedElection} />
            </>
          ) : null}
        </aside>
      </section>
    </>
  );
}
