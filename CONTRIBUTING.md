# Contributing to GodUI

Thanks for your interest in contributing to [GodUI](https://godui.design)! New
components, bug fixes, documentation improvements, and ideas are all welcome.

By participating, you agree to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Prerequisites

- **Node.js** >= 20.19.0
- **pnpm** 10.x (`corepack enable` will pin the right version)

## Getting started

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/godui.git
cd godui

# 2. Install dependencies
pnpm install

# 3. Start the dev environment (docs + storybook)
pnpm dev
```

## Repository layout

GodUI is a [pnpm](https://pnpm.io) + [Turborepo](https://turborepo.com) monorepo:

```
godui/
├── apps/
│   ├── docs/          # Documentation site (Next.js + Fumadocs)
│   └── storybook/     # Component showcase (Storybook)
├── packages/
│   └── components/    # @godui/components — the component library
└── registry.json      # shadcn registry definition (source of truth)
```

- **Component source** lives in `packages/components`.
- **Docs pages** (MDX) live in `apps/docs/content/docs`.
- **Stories** live in `apps/storybook`.

## Adding a component

1. Create the component in `packages/components` (follow the structure and
   Tailwind conventions of existing components).
2. Register it in `registry.json` — add an entry with its name, files, and
   dependencies. **Do not reformat the rest of the file**; just add your entry.
3. Build the registry to generate the consumable JSON:

   ```bash
   pnpm build:registry
   ```

4. Add a Storybook story in `apps/storybook`.
5. Add a docs page under `apps/docs/content/docs/components/<category>/` with a
   `ComponentPreview` and install instructions.

## Code style

GodUI uses [Biome](https://biomejs.dev) for linting and formatting. Run this
before committing:

```bash
pnpm check:fix
```

## Tests

Components are tested with [Vitest](https://vitest.dev):

```bash
pnpm test
```

Please add or update tests for any behavior you change.

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/). Examples:

```
feat(components): add Sparkles component
fix(magic-button): correct hover scale on disabled state
docs(installation): clarify dark-mode setup
```

## Pull requests

1. Create a branch off `main`.
2. Make your changes; ensure `pnpm check` and `pnpm test` pass.
3. Open a PR against `main` with a clear description and screenshots/GIFs for
   visual changes.

## Questions

Open a [GitHub issue](https://github.com/LucasBassetti/godui/issues) for bugs,
feature requests, or questions. Thanks for contributing! 🙌
