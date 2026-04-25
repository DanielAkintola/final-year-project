# Admin Website Actions Todo

This file is the working checklist for the React admin portal.

## Current Frontend Progress

- [x] React admin folder scaffolded
- [x] React Router installed in package config and wired into the admin shell
- [x] Sidebar routing configured with active route states
- [x] Admin navigation data separated from components
- [x] Reusable shadcn-style UI primitives created
- [x] Elections page upgraded from placeholder to working local UI
- [ ] Elections page connected to Node.js API
- [ ] MongoDB-backed admin CRUD routes connected

## Roles

- [ ] `SUPER_ADMIN`: full system control
- [ ] `ELECTION_ADMIN`: election setup, candidate setup, ballot setup
- [ ] `REGISTRATION_OFFICER`: voter registry and biometric enrollment review
- [ ] `MONITORING_OFFICER`: turnout, verification attempts, system alerts
- [ ] `RESULTS_OFFICER`: results, reports, exports

## Phase 1: Foundation Pages

- [ ] Create login page
- [ ] Create dashboard layout
- [ ] Create sidebar navigation
- [ ] Create topbar/profile menu
- [ ] Create protected route wrapper
- [ ] Create role-based access guard
- [ ] Connect admin API client
- [ ] Add loading, empty, and error states

## Authentication Actions

- [ ] Admin login
- [ ] Admin logout
- [ ] Admin password reset
- [ ] Admin profile update
- [ ] Enable/disable two-factor authentication
- [ ] View own activity history

## Admin User Management

- [ ] Create admin user
- [ ] View admin users
- [ ] Search/filter admin users
- [ ] Update admin user
- [ ] Activate/deactivate admin user
- [ ] Assign admin role
- [ ] Assign LGA access
- [ ] Reset admin password

## Election Management

- [x] Create election frontend form
- [ ] Edit election title/details
- [x] Set election date frontend control
- [x] Set registration window frontend control
- [x] Set voting start/end time frontend control
- [x] Configure election rules frontend controls
- [ ] Save election as draft
- [x] Publish election frontend action
- [x] Pause election frontend action
- [x] Close election frontend action
- [ ] Archive election
- [x] View election timeline frontend panel

## Geography Setup

- [ ] Create LGA
- [ ] Edit LGA
- [ ] Activate/deactivate LGA
- [ ] Create ward
- [ ] Edit ward
- [ ] Activate/deactivate ward
- [ ] Create polling unit
- [ ] Edit polling unit
- [ ] Activate/deactivate polling unit
- [ ] Assign polling unit to ward/LGA
- [ ] Import geography data

## Party Management

- [ ] Create party
- [ ] Edit party
- [ ] Upload party logo
- [ ] Activate/deactivate party
- [ ] View candidates under party

## Candidate Management

- [ ] Create candidate
- [ ] Edit candidate profile
- [ ] Upload candidate photo
- [ ] Assign candidate to party
- [ ] Assign candidate to election
- [ ] Set ballot order
- [ ] Approve candidate
- [ ] Disqualify candidate
- [ ] Withdraw candidate
- [ ] Preview candidate on ballot

## Ballot Management

- [ ] Generate ballot from approved candidates
- [ ] Preview ballot
- [ ] Reorder candidates
- [ ] Validate ballot
- [ ] Publish ballot
- [ ] Retire ballot version
- [ ] View ballot version history

## Voter Registry

- [ ] Create voter record
- [ ] Search voters
- [ ] View voter details
- [ ] Edit voter details
- [ ] Assign voter to LGA/ward/polling unit
- [ ] Approve voter
- [ ] Suspend voter
- [ ] Reject voter
- [ ] Transfer voter
- [ ] Import voters
- [ ] Export voter list
- [ ] View voter verification history

## Biometric Management

- [ ] View biometric enrollment status
- [ ] Approve face enrollment
- [ ] Flag poor-quality enrollment
- [ ] Request re-enrollment
- [ ] View duplicate identity alerts
- [ ] Review failed verification attempts
- [ ] View liveness check history
- [ ] Reset biometric enrollment for a voter

## Voting Monitoring

- [ ] View active election dashboard
- [ ] Monitor turnout
- [ ] Monitor turnout by LGA
- [ ] Monitor turnout by ward
- [ ] Monitor failed biometric attempts
- [ ] Monitor duplicate vote attempts
- [ ] Monitor system alerts
- [ ] View suspicious activity
- [ ] Pause election during emergency
- [ ] Close election after voting window

## Results And Reports

- [ ] View result summary
- [ ] View result by candidate
- [ ] View result by party
- [ ] View result by LGA
- [ ] View result by ward
- [ ] Export results as CSV
- [ ] Export results as PDF
- [ ] Generate election report
- [ ] Compare votes cast vs registered voters
- [ ] View audit-backed result validation

## Audit Logs

- [ ] View admin activity logs
- [ ] Filter logs by admin
- [ ] Filter logs by action
- [ ] Filter logs by date
- [ ] Filter logs by election
- [ ] View voter-related audit events
- [ ] View biometric-related audit events
- [ ] Export audit logs

## System Settings

- [ ] Configure OTP settings
- [ ] Configure face match threshold
- [ ] Configure max biometric retries
- [ ] Configure session timeout
- [ ] Configure notification templates
- [ ] Configure maintenance mode
- [ ] View API/system health

## Recommended Build Order

- [ ] Login
- [ ] Dashboard
- [ ] Elections
- [ ] Geography
- [ ] Parties
- [ ] Candidates
- [ ] Ballot Builder
- [ ] Voters
- [ ] Biometric Review
- [ ] Monitoring
- [ ] Results
- [ ] Audit Logs
- [ ] Admin Users
- [ ] Settings
