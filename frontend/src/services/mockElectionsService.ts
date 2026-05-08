import { applyElectionStatus, createElectionFromForm } from '../features/elections/electionUtils';
import type { Election, ElectionFormValues, ElectionStatus } from '../types/election';

const MOCK_ELECTIONS_KEY = 'ondo-vote-mock-elections';

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function parseElections(): Election[] {
  try {
    const raw = window.localStorage.getItem(MOCK_ELECTIONS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as Election[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function clearStorageOnFirstLoad() {
  // Clear preloaded mock data on initialization
  const hasCleared = window.localStorage.getItem('ondo-vote-cleared-preload');
  if (!hasCleared) {
    window.localStorage.removeItem(MOCK_ELECTIONS_KEY);
    window.localStorage.setItem('ondo-vote-cleared-preload', 'true');
  }
}

function saveElections(elections: Election[]) {
  window.localStorage.setItem(MOCK_ELECTIONS_KEY, JSON.stringify(elections));
}

export async function mockListElections(): Promise<Election[]> {
  clearStorageOnFirstLoad();
  await delay(220);
  return parseElections().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function mockCreateElection(values: ElectionFormValues): Promise<Election> {
  await delay(300);

  const createdElection = createElectionFromForm(values);
  const elections = parseElections();
  const next = [createdElection, ...elections];

  saveElections(next);
  return createdElection;
}

export async function mockUpdateElectionStatus(electionId: string, status: ElectionStatus): Promise<Election> {
  await delay(250);

  const elections = parseElections();
  const target = elections.find((election) => election.id === electionId);

  if (!target) {
    throw new Error('Election not found. Refresh and try again.');
  }

  const updatedElection = applyElectionStatus(target, status);
  const next = elections.map((election) => (election.id === updatedElection.id ? updatedElection : election));

  saveElections(next);
  return updatedElection;
}
