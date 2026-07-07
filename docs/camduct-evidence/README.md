# CAMduct verification evidence

This folder stores evidence for checks from `src/domain/verification/camductChecks.ts`.

## Folder layout

Use one folder per public product code:

```text
docs/camduct-evidence/
  KRG-001/
    KRG-001-round-duct-A250-B1000-camduct-YYYY-MM-DD.png
    KRG-001-round-duct-A250-B1000-notes.md
  PRM-001/
  R-sp-001/
```

Reference files from a check by relative path, for example:

```ts
screenshotRef: 'docs/camduct-evidence/KRG-001/KRG-001-round-duct-A250-B1000-camduct-YYYY-MM-DD.png'
evidenceRef: 'docs/camduct-evidence/KRG-001/KRG-001-round-duct-A250-B1000-notes.md'
```

## Status rules

- `confirmed` means the expected value came from CAMduct evidence. A confirmed check must include `expectedSource: 'camduct'`, `camductVersion`, `checkedAt`, and either `screenshotRef` or `evidenceRef`.
- `baseline` means the expected value came only from the current engine or unit tests. It is useful for regression control, but it is not a CAMduct confirmation.
- `pending` means there is no expected CAMduct value yet. Keep `expectedResult: null` and `expectedSource: null`.
- `mismatch` means CAMduct evidence exists and the current engine result differs beyond tolerance.

Do not mark a check as `confirmed` without a CAMduct screenshot, exported evidence, or a written evidence note that includes the CAMduct version and date.
