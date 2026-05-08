# Properly design the admin dashboard pages

## Diagnosis

The admin pages are not "empty" — most are 150–400 lines of real markup with forms, tables, charts, and side panels. The reason they look unstyled is that the JSX references **~50 custom CSS class names that are not defined anywhere in the project**. The previous fix added the `ui-*` primitives (Button/Badge/Card/Input). Page-level layout classes are still missing.

Verified missing classes, grouped by namespace:

- **Auth (SignUp / ForgotPassword)**: `auth-shell`, `auth-panel`, `auth-header`, `auth-form`, `auth-input-wrap`, `auth-error-text`, `auth-success`, `auth-back-link`
- **Dashboard**: `hero`, `eyebrow`, `dashboard-summary-grid`, `dashboard-activity`, `dashboard-activity-list`, `dashboard-alert`, `dashboard-alert-grid`, `section-grid`, `section-card`, `section-card-link`, `section-title-row`, `section-icon`, `stat-card`
- **Elections**: `elections-layout`, `elections-main`, `elections-side`, `election-list`
- **Geography / Voters / Parties / Candidates / AdminUsers / etc.** (shared `geo-*` table+form pattern): `geo-workspace`, `geo-form-card`, `geo-form-grid`, `geo-form`, `geo-form-actions`, `geo-list-card`, `geo-list-header`, `geo-search-box`, `geo-search-input`, `geo-checkbox`, `geo-table`, `geo-table-header`, `geo-table-body`, `geo-table-row`, `geo-col-name`, `geo-col-code`, `geo-col-status`, `geo-col-actions`, `geo-status-badge`, `geo-status-active`, `geo-empty-state`, `geo-empty-title`, `geo-empty-desc`

All 16 pages use some combination of these.

## Approach

Add a single page-design layer to `frontend/src/styles.css` implementing every missing class with the Apex Architectural design system (cobalt primary, Hanken Grotesk + Inter, 8px rhythm, glassmorphic cards). No JSX changes — markup stays intact, styles light up everywhere at once.

### Style spec by namespace

**Layout shells**
- `.auth-shell` — full-viewport flex center, `bg-surface` with subtle radial cobalt gradient
- `.auth-panel` — max-w-md card, `bg-surface-container-lowest`, `rounded-xl`, `outline-variant` border, generous padding, ambient shadow
- `.auth-header` — flex column, brand mark + `font-headline-lg` title + `text-on-surface-variant` subtitle
- `.auth-form`, `.auth-input-wrap` — vertical stack with `gap-stack-md`, input wrapper supports leading icon
- `.auth-error-text` — `text-error font-label-md`, `.auth-success` — soft green tint pill, `.auth-back-link` — primary text link

**Dashboard composition**
- `.hero` — `glass-card` panel with cobalt gradient overlay, `font-display-md` headline, supporting copy, action row
- `.eyebrow` — `font-label-md uppercase tracking-wider text-primary`
- `.dashboard-summary-grid` — responsive grid (1/2/3 cols) of `stat-card`s
- `.stat-card` — `ui-card` variant: small label, `font-display-md` value, optional delta chip
- `.dashboard-activity` / `.dashboard-activity-list` — card with hairline-divided rows, timestamp on right
- `.dashboard-alert-grid`, `.dashboard-alert` — soft-tinted alert cards with status icon
- `.section-grid` — responsive grid of `section-card`
- `.section-card` — clickable card with `section-icon` (rounded square chip), title row, description, hover lift
- `.section-card-link` — full-card anchor, focus ring on primary
- `.section-title-row` — flex between title and right-aligned action
- `.section-icon` — 40px square `bg-primary-container text-on-primary-container rounded-lg flex center`

**Elections workspace**
- `.elections-layout` — 2-col grid on lg (main + side panel), single col on mobile
- `.elections-main`, `.elections-side` — content columns with `space-y-stack-lg`
- `.election-list` — vertical stack of election cards with hairline dividers

**Shared CRUD workspace (`geo-*`)** — used by Geography, Voters, Parties, Candidates, AdminUsers, etc.
- `.geo-workspace` — 2-col grid (form left, list right) on lg, stacks on mobile, `gap-stack-lg`
- `.geo-form-card`, `.geo-list-card` — `ui-card` with sticky header
- `.geo-form` — `flex flex-col gap-stack-md`
- `.geo-form-grid` — 2-col responsive grid of fields
- `.geo-form-actions` — right-aligned button row, top hairline divider
- `.geo-list-header` — flex between count title and search box
- `.geo-search-box` — input wrapper with leading `Search` icon, `.geo-search-input` styles inner input
- `.geo-checkbox` — primary-tinted checkbox
- `.geo-table` — outer wrapper with subtle border + rounded corners
- `.geo-table-header` — grid row with `font-label-lg uppercase text-on-surface-variant`, `bg-surface-container-low`
- `.geo-table-body` — list with hairline dividers between rows
- `.geo-table-row` — grid row, hover `bg-surface-container-low`, `font-body-md`
- `.geo-col-name` (flex 2), `.geo-col-code` (mono `font-label-md`), `.geo-col-status` (chip), `.geo-col-actions` (right-aligned ghost icon buttons)
- `.geo-status-badge` — base pill, `.geo-status-active` cobalt tint; add `geo-status-pending`, `geo-status-suspended`, `geo-status-archived` while we're at it
- `.geo-empty-state` — centered, dashed border, muted icon, `.geo-empty-title` headline-sm, `.geo-empty-desc` body-md text-on-surface-variant

### Implementation method

Write all rules in `frontend/src/styles.css` using `@apply` against the v4 utilities (config already wired). Use raw CSS only for things `@apply` can't express (radial gradients, hairline borders via `box-shadow inset`, status-tinted backgrounds where no token exists).

### Verification

After writing the styles:
1. Reload the admin app
2. Walk through Dashboard, Elections, Voters, Geography, Parties, Candidates, BiometricReview, Monitoring, Results, AuditLogs, AdminUsers, Settings, SignUp
3. Confirm: hero gradients render, cards have white surfaces with subtle borders, tables show clean rows with status pills, forms align to the 2-col grid, buttons use cobalt primary, focus states show the cobalt ring

## Out of scope

- Page logic / data shape changes (e.g. the `localStorage` patterns on `VotersPage`)
- Replacing custom classes with raw Tailwind utilities (bigger refactor — can be a follow-up)
- Mobile sidebar collapse behavior (separate task)
