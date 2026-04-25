import { PageScaffold } from './PageScaffold';

export function VotersPage() {
  return (
    <PageScaffold
      actions={[
        'Create voter record',
        'Search and filter voters',
        'Approve, suspend, reject, or transfer voters',
        'Import and export voter list',
      ]}
      description="Manage the voter registry and eligibility status."
      title="Voters"
    />
  );
}
