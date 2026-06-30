# Design Tokens

These tokens define the future visual foundation for Calc Square CAMduct V2. They are intentionally namespaced as `--cs-*` so they can be introduced without changing the current UI.

## Color Roles
- `--cs-bg`: page background.
- `--cs-surface`: primary panel surface.
- `--cs-surface-muted`: secondary panel surface.
- `--cs-border`: default border.
- `--cs-border-strong`: stronger divider/table border.
- `--cs-text`: main graphite text.
- `--cs-text-muted`: secondary text.
- `--cs-brand-orange`: primary brand/action accent.
- `--cs-brand-orange-hover`: hover/active orange.
- `--cs-focus-ring`: accessible focus outline.
- `--cs-danger`: destructive action.
- `--cs-warning`: warning/info accent.
- `--cs-success`: success state.

## Typography
- Primary font: Exo 2, with system fallback.
- Body text: 14-16px depending on density.
- Table text: 13-14px.
- Labels: 12-13px, medium or bold.
- Headings: compact, technical, no oversized marketing typography inside workspace.

## Spacing Scale
- `--cs-space-1`: 4px
- `--cs-space-2`: 8px
- `--cs-space-3`: 12px
- `--cs-space-4`: 16px
- `--cs-space-5`: 20px
- `--cs-space-6`: 24px
- `--cs-space-8`: 32px

## Radius
- Controls: 6px.
- Cards/panels: 8px.
- Large shells: 10px maximum unless a modal needs stronger separation.

## Elevation
Use shadows sparingly. Prefer borders and subtle surface contrast. Tables and forms should not float like marketing cards.

## Density
Workspace screens should be information-dense but readable. Atlas can be visual, but calculator and specification views should prioritize scanning and repeated action.
