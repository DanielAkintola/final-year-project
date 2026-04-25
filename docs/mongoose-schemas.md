# Mongoose Schema Plan

These schemas support the admin web portal, voter mobile app, and backend voting workflow.

## Core Admin Setup Objects

### `Election`

Represents an Ondo State governorship election.

Important fields:

- `title`
- `slug`
- `officeType`
- `state`
- `electionDate`
- `registrationWindow`
- `votingWindow`
- `status`
- `rules`

### `Lga`, `Ward`, `PollingUnit`

Represent Ondo election geography.

Relationship:

```text
Lga -> Ward -> PollingUnit
```

The admin portal will use these for:

- assigning voters
- filtering turnout
- configuring polling units
- breaking down results

### `Party`

Represents a political party.

Important fields:

- `name`
- `acronym`
- `logo`
- `color`

### `Candidate`

Represents a governorship candidate.

Relationship:

```text
Election -> Candidate -> Party
```

Important fields:

- `fullName`
- `deputyFullName`
- `party`
- `photo`
- `ballotOrder`
- `status`

## Voter and Biometric Objects

### `Voter`

Represents a registered citizen.

Important fields:

- `voterId`
- `firstName`
- `lastName`
- `phone`
- `lga`
- `ward`
- `pollingUnit`
- `status`
- `biometricStatus`

### `BiometricProfile`

Stores references to biometric templates, not raw face images.

Important fields:

- `voter`
- `faceTemplateRef`
- `fingerprintTemplateRef`
- `consent`
- `isFlagged`

## Ballot and Vote Objects

### `BallotDefinition`

Represents the published ballot for an election.

Relationship:

```text
Election -> BallotDefinition -> Candidates
```

### `VoteRecord`

Stores the vote event using an anonymous voter token hash.

Important:

- Do not store direct `voter` reference here.
- Use `anonymousVoterTokenHash` to enforce one vote per election.
- Use `voteHash` for receipt and audit verification.

### `VoteReceipt`

Stores voter-facing confirmation without exposing the selected candidate.

Relationship:

```text
Voter -> VoteReceipt -> Election
```

This helps us show voting status while keeping candidate choice separate from voter identity.

## Security and Admin Objects

### `AdminUser`

Represents web portal users.

Roles:

- `SUPER_ADMIN`
- `ELECTION_ADMIN`
- `REGISTRATION_OFFICER`
- `MONITORING_OFFICER`
- `RESULTS_OFFICER`

### `AuditLog`

Records sensitive actions.

Examples:

- admin created election
- candidate updated
- voter approved
- biometric verification failed
- vote cast event recorded

## High-Level Relationship Map

```text
AdminUser
  -> creates Election
  -> manages Lga / Ward / PollingUnit
  -> manages Party / Candidate
  -> approves Voter

Election
  -> has Candidates
  -> has BallotDefinition
  -> has VoteRecords
  -> has VoteReceipts

Voter
  -> belongs to Lga / Ward / PollingUnit
  -> has BiometricProfile
  -> receives VoteReceipt after voting

VoteRecord
  -> references Election / Ballot / Candidate / Party
  -> does not directly reference Voter
```
