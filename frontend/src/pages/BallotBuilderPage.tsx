import { PageScaffold } from './PageScaffold';

export function BallotBuilderPage() {
  return (
    <PageScaffold
      actions={[
        'Generate ballot from approved candidates',
        'Preview ballot',
        'Reorder candidates',
        'Publish ballot version',
      ]}
      description="Build and publish the voter-facing ballot."
      title="Ballot Builder"
    />
  );
}
