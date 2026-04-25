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

export const adminRoutes = [
  { path: 'dashboard', Component: DashboardPage },
  { path: 'elections', Component: ElectionsPage },
  { path: 'geography', Component: GeographyPage },
  { path: 'parties', Component: PartiesPage },
  { path: 'candidates', Component: CandidatesPage },
  { path: 'ballot-builder', Component: BallotBuilderPage },
  { path: 'voters', Component: VotersPage },
  { path: 'biometric-review', Component: BiometricReviewPage },
  { path: 'monitoring', Component: MonitoringPage },
  { path: 'results', Component: ResultsPage },
  { path: 'audit-logs', Component: AuditLogsPage },
  { path: 'admin-users', Component: AdminUsersPage },
  { path: 'settings', Component: SettingsPage },
];
