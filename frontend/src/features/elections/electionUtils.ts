import type { Election, ElectionFormValues, ElectionStatus } from '../../types/election';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatDateTime(value?: string) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'medium',
    timeStyle: value.includes('T') ? 'short' : undefined,
  }).format(new Date(value));
}

export function createElectionFromForm(values: ElectionFormValues): Election {
  const now = new Date().toISOString();

  return {
    ...values,
    id: `elec-${Date.now()}`,
    slug: slugify(values.title),
    officeType: 'GOVERNORSHIP',
    state: 'Ondo',
    status: 'DRAFT',
    createdBy: 'Current Admin',
    updatedAt: now,
  };
}

export function applyElectionStatus(election: Election, status: ElectionStatus): Election {
  const now = new Date().toISOString();

  return {
    ...election,
    status,
    updatedAt: now,
    publishedAt: status === 'PUBLISHED' || status === 'ACTIVE' ? election.publishedAt || now : election.publishedAt,
    closedAt: status === 'CLOSED' ? now : election.closedAt,
  };
}
