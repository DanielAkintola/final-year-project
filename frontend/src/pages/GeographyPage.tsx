import { PageScaffold } from './PageScaffold';

export function GeographyPage() {
  return (
    <PageScaffold
      actions={[
        'Create and edit LGAs',
        'Create and edit wards',
        'Create and edit polling units',
        'Import geography data',
      ]}
      description="Configure LGAs, wards, and polling units for election operations."
      title="Geography"
    />
  );
}
