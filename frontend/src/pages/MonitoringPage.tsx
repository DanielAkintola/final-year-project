import { PageScaffold } from './PageScaffold';

export function MonitoringPage() {
  return (
    <PageScaffold
      actions={[
        'Monitor turnout',
        'Monitor failed biometric attempts',
        'Monitor duplicate vote attempts',
        'View suspicious activity',
      ]}
      description="Track live voting activity, alerts, and operational health."
      title="Monitoring"
    />
  );
}
