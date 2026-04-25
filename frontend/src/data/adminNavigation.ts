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

export type AdminSectionStatus = 'Foundation' | 'Next' | 'Later';

export type AdminNavItem = {
  path: string;
  label: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
  status: AdminSectionStatus;
};

export const adminNavigation: AdminNavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    description: 'Election readiness, turnout, alerts, and system status.',
    icon: LayoutDashboard,
    status: 'Foundation',
  },
  {
    path: '/elections',
    label: 'Elections',
    description: 'Create, publish, pause, close, and archive elections.',
    icon: Vote,
    status: 'Foundation',
  },
  {
    path: '/geography',
    label: 'Geography',
    description: 'Manage LGAs, wards, and polling units.',
    icon: MapPinned,
    status: 'Foundation',
  },
  {
    path: '/parties',
    label: 'Parties',
    description: 'Create parties, logos, colors, and active status.',
    icon: Flag,
    status: 'Foundation',
  },
  {
    path: '/candidates',
    label: 'Candidates',
    description: 'Manage candidates, deputies, photos, and approval status.',
    icon: BadgeCheck,
    status: 'Foundation',
  },
  {
    path: '/ballot-builder',
    label: 'Ballot Builder',
    description: 'Preview, order, validate, and publish ballot versions.',
    icon: ClipboardList,
    status: 'Next',
  },
  {
    path: '/voters',
    label: 'Voters',
    description: 'Search, approve, suspend, import, and transfer voters.',
    icon: Users,
    status: 'Next',
  },
  {
    path: '/biometric-review',
    label: 'Biometric Review',
    description: 'Review enrollment, failed matches, duplicate alerts, and flags.',
    icon: Fingerprint,
    status: 'Next',
  },
  {
    path: '/monitoring',
    label: 'Monitoring',
    description: 'Track turnout, verification failures, and suspicious events.',
    icon: Activity,
    status: 'Later',
  },
  {
    path: '/results',
    label: 'Results',
    description: 'View summaries, LGA breakdowns, exports, and validations.',
    icon: BarChart3,
    status: 'Later',
  },
  {
    path: '/audit-logs',
    label: 'Audit Logs',
    description: 'Filter and export admin, voter, biometric, and vote events.',
    icon: ShieldCheck,
    status: 'Later',
  },
  {
    path: '/admin-users',
    label: 'Admin Users',
    description: 'Manage roles, LGA assignments, status, and access control.',
    icon: UserCog,
    status: 'Later',
  },
  {
    path: '/settings',
    label: 'Settings',
    description: 'Configure OTP, thresholds, retries, sessions, and maintenance.',
    icon: Settings,
    status: 'Later',
  },
];

export const dashboardStats = [
  { label: 'Setup Objects', value: '13', hint: 'Pages mapped' },
  { label: 'Critical Flows', value: '5', hint: 'Election, voters, ballot, biometrics, results' },
  { label: 'Admin Roles', value: '5', hint: 'RBAC-ready' },
];
