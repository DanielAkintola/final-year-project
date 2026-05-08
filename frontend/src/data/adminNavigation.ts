import {
  Activity,
  BadgeCheck,
  BarChart3,
  ClipboardList,
  Fingerprint,
  Flag,
  LayoutDashboard,
  MapPinned,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Vote,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { AdminRole } from '../types';

export type AdminSectionStatus = 'Foundation' | 'Next' | 'Later';

export type AdminNavItem = {
  path: string;
  label: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
  status: AdminSectionStatus;
  allowedRoles: AdminRole[];
};

export const adminNavigation: AdminNavItem[] = [
  {
    path: '/app/dashboard',
    label: 'Dashboard',
    description: 'Election readiness, turnout, alerts, and system status.',
    icon: LayoutDashboard,
    status: 'Foundation',
    allowedRoles: [
      'SUPER_ADMIN',
      'ELECTION_ADMIN',
      'REGISTRATION_OFFICER',
      'MONITORING_OFFICER',
      'RESULTS_OFFICER',
    ],
  },
  {
    path: '/app/elections',
    label: 'Elections',
    description: 'Create, publish, pause, close, and archive elections.',
    icon: Vote,
    status: 'Foundation',
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: '/app/geography',
    label: 'Geography',
    description: 'Manage LGAs, wards, and polling units.',
    icon: MapPinned,
    status: 'Foundation',
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: '/app/parties',
    label: 'Parties',
    description: 'Create parties, logos, colors, and active status.',
    icon: Flag,
    status: 'Foundation',
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: '/app/candidates',
    label: 'Candidates',
    description: 'Manage candidates, deputies, photos, and approval status.',
    icon: BadgeCheck,
    status: 'Foundation',
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: '/app/ballot-builder',
    label: 'Ballot Builder',
    description: 'Preview, order, validate, and publish ballot versions.',
    icon: ClipboardList,
    status: 'Next',
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: '/app/voters',
    label: 'Voters',
    description: 'Search, approve, suspend, import, and transfer voters.',
    icon: Users,
    status: 'Next',
    allowedRoles: ['SUPER_ADMIN', 'REGISTRATION_OFFICER'],
  },
  {
    path: '/app/biometric-review',
    label: 'Biometric Review',
    description: 'Review enrollment, failed matches, duplicate alerts, and flags.',
    icon: Fingerprint,
    status: 'Next',
    allowedRoles: ['SUPER_ADMIN', 'REGISTRATION_OFFICER', 'MONITORING_OFFICER'],
  },
  {
    path: '/app/monitoring',
    label: 'Monitoring',
    description: 'Track turnout, verification failures, and suspicious events.',
    icon: Activity,
    status: 'Later',
    allowedRoles: ['SUPER_ADMIN', 'MONITORING_OFFICER'],
  },
  {
    path: '/app/results',
    label: 'Results',
    description: 'View summaries, LGA breakdowns, exports, and validations.',
    icon: BarChart3,
    status: 'Later',
    allowedRoles: ['SUPER_ADMIN', 'RESULTS_OFFICER'],
  },
  {
    path: '/app/audit-logs',
    label: 'Audit Logs',
    description: 'Filter and export admin, voter, biometric, and vote events.',
    icon: ShieldCheck,
    status: 'Later',
    allowedRoles: ['SUPER_ADMIN', 'ELECTION_ADMIN'],
  },
  {
    path: '/app/admin-users',
    label: 'Admin Users',
    description: 'Manage roles, LGA assignments, status, and access control.',
    icon: UserCog,
    status: 'Later',
    allowedRoles: ['SUPER_ADMIN'],
  },
  {
    path: '/app/settings',
    label: 'Settings',
    description: 'Configure OTP, thresholds, retries, sessions, and maintenance.',
    icon: Settings,
    status: 'Later',
    allowedRoles: ['SUPER_ADMIN'],
  },
];

export function getNavigationForRole(role: AdminRole | undefined): AdminNavItem[] {
  if (!role) {
    return [];
  }

  return adminNavigation.filter((item) => item.allowedRoles.includes(role));
}

export const dashboardStats = [
  { label: 'Setup Objects', value: '13', hint: 'Pages mapped' },
  { label: 'Critical Flows', value: '5', hint: 'Election, voters, ballot, biometrics, results' },
  { label: 'Admin Roles', value: '5', hint: 'RBAC-ready' },
];
