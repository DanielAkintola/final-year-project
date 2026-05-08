
# Admin Dashboard Redesign — Clean Minimal (Linear/Vercel)

Goal: replace the current glass/gradient look with a quiet, monochrome, content-first interface across every admin page. Tighten spacing, restructure layouts, and unify primitives so each page feels like part of one product.

## Design language

- **Surfaces**: flat white (`--surface`) on a soft gray app background (`--surface-container-low`). No gradients, no glass blur, no large shadows. Borders use `--outline-variant` at 1px.
- **Accent**: a single cobalt accent reserved for primary actions, active nav, focus rings, and key metric values. Everything else is neutral grayscale.
- **Typography**: clear hierarchy — small uppercase eyebrow (11px, tracked), page title (28px), section title (18px), body (14px), meta (12px muted). Numbers use tabular figures.
- **Spacing rhythm**: 4 / 8 / 12 / 16 / 24 / 32 / 48. Cards use 24px internal padding, 16px gap between siblings, 32px between major sections.
- **Radii**: 10px on cards, 8px on inputs/buttons, 6px on chips. No oversized rounding.
- **Motion**: only 120ms ease for hover/focus. No translateY lift on cards.

## Shared layout restructure

```text
┌──────────────────────────────────────────────────────────┐
│ TopAppBar  — slim, 56px, no shadow, border-bottom only   │
├──────────┬───────────────────────────────────────────────┤
│          │  PageHeader (eyebrow • title • description •  │
│ Sidebar  │              right-aligned actions)           │
│  240px   ├───────────────────────────────────────────────┤
│  grouped │  Content (max-width 1280, 32px gutter)        │
│  nav     │                                                │
│          │                                                │
└──────────┴───────────────────────────────────────────────┘
```

- **Sidebar**: grouped sections with quiet labels (Operations / Identity / Governance / System). Active item gets a 2px left accent bar, nothing else.
- **TopAppBar**: just brand, breadcrumb, search, user menu. Remove decorative gradients.
- **PageHeader**: new shared component used by every page — replaces inconsistent hero blocks.

## Page-by-page restructure

### Dashboard
New top-down flow instead of the current map-dominant grid:

```text
[ PageHeader: "Live operations" + Refresh button ]

[ KPI strip: 4 stat tiles in one row — Votes • Turnout • Units reporting • Alerts ]

[ Two-column 7/5 ]
  ├ Vote distribution map (taller, no overlay clutter — 2 chips max)
  └ Leader card + Party performance (stacked)

[ Two-column 1/1 ]
  ├ Voting pace chart
  └ Turnout progress

[ Full width: Security & activity — two columns of compact lists ]

[ Modules grid — small icon tiles, 4 per row, neutral ]
```

### Elections
- Left: list of elections (compact rows, status chip, dates).
- Right: detail panel (sticky on desktop). Form opens in a slide-over, not inline.

### Voters / Candidates / Parties / Geography / AdminUsers (CRUD pages)
Unified pattern:
- PageHeader with primary "New" action.
- Filter bar: search + status chips + result count.
- Table: zebra-free, 48px row height, hover background only, action icons revealed on row hover.
- Empty state: centered, single line + action.
- Create/edit moves to a slide-over drawer (right side, 480px) instead of split-screen.

### Results
- KPI strip (total votes, turnout, leading party, margin).
- Map (full width, 60vh).
- Below: leader card + party bars side-by-side, then per-LGA table.

### Ballot Builder
- Two-pane: left builder canvas, right live preview. Sticky toolbar at top.

### Biometric Review
- Queue list (left, 360px) + reviewer detail (right). Approve/Reject as primary/secondary buttons in a footer bar.

### Monitoring / Audit Logs
- Dense table with virtualized rows, sticky filter bar, timestamp column right-aligned.

### Settings
- Left rail of setting groups, right content panel. Each setting row: label + description + control on the right.

### Auth pages (Login / SignUp / ForgotPassword)
- Centered 400px card on plain background (drop the radial gradients). Single accent button.

## Token & primitive updates (`frontend/src/styles.css`)

- Rewrite `.hero` → `.page-header` (no card chrome, just spacing + border-bottom).
- Rewrite `.stat-card` → flat tile: label (muted, uppercase 11px), value (28px, tabular), delta (12px).
- New `.kpi-strip` grid (4 cols, collapses 2/1).
- New `.data-table`, `.toolbar`, `.filter-chip`, `.drawer`, `.empty-state`, `.section-header`.
- Tighten `.ui-button` (h-9, 13px label), `.ui-card` (p-6, radius-10, no hover transform).
- Remove `.glass-card` usage from components; keep class as no-op for safety.
- Sidebar: new `.nav-group`, `.nav-group-label`, `.nav-item`, `.nav-item-active` (2px left bar).

## New / changed components

- New: `frontend/src/components/PageHeader.tsx` (replaces ad-hoc HeroSection usage on inner pages).
- New: `frontend/src/components/ui/Drawer.tsx` (right-side slide-over for forms).
- New: `frontend/src/components/ui/DataTable.tsx` (consistent table chrome).
- New: `frontend/src/components/ui/Toolbar.tsx` (search + filters + actions row).
- New: `frontend/src/components/KpiTile.tsx` (replaces `StatCard` visual).
- Update: `HeroSection`, `Sidebar`, `TopAppBar`, `SectionCard`, `LeaderCard`, `PartyPerformanceChart`, all page files to use the new primitives.

## Out of scope

- No backend / data / route changes.
- No new dependencies.
- Charts keep current libraries; only their container chrome changes.

## Acceptance

- Every admin page uses `PageHeader` + the same gutter and max-width.
- No gradients, no backdrop-blur, no shadow > `0 1px 2px rgba(0,0,0,.04)` outside drawers/menus.
- Single accent color appears only on primary actions, active nav, focus, and headline metrics.
- All CRUD pages share identical toolbar + table + drawer pattern.
- Viewport at 954px (current) renders without horizontal scroll and collapses KPI strip to 2 columns.
