# Fix: Admin pages render unstyled (missing UI primitive CSS)

## Diagnosis

The Tailwind v4 `@config` fix from the previous turn restored utility classes (`bg-on-background`, `text-headline-md`, etc.) used by the layout/sidebar. But the admin **pages** look unstyled because the shared UI primitives in `src/components/ui/` rely on a set of custom CSS classes that **are not defined anywhere in the project**:

- `Button.tsx` → `ui-button`, `ui-button-primary|secondary|danger|ghost`
- `Badge.tsx` → `ui-badge`, `ui-badge-neutral|success|warning|danger|info`
- `Card.tsx` → `ui-card`, `ui-card-header`, `ui-card-title`, `ui-card-description`, `ui-card-content`
- `Form.tsx` → `ui-field`, `ui-field-label`, `ui-input`, `ui-textarea`

Searching `frontend/src/styles.css`, `styles.clean.css`, and the rest of the source confirms zero matches for any of these class names. So every Button/Badge/Card/Input rendered on dashboard, elections, voters, candidates, etc. is currently a bare HTML element with no styling.

(Side note: `Input.tsx` and `Form.tsx` both export `Input` — that's a separate cleanup, not the cause of the missing styles.)

## Fix

Add a `ui-*` component layer to `frontend/src/styles.css` that styles all the primitives using the design tokens already defined in `tailwind.config.cjs` / `DESIGN.md` (Apex Architectural — cobalt primary, Hanken Grotesk + Inter, 8px rhythm, 0.5rem radius).

Concretely, append rules for:

- **`.ui-button`** — base: inline-flex, `font-label-lg`, `rounded-lg`, `px-4 py-2`, focus ring on `primary`. Variants:
  - `primary` → `bg-primary text-on-primary` + hover darken
  - `secondary` → `bg-surface-container text-on-surface` + 1px `outline-variant` border
  - `danger` → `bg-error text-on-error`
  - `ghost` → transparent + `hover:bg-surface-container`
- **`.ui-badge`** — `inline-flex`, `rounded-full`, `px-2.5 py-0.5`, `font-label-md`. Tones use soft tinted backgrounds:
  - neutral: `surface-container` / `on-surface-variant`
  - success: soft green tint
  - warning: soft amber tint
  - danger: `error-container` / `on-error-container`
  - info: `tertiary-container` / `on-tertiary-container`
- **`.ui-card`** — `bg-surface-container-lowest`, 1px `outline-variant` border, `rounded-xl`, `p-gutter`, `space-y-stack-md`. Plus `ui-card-header` (flex column gap), `ui-card-title` (`font-headline-md`), `ui-card-description` (`text-on-surface-variant font-body-md`), `ui-card-content` (`space-y-stack-sm`).
- **`.ui-field`** — flex column, `gap-stack-sm`, with `ui-field-label` as `font-label-lg text-on-surface-variant`.
- **`.ui-input`** — full-width, `bg-surface-container-lowest`, 1px `outline-variant` border, `rounded-lg`, `px-3 py-2`, `font-body-md`, focus → 2px `primary` ring. `ui-textarea` adds `min-h-[120px] resize-y`.

Implementation approach: write these as plain CSS rules inside `styles.css` using `@apply` with the v4 utilities (now that `@config` is loading the JS theme), or use raw CSS with `var(--*)` for the theme tokens. `@apply` keeps things terse and consistent with the existing tokens.

## Out of scope (mention only)

- The duplicate `Input` export in `components/ui/Form.tsx` vs `Input.tsx`.
- Deleting the unused `styles.clean.css`.
- Migrating long-term to a v4-native `@theme` block.

## Verification

Reload the admin app and visit a few pages (Dashboard, Elections, Voters). Buttons should be cobalt with white text, cards should be white panels with subtle borders, badges should be soft pills, inputs should have visible borders and a primary focus ring.
