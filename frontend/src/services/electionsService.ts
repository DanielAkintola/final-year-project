import {
  mockCreateElection,
  mockListElections,
  mockUpdateElectionStatus,
} from './mockElectionsService';
import type { Election, ElectionFormValues, ElectionStatus } from '../types/election';

type ElectionsServiceMode = 'mock' | 'api';

export type ElectionsService = {
  listElections: () => Promise<Election[]>;
  createElection: (values: ElectionFormValues) => Promise<Election>;
  updateElectionStatus: (electionId: string, status: ElectionStatus) => Promise<Election>;
};

const mockElectionsService: ElectionsService = {
  listElections: mockListElections,
  createElection: mockCreateElection,
  updateElectionStatus: mockUpdateElectionStatus,
};

const apiElectionsService: ElectionsService = {
  async listElections() {
    throw new Error('API elections service is not configured yet. Set VITE_ELECTIONS_SERVICE=mock for local mode.');
  },
  async createElection() {
    throw new Error('API elections service is not configured yet. Set VITE_ELECTIONS_SERVICE=mock for local mode.');
  },
  async updateElectionStatus() {
    throw new Error('API elections service is not configured yet. Set VITE_ELECTIONS_SERVICE=mock for local mode.');
  },
};

const mode = ((import.meta.env.VITE_ELECTIONS_SERVICE as ElectionsServiceMode | undefined) ?? 'mock').toLowerCase();

export const electionsService: ElectionsService = mode === 'api' ? apiElectionsService : mockElectionsService;
