import { PageScaffold } from './PageScaffold';

export function AdminUsersPage() {
  return (
    <PageScaffold
      actions={[
        'Create admin user',
        'Assign role and LGA access',
        'Activate or deactivate admin user',
        'Reset admin password',
      ]}
      description="Manage admin accounts, roles, and access boundaries."
      title="Admin Users"
    />
  );
}
