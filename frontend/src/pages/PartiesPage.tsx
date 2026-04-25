import { PageScaffold } from './PageScaffold';

export function PartiesPage() {
  return (
    <PageScaffold
      actions={[
        'Create party',
        'Edit party',
        'Upload party logo',
        'Activate or deactivate party',
      ]}
      description="Manage political parties that can appear on the governorship ballot."
      title="Parties"
    />
  );
}
