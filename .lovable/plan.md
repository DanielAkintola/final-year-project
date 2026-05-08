# Fix: Admin dashboard shows no styles

## Diagnosis

Your `frontend/` app uses **Tailwind v4** (`tailwindcss@^4.2.4` + `@tailwindcss/postcss`), but it's configured like Tailwind v3:

- `frontend/src/styles.css` only contains `@import "tailwindcss";` with no theme tokens.
- All your design tokens (colors like `bg-on-background`, `text-primary-fixed-dim`, spacing like `p-gutter`, fonts like `font-headline-md`, etc.) live in `frontend/tailwind.config.cjs`.
- **Tailwind v4 does not auto-load `tailwind.config.cjs`.** It uses a CSS-first config via `@theme` in your CSS, or you must opt-in to the JS config with a `@config` directive.

Result: every custom utility class used across `Sidebar.tsx`, `AdminLayout.tsx`, pages, etc. produces no CSS, so the admin dashboard renders unstyled.

## Fix

Update `frontend/src/styles.css` to explicitly load the existing JS config:

```css
@import "tailwindcss";
@config "../tailwind.config.cjs";

/* keep existing .glass-card, .custom-scrollbar, .material-symbols-outlined rules */
```

This is the lowest-risk fix — it keeps your current `tailwind.config.cjs` (colors, spacing, fontFamily, fontSize) as the source of truth and makes Tailwind v4 actually read it. No component changes needed.

## Optional follow-ups (not required to unblock)

- Long-term, migrate the JS config into a `@theme` block in `styles.css` (the v4-native approach) and delete `tailwind.config.cjs`.
- Delete the unused `frontend/src/styles.clean.css` duplicate.
- Verify `postcss.config.cjs` already uses `@tailwindcss/postcss` (it does) — no change needed.

## Verification

After the edit, reload the admin app and confirm the sidebar, top app bar, and dashboard cards render with the cobalt/blue theme from `DESIGN.md`.
