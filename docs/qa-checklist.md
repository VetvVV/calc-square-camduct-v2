# QA Checklist

## Core workflow
- Atlas shows round family with R-001 and SPIRAL-001
- Variant click opens `/split?module=...`
- R-001 calculator computes control values
- SPIRAL-001 calculator computes control values
- Add item updates specification table
- Edit restores module values
- Remove deletes row and recalculates totals

## Data and persistence
- Project auto-saves to localStorage
- Save local / Open local work
- Export JSON downloads file
- Import JSON restores project
- spiralSectionLength survives import/export

## Roles
- guest/user/client do not see debug panel
- admin/service see debug panel
- CAMduct toggle visible only for admin/service

## I18N
- EN has no RU leftovers
- UK has no RU/EN leftovers
- Description builders produce localized output

## Assets
- ST logo loads locally
- round atlas image loads locally
- spiral atlas image loads locally
- round product SVG loads locally
