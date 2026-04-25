import { PageScaffold } from './PageScaffold';

export function AuditLogsPage() {
  return (
    <PageScaffold
      actions={[
        'View admin activity logs',
        'Filter logs by admin, action, date, and election',
        'View voter and biometric audit events',
        'Export audit logs',
      ]}
      description="Inspect sensitive system actions and operational history."
      title="Audit Logs"
    />
  );
}
