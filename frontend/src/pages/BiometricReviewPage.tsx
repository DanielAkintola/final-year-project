import { PageScaffold } from './PageScaffold';

export function BiometricReviewPage() {
  return (
    <PageScaffold
      actions={[
        'View biometric enrollment status',
        'Approve or flag face enrollment',
        'Review failed verification attempts',
        'Request re-enrollment',
      ]}
      description="Review face and fingerprint enrollment quality, alerts, and verification history."
      title="Biometric Review"
    />
  );
}
