<!--
  Thanks for contributing to GodUI! 🙌
  Fill in the sections below. Delete any that don't apply.
  Keep the PR focused — smaller PRs get reviewed faster.
-->

## Description

<!-- What does this PR do, and why? Write enough context that a reviewer
     understands the purpose from this section alone — not just the title. -->

## Type of change

<!-- Check all that apply. -->

- [ ] ✨ New component
- [ ] 🚀 Feature (non-breaking change adding functionality)
- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] 💥 Breaking change (fix or feature that changes existing behavior)
- [ ] ♻️ Refactor (no functional change)
- [ ] 📝 Docs
- [ ] 🎨 Style / design polish
- [ ] 🔧 Tooling / CI / infra
- [ ] ⚡ Performance

## Changes made

<!-- Bullet the specific, concrete changes. Be precise:
     "Add swipe-to-dismiss to Drawer" beats "update drawer files". -->

-
-

## Related issues

<!-- Link issues this closes or relates to. e.g. "Closes #123" -->

## How to test

<!-- Step-by-step so a reviewer can verify the change.
     Include which surface to run: docs (`pnpm dev`), Storybook, or CLI. -->

1.
2.

## Screenshots / recordings

<!-- REQUIRED for any visual or motion change. Before/after images or a GIF.
     Delete this section for non-visual PRs. -->

## Checklist

<!-- Each box should be verifiable in under 30 seconds. -->

- [ ] `pnpm check` passes (Biome lint + format)
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes (type-check + ESLint)
- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] Self-reviewed the diff; no stray logs, dead code, or commented-out blocks
- [ ] Tests added/updated for changed behavior

### Component / registry PRs only

<!-- Delete this block if the PR doesn't touch a component. -->

- [ ] Added entry to `registry.json` (no reformatting of existing entries)
- [ ] Ran `pnpm build:registry`
- [ ] Added/updated a Storybook story in `apps/storybook`
- [ ] Added/updated a docs page under `apps/docs/content/docs`
- [ ] Animations use `transform`/`opacity`/`filter` only (no layout/paint props)
