import { AdminUsersPage } from '../pages/AdminUsersPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { BallotBuilderPage } from '../pages/BallotBuilderPage';
import { BiometricReviewPage } from '../pages/BiometricReviewPage';
import { CandidatesPage } from '../pages/CandidatesPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ElectionsPage } from '../pages/ElectionsPage';
import { GeographyPage } from '../pages/GeographyPage';
import { MonitoringPage } from '../pages/MonitoringPage';
import { PartiesPage } from '../pages/PartiesPage';
import { ResultsPage } from '../pages/ResultsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { VotersPage } from '../pages/VotersPage';
import type { ComponentType } from 'react';
import type { AdminRole } from '../types';

export type AdminRoute = {
  path: string;
  Component: ComponentType;
  allowedRoles: AdminRole[];
};

export const adminRoutes: AdminRoute[] = [
  {
    path: 'dashboard',
    Component: DashboardPage,
    allowedRoles: [
      'SUPER_ADMIN',
      'ELECTION_ADMIN',
      'REGISTRATION_OFFICER',
      'MONITORING_OFFICER',
      'RESULTS_OFFICER',
    ],
  },
  {
    path: 'elections',
    Component: ElectionsPage,
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: 'geography',
    Component: GeographyPage,
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: 'parties',
    Component: PartiesPage,
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: 'candidates',
    Component: CandidatesPage,
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: 'ballot-builder',
    Component: BallotBuilderPage,
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: 'voters',
    Component: VotersPage,
    allowedRoles: ['SUPER_ADMIN', 'REGISTRATION_OFFICER'],
  },
  {
    path: 'biometric-review',
    Component: BiometricReviewPage,
    allowedRoles: ['SUPER_ADMIN', 'REGISTRATION_OFFICER', 'MONITORING_OFFICER'],
  },
  {
    path: 'monitoring',
    Component: MonitoringPage,
    allowedRoles: ['SUPER_ADMIN', 'MONITORING_OFFICER'],
  },
  {
    path: 'results',
    Component: ResultsPage,
    allowedRoles: ['SUPER_ADMIN', 'RESULTS_OFFICER'],
  },
  {
    path: 'audit-logs',
    Component: AuditLogsPage,
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: 'admin-users',
    Component: AdminUsersPage,
    allowedRoles: ['SUPER_ADMIN'],
  },
  {
    path: 'settings',
    Component: SettingsPage,
    allowedRoles: ['SUPER_ADMIN'],
  },
];
