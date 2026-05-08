import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Field, FieldLabel, Input, Textarea } from '../../components/ui/Form';
import type { ElectionFormValues } from '../../types/election';

type ElectionFormProps = {
  values: ElectionFormValues;
  onChange: (values: ElectionFormValues) => void;
  onSubmit: () => void | Promise<void>;
  disabled?: boolean;
};

const ruleLabels = {
  allowOneVotePerVoter: 'Enforce one vote per voter',
  requireFaceVerification: 'Require face verification',
  requireFingerprintVerification: 'Require fingerprint verification',
  allowResultsBeforeClose: 'Allow result visibility before close',
};

export function ElectionForm({ values, onChange, onSubmit, disabled = false }: ElectionFormProps) {
  function updateField<Key extends keyof ElectionFormValues>(key: Key, value: ElectionFormValues[Key]) {
    onChange({ ...values, [key]: value });
  }

  function updateRule(key: keyof ElectionFormValues['rules'], value: boolean) {
    onChange({
      ...values,
      rules: {
        ...values.rules,
        [key]: value,
      },
    });
  }

  return (
    <Card className="election-form-card">
      <CardHeader>
        <CardTitle>Create Election</CardTitle>
        <CardDescription>
          Configure the governorship election shell before parties, candidates, and ballots are attached.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="election-form"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <Field>
            <FieldLabel>Election Title</FieldLabel>
            <Input disabled={disabled} value={values.title} onChange={(event) => updateField('title', event.target.value)} />
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              rows={4}
              disabled={disabled}
              value={values.description}
              onChange={(event) => updateField('description', event.target.value)}
            />
          </Field>

          <div className="form-grid">
            <Field>
              <FieldLabel>Election Date</FieldLabel>
              <Input
                type="date"
                disabled={disabled}
                value={values.electionDate}
                onChange={(event) => updateField('electionDate', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Registration Opens</FieldLabel>
              <Input
                type="datetime-local"
                disabled={disabled}
                value={values.registrationStartsAt}
                onChange={(event) => updateField('registrationStartsAt', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Registration Closes</FieldLabel>
              <Input
                type="datetime-local"
                disabled={disabled}
                value={values.registrationEndsAt}
                onChange={(event) => updateField('registrationEndsAt', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Voting Opens</FieldLabel>
              <Input
                type="datetime-local"
                disabled={disabled}
                value={values.votingStartsAt}
                onChange={(event) => updateField('votingStartsAt', event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Voting Closes</FieldLabel>
              <Input
                type="datetime-local"
                disabled={disabled}
                value={values.votingEndsAt}
                onChange={(event) => updateField('votingEndsAt', event.target.value)}
              />
            </Field>
          </div>

          <div className="rules-grid" aria-label="Election rules">
            {(Object.keys(ruleLabels) as Array<keyof ElectionFormValues['rules']>).map((key) => (
              <label className="rule-toggle" key={key}>
                <input
                  checked={values.rules[key]}
                  disabled={disabled}
                  type="checkbox"
                  onChange={(event) => updateRule(key, event.target.checked)}
                />
                <span>{ruleLabels[key]}</span>
              </label>
            ))}
          </div>

          <Button disabled={disabled} type="submit">
            {disabled ? 'Saving...' : 'Create Draft Election'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
