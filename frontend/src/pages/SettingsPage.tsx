import { useEffect, useState } from 'react';
import { CheckCircle2, RotateCcw, Save, XCircle } from 'lucide-react';

import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Field, FieldLabel, Input, Select } from '../components/ui/Form';

type AppSettings = {
  otpEnabled: boolean;
  otpExpiryMinutes: number;
  faceMatchThreshold: number;
  biometricRetryLimit: number;
  autoLockAfterFailedAttempts: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  resultVisibility: 'RESTRICTED' | 'ADMIN_ONLY' | 'PUBLIC';
};

const SETTINGS_KEY = 'ondo-admin-settings';

const defaultSettings: AppSettings = {
  otpEnabled: true,
  otpExpiryMinutes: 5,
  faceMatchThreshold: 78,
  biometricRetryLimit: 3,
  autoLockAfterFailedAttempts: 5,
  maintenanceMode: false,
  maintenanceMessage: 'The system is under scheduled maintenance. Please try again shortly.',
  resultVisibility: 'ADMIN_ONLY',
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return defaultSettings;
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function showFeedback(message: string, type: 'success' | 'error' = 'success') {
    setFeedback({ message, type });
    window.setTimeout(() => setFeedback(null), 2500);
  }

  function saveSettings() {
    if (settings.faceMatchThreshold < 40 || settings.faceMatchThreshold > 99) {
      showFeedback('Face threshold must be between 40 and 99.', 'error');
      return;
    }

    if (settings.otpExpiryMinutes < 1 || settings.otpExpiryMinutes > 15) {
      showFeedback('OTP expiry must be between 1 and 15 minutes.', 'error');
      return;
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    showFeedback('Settings saved successfully.');
  }

  function resetDefaults() {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    showFeedback('Settings restored to defaults.');
  }

  return (
    <>
      <PageHeader
        eyebrow="Admin Workspace"
        title="Settings"
        description="Configure authentication, biometric thresholds, and operational behavior for the election platform."
      />

      {feedback && (
        <div className={`geo-feedback ${feedback.type === 'success' ? 'geo-feedback-success' : 'geo-feedback-error'}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="geo-workspace">
        <Card className="geo-form-card">
          <CardHeader>
            <CardTitle>Security Controls</CardTitle>
            <CardDescription>OTP and account lock hardening controls.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-form-grid">
              <label className="geo-checkbox">
                <input
                  type="checkbox"
                  checked={settings.otpEnabled}
                  onChange={(event) => setSettings((current) => ({ ...current, otpEnabled: event.target.checked }))}
                />
                <span>Enable OTP for admin sign-in</span>
                <small>Require second factor on every login.</small>
              </label>
              <Field>
                <FieldLabel>OTP Expiry (minutes)</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  max={15}
                  value={settings.otpExpiryMinutes}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, otpExpiryMinutes: Number(event.target.value) }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel>Auto Lock After Failed Attempts</FieldLabel>
                <Input
                  type="number"
                  min={3}
                  max={10}
                  value={settings.autoLockAfterFailedAttempts}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, autoLockAfterFailedAttempts: Number(event.target.value) }))
                  }
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card className="geo-list-card">
          <CardHeader>
            <CardTitle>Biometric & Operations</CardTitle>
            <CardDescription>Face threshold, retries, maintenance controls, and results access.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="geo-form">
              <div className="geo-form-grid">
                <Field>
                  <FieldLabel>Face Match Threshold (%)</FieldLabel>
                  <Input
                    type="number"
                    min={40}
                    max={99}
                    value={settings.faceMatchThreshold}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, faceMatchThreshold: Number(event.target.value) }))
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Biometric Retry Limit</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={6}
                    value={settings.biometricRetryLimit}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, biometricRetryLimit: Number(event.target.value) }))
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel>Result Visibility</FieldLabel>
                  <Select
                    value={settings.resultVisibility}
                    onChange={(event) =>
                      setSettings((current) => ({ ...current, resultVisibility: event.target.value as AppSettings['resultVisibility'] }))
                    }
                  >
                    <option value="RESTRICTED">Restricted</option>
                    <option value="ADMIN_ONLY">Admin Only</option>
                    <option value="PUBLIC">Public</option>
                  </Select>
                </Field>
              </div>

              <label className="geo-checkbox">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, maintenanceMode: event.target.checked }))
                  }
                />
                <span>Enable Maintenance Mode</span>
                <small>Temporarily block user operations for scheduled work.</small>
              </label>

              <Field>
                <FieldLabel>Maintenance Message</FieldLabel>
                <Input
                  value={settings.maintenanceMessage}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, maintenanceMessage: event.target.value }))
                  }
                />
              </Field>

              <div className="geo-form-actions">
                <Button type="button" onClick={saveSettings}>
                  <Save size={16} />
                  Save Settings
                </Button>
                <Button type="button" variant="ghost" onClick={resetDefaults}>
                  <RotateCcw size={16} />
                  Restore Defaults
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
