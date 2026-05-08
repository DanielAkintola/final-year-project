---
name: Apex Architectural
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434656'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ced'
  primary: '#003ec7'
  on-primary: '#ffffff'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#005474'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e95'
  on-tertiary-container: '#caeaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-md:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality is defined by precision, structural integrity, and quiet confidence. This design system targets high-stakes professionals who value clarity over decoration. The emotional response should be one of "effortless control"—as if the user is operating a perfectly calibrated instrument.

The visual style is a fusion of **Modern Minimalism** and **Glassmorphism**. It relies on generous whitespace and a rigid underlying grid to establish order, while using translucent layers and subtle blur effects to denote hierarchy and depth. This approach avoids the "flatness" of traditional minimalism by introducing light-refracting elements that feel premium and tactile.

## Colors

The palette is anchored by a high-energy Electric Cobalt primary, used sparingly for critical actions and brand emphasis. The foundation of the UI is built upon Deep Obsidian and Slate Grays, providing a sophisticated, "pro-tool" aesthetic.

*   **Primary:** Used for primary buttons, active states, and focus indicators.
*   **Secondary:** Used for heavy headings and structural dark-mode backgrounds.
*   **Tertiary:** Reserved for accents, data visualization, and informational highlights.
*   **Neutral:** Used for secondary text, borders, and low-priority icons.

Surface colors are predominantly off-white and cool grays to maintain a clinical, clean environment that highlights the chromatic brand colors.

## Typography

This design system utilizes a dual-font strategy to balance character with utility. **Hanken Grotesk** is the display face, chosen for its sharp, contemporary geometry and professional "tech-forward" feel. It is used exclusively for headlines and large-scale data points.

**Inter** serves as the workhorse for all functional UI elements, body copy, and labels. Its high x-height and neutral character ensure maximum legibility in dense data environments. Letter spacing is tightened on large display type to maintain a "locked-in" architectural look, while labels utilize increased tracking for clarity at small sizes.

## Layout & Spacing

The design system is built on a **fixed grid model** for desktop, transitioning to a fluid model for mobile. A 12-column grid is used with a 1280px max-width container to ensure content remains readable and focused on large displays.

The spacing rhythm is strictly derived from an 8px base unit. Vertical rhythm is maintained through "stack" variables that define standard gaps between related elements. Use `stack-sm` for internal component spacing, `stack-md` for elements within a section, and `stack-lg` for separating major content blocks. All padding and margins must be multiples of the 8px unit to maintain mathematical consistency.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Glassmorphism**. Rather than relying on heavy shadows, the design system uses surface color shifts and semi-transparent backdrops to indicate elevation.

1.  **Base Layer:** The lowest surface, usually the page background in a neutral off-white.
2.  **Surface Layer:** Primary containers (cards, sidebars) use a solid white background with a very subtle, light-gray stroke (1px).
3.  **Floating Layer:** Modals and dropdowns utilize a backdrop-blur (12px to 20px) and a semi-transparent white fill (90% opacity). This layer uses an "ambient shadow"—a very soft, long-range blur with low opacity (10%) to create a sense of hovering without introducing visual clutter.

## Shapes

The shape language is structured and "Rounded" (Level 2). This provides a professional balance—soft enough to feel modern and accessible, but sharp enough to retain a sense of engineering precision.

Standard components use a 0.5rem (8px) radius. Larger containers, such as dashboard cards or modal windows, scale up to 1rem (16px) or 1.5rem (24px) for the `rounded-xl` variant. This nesting strategy (smaller radius inside larger radius) creates a cohesive, concentric visual flow.

## Components

### Buttons
Primary buttons are solid Electric Cobalt with white text, using the base 8px radius. Secondary buttons use a subtle gray ghost style with a 1px border. Hover states should involve a slight darkening of the fill or a soft inner glow to reinforce the "instrument" feel.

### Cards
Cards are the primary container. They should feature a 1px `slate-200` border and no shadow on the base level. Upon interaction or when elevated, they transition to a Glassmorphic state with a subtle ambient shadow.

### Input Fields
Inputs use a minimal bottom-border or a light four-sided stroke. The focus state is high-contrast, utilizing a 2px primary cobalt ring. Error states must be indicated by both color (Red) and a supportive icon to ensure accessibility.

### Chips & Tags
Chips are used for categorization and status. They utilize a "soft pill" shape (rounded-full) and low-saturation background tints of the status color (e.g., soft green for "Success") to keep the UI from becoming too loud.

### Lists
Data lists should prioritize horizontal space, using subtle hairline dividers (1px) rather than boxes. Use the `label-md` typography for metadata and `body-md` for primary list items.