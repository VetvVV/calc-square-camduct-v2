# Calc Square CAMduct V2

Calc Square CAMduct V2 is an MVP web calculator for ventilation products. It is built as a React/Vite application with a typed domain layer, localized UI, a product atlas, calculator workspace, and project specification flow.

## Implemented

- Atlas
- R-001 straight seam duct
- SPIRAL-001 spiral duct
- Split workspace
- Specification
- Add / Edit / Remove specification items
- Save local project file
- Open local project file
- Export JSON
- Import JSON
- RU / UK / EN localization
- guest / client / admin / service roles
- CAMduct / service debug panel
- GitHub Pages-ready HashRouter and relative asset base

## Source-of-truth checks

These values are part of the current accepted behavior and must stay stable unless a separate business-rule change is approved.

- R-001 `A=250`, `B=1000` -> `0.810 m²`
- R-001 `A=250`, `B=3200` -> `2.593 m²`, split `2×1250+700`
- SPIRAL-001 `A=250`, `B=6000` -> `4.712 m²`
- SPIRAL-001 `A=250`, `B=14500`, `sectionLength=2000` -> `11.388 m²`, split `7×2000+500`

Internal CAMduct keys such as `A` and `B` are data keys. Geometry labels such as `ØD` and `L` are display-layer labels only.

## Commands

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd test -- --run
npm.cmd run build
npm.cmd run preview
npm.cmd run lint
```

## Not included yet

- Additional product modules beyond the current MVP set
- Full CAMduct export
- Excel / PDF export
- Strip consumption calculation
- `effectiveStripWidth` calculation
- Advanced mobile polish

## Release notes

The app is prepared for GitHub Pages deployment through a hash router and `base: './'` assets.
