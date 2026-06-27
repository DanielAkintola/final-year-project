# Node.js API Endpoints

Base URL: `/api/v1`

The mobile app and admin web app should talk to the Node.js API only. The Python face service stays behind the Node.js layer.

## Public / Mobile Endpoints

### Health

- `GET /health`
  Returns service status.

### Authentication

- `POST /api/v1/auth/admin/login`
  Authenticate an admin user with email and password and issue an admin access token.
- `POST /api/v1/auth/admin/reset-password-with-temp`
  Allow an admin who is not logged in to set a new password using their email, temporary password, and new password.
- `POST /api/v1/auth/request-otp`
  Start voter login with phone or voter ID.
- `POST /api/v1/auth/verify-otp`
  Verify OTP and issue access tokens.
- `POST /api/v1/auth/refresh`
  Refresh access token.
- `POST /api/v1/auth/logout`
  End the current session.

### Voter Profile

- `GET /api/v1/voters/me`
  Return the current voter profile.
- `GET /api/v1/voters/me/eligibility`
  Return current election eligibility and voting status.

### Biometrics

- `POST /api/v1/biometrics/liveness/session`
  Create a liveness session through the Python service.
- `GET /api/v1/biometrics/liveness/:sessionId`
  Fetch the liveness result.
- `POST /api/v1/biometrics/enroll`
  Enroll a voter face template.
- `POST /api/v1/biometrics/verify`
  Verify a voter face against the enrolled template.

### Elections and Ballot

- `GET /api/v1/elections/active`
  Return active elections available to the voter.
- `GET /api/v1/voting/ballot`
  Return the ballot for the authenticated voter.
- `GET /api/v1/voting/status`
  Return whether the voter has already voted.
- `POST /api/v1/voting/cast`
  Submit a vote.
- `GET /api/v1/voting/receipt/:receiptId`
  Return a vote receipt or confirmation status.

## Admin Web Endpoints

All `/api/v1/admin/*` endpoints require:

- `Authorization: Bearer <admin_access_token>`

### Admin Self-Service

- `GET /api/v1/admin/me`
  Return the currently authenticated admin based on the Bearer token.
- `PATCH /api/v1/admin/me`
  Update the current admin's own basic profile fields such as first name, last name, email, phone, and 2FA setting.
- `POST /api/v1/admin/admin-users/:adminUserId/change-password`
  Allow a logged-in admin to change their own password by providing the current password and a new password. The `:adminUserId` must match the authenticated admin.

### Election Management

- `GET /api/v1/admin/elections`
  List elections.
- `POST /api/v1/admin/elections`
  Create an election.
- `GET /api/v1/admin/elections/:electionId`
  Get election detail.
- `PATCH /api/v1/admin/elections/:electionId`
  Update election metadata.
- `POST /api/v1/admin/elections/:electionId/publish`
  Publish an election.
- `POST /api/v1/admin/elections/:electionId/close`
  Close voting for an election.

### Admin User Management

- `GET /api/v1/admin/admin-users`
  List admin users, with optional filtering by role, active status, or search text. `SUPER_ADMIN` and `ELECTION_ADMIN`.
- `GET /api/v1/admin/admin-users/:adminUserId`
  Get one admin user by ID. `SUPER_ADMIN` and `ELECTION_ADMIN` can read any admin; other admins can only read their own record.
- `POST /api/v1/admin/admin-users`
  Create a new admin user and issue a temporary password. `SUPER_ADMIN` only.
- `PATCH /api/v1/admin/admin-users/:adminUserId`
  Update editable admin fields. Any authenticated admin can update their own basic profile fields; only `SUPER_ADMIN` can change role, assigned LGAs, and password-change flags.
- `PATCH /api/v1/admin/admin-users/:adminUserId/status`
  Activate or deactivate an admin user. `SUPER_ADMIN` only.
- `POST /api/v1/admin/admin-users/:adminUserId/reset-password`
  Reset an admin password and issue a fresh temporary password. `SUPER_ADMIN` only.

### Geography Configuration

- `GET /api/v1/admin/lgas`
  List LGAs.
- `POST /api/v1/admin/lgas`
  Create an LGA record.
- `GET /api/v1/admin/wards`
  List wards.
- `POST /api/v1/admin/wards`
  Create a ward record.
- `GET /api/v1/admin/polling-units`
  List polling units.
- `POST /api/v1/admin/polling-units`
  Create a polling unit.

### Parties and Candidates

- `GET /api/v1/admin/parties`
  List parties.
- `POST /api/v1/admin/parties`
  Create a party.
- `GET /api/v1/admin/candidates`
  List candidates.
- `POST /api/v1/admin/candidates`
  Create a candidate.
- `PATCH /api/v1/admin/candidates/:candidateId`
  Update a candidate.

### Voter Registry

- `GET /api/v1/admin/voters`
  Search or list voters.
- `POST /api/v1/admin/voters`
  Create a voter record.
- `POST /api/v1/admin/voters/import`
  Bulk import voters.
- `GET /api/v1/admin/voters/:voterId`
  Get one voter record.
- `PATCH /api/v1/admin/voters/:voterId`
  Update voter details.
- `PATCH /api/v1/admin/voters/:voterId/status`
  Change eligibility, approval, or suspension status.

### Monitoring and Results

- `GET /api/v1/admin/dashboard`
  Return overview metrics.
- `GET /api/v1/admin/results/summary`
  Return state-level result summary.
- `GET /api/v1/admin/results/lgas`
  Return result breakdown by LGA.
- `GET /api/v1/admin/audit-logs`
  Return audit events.

## Node.js to Python Face Service

The Node.js API should call these internal Python endpoints:

- `POST /api/v1/liveness/session`
- `GET /api/v1/liveness/result/:sessionId`
- `POST /api/v1/face/enroll`
- `POST /api/v1/face/verify`

## Recommended implementation order

1. `auth`
2. `voters/me` and `voters/me/eligibility`
3. `biometrics/liveness/session`
4. `biometrics/verify`
5. `voting/ballot`
6. `voting/cast`
7. admin election configuration endpoints
