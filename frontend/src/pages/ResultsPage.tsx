import { PageScaffold } from './PageScaffold';

export function ResultsPage() {
  return (
    <PageScaffold
      actions={[
        'View result summary',
        'View results by candidate, party, LGA, and ward',
        'Export CSV/PDF reports',
        'Validate results against audit logs',
      ]}
      description="Review, validate, and export election results."
      title="Results"
    />
  );
}
