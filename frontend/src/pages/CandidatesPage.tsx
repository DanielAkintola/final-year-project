import { PageScaffold } from './PageScaffold';

export function CandidatesPage() {
  return (
    <PageScaffold
      actions={[
        'Create candidate',
        'Assign candidate to party and election',
        'Set ballot order',
        'Approve, disqualify, or withdraw candidate',
      ]}
      description="Manage candidate profiles, party assignments, and approval status."
      title="Candidates"
    />
  );
}
