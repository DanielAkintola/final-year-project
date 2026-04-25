import { PageScaffold } from './PageScaffold';

export function SettingsPage() {
  return (
    <PageScaffold
      actions={[
        'Configure OTP settings',
        'Configure face match threshold',
        'Configure biometric retry limits',
        'Configure maintenance mode',
      ]}
      description="Manage system-level settings for authentication, biometrics, and operations."
      title="Settings"
    />
  );
}
