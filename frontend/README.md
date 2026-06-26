# Ondo Voting Admin Site

This folder contains the React admin web application for managing the Ondo State governorship election workflow.

The admin site is the operational control center for:

- election setup
- geography configuration
- party and candidate management
- ballot preparation
- voter registry management
- biometric review
- voting monitoring
- results and reporting
- audit and system settings

## Purpose

The admin site exists so electoral administrators can configure and supervise the election process without using the mobile voter application.

It is designed to support:

- secure election configuration
- role-based admin access
- clear operational dashboards
- auditability of sensitive actions
- separation of voter identity management from vote records

## Main Functional Areas

### 1. Authentication And Access Control

The admin site should support:

- admin login
- logout
- password reset
- optional two-factor authentication
- role-based access control
- personal activity history

## 2. Admin User Management

The admin site should allow privileged users to:

- create admin users
- assign roles
- assign LGA-level access
- activate or deactivate admins
- reset admin credentials

### 3. Election Management

This is the first core module and the foundation for the rest of the system.

Admins should be able to:

- create a new election
- edit election title and description
- set election date
- set registration window
- set voting window
- configure election rules
- save as draft
- publish election
- pause election
- close election
- archive election
- review election timeline

### 4. Geography Setup

The admin site should support full election geography setup for Ondo State:

- create and edit LGAs
- create and edit wards
- create and edit polling units
- activate or deactivate geography records
- assign polling units to wards and LGAs
- import geography data

### 5. Party Management

Admins should be able to:

- create parties
- edit party details
- upload party logos
- manage party colors and identity
- activate or deactivate parties

### 6. Candidate Management

Admins should be able to:

- create candidate records
- assign candidates to parties
- assign candidates to elections
- upload candidate photos
- set ballot order
- approve candidates
- disqualify candidates
- withdraw candidates
- preview ballot appearance

### 7. Ballot Builder

The admin site should support:

- generating ballots from approved candidates
- previewing ballot layouts
- reordering candidates
- validating ballot setup
- publishing ballot versions
- retiring outdated ballot versions
- viewing ballot history

### 8. Voter Registry

The admin site should allow voter administration workflows such as:

- creating voter records
- searching and filtering voters
- editing voter records
- assigning LGAs, wards, and polling units
- approving voters
- rejecting voters
- suspending voters
- transferring voters
- importing and exporting voter lists
- viewing verification history

### 9. Biometric Review

Because this project uses face recognition and fingerprinting, the admin site should provide:

- biometric enrollment status review
- face enrollment approval
- poor-quality enrollment flagging
- duplicate identity alert review
- failed verification review
- liveness history review
- biometric reset and re-enrollment actions

### 10. Voting Monitoring

During an active election, admins should be able to:

- monitor turnout
- monitor turnout by LGA
- monitor turnout by ward
- review failed biometric attempts
- review duplicate vote attempts
- monitor suspicious activity
- respond to election incidents

### 11. Results And Reporting

After or during controlled result access, the admin site should support:

- state-level result summary
- candidate-level results
- party-level results
- LGA-level results
- ward-level results
- CSV export
- PDF export
- report generation
- validation against registered voter counts and audit data

### 12. Audit Logs

The admin site should expose:

- admin activity logs
- election change logs
- voter-related audit events
- biometric-related audit events
- filtering by action, admin, election, and date
- audit export

### 13. System Settings

The admin site should eventually allow privileged users to configure:

- OTP settings
- face match threshold
- biometric retry limits
- session timeout
- notification templates
- maintenance mode
- API and system health visibility

## Admin Roles

The planned roles for this system are:

- `SUPER_ADMIN`
- `ELECTION_ADMIN`
- `REGISTRATION_OFFICER`
- `MONITORING_OFFICER`
- `RESULTS_OFFICER`

Each role should only see the sections and actions relevant to its responsibility.

## Current Frontend Status

The current React frontend already includes:

- React Router setup
- sidebar navigation
- reusable UI primitives
- page scaffolds for major admin sections
- a more complete `Elections` module with local state and workflow actions

The current implemented pages live under:

- `src/pages`
- `src/features/elections`
- `src/components`
- `src/routes`
- `src/data`

## Tech Stack

This admin frontend is built with:

- React
- TypeScript
- Vite
- React Router
- Lucide icons

## Recommended Build Order

To keep the admin site stable and incremental, the recommended implementation order is:

1. Authentication
2. Dashboard
3. Elections
4. Geography
5. Parties
6. Candidates
7. Ballot Builder
8. Voters
9. Biometric Review
10. Monitoring
11. Results
12. Audit Logs
13. Admin Users
14. Settings

## Notes

- The admin site should never directly decide whether a vote is counted without backend validation.
- Biometric verification results should come from backend services, not frontend-only logic.
- Vote secrecy should be preserved by separating voter identity records from stored vote records.
- The admin UI should focus on orchestration, visibility, review, and controlled actions.
