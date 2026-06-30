# Codex Design Prompt

When modifying Calc Square CAMduct V2 UI, preserve the product as an engineering workspace.

Use this direction:
- technical engineering dashboard;
- clean industrial UI;
- light neutral theme;
- orange brand accent;
- graphite typography;
- readable tables and dense forms;
- clear role-aware access states;
- no decorative noise;
- no generic marketing dashboard layout for operational screens.

Do not change:
- formulas;
- internal A/B CAMduct keys;
- module metadata contracts;
- routing/base configuration;
- role permissions unless explicitly requested;
- Atlas image assets unless the task is specifically about assets.

When adding UI:
1. Start from existing components and local patterns.
2. Use design tokens from `src/styles/design-tokens.css` when practical.
3. Keep labels i18n-ready in RU/UK/EN.
4. Verify `npm test -- --run`, `npm run build`, and `npm run lint`.
5. Report exactly which files changed.
