<div align="center">

<a href="https://godui.design">
  <img src="https://raw.githubusercontent.com/LucasBassetti/godui/main/apps/docs/public/og-image.png" alt="GodUI: UI Collection for Modern Interfaces" width="100%" />
</a>

<h1>GodUI</h1>

<p><strong>UI Collection for Modern Interfaces.</strong></p>

<p>
  Built with React, TypeScript, Tailwind CSS v4, and Motion. Distributed as a
  <a href="https://ui.shadcn.com">shadcn</a> registry, so components are copied
  straight into your project and you own every line.
</p>

<p><a href="https://github.com/LucasBassetti/godui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a> <a href="https://github.com/LucasBassetti/godui/stargazers"><img src="https://img.shields.io/github/stars/LucasBassetti/godui?style=flat&logo=github&color=yellow" alt="GitHub stars" /></a> <a href="https://github.com/LucasBassetti/godui/commits/main"><img src="https://img.shields.io/github/last-commit/LucasBassetti/godui?logo=git&logoColor=white" alt="Last commit" /></a> <a href="https://github.com/LucasBassetti/godui/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a></p>

<p><img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /> <img src="https://img.shields.io/badge/Motion-0055FF?logo=framer&logoColor=white" alt="Motion" /> <img src="https://img.shields.io/badge/shadcn-compatible-000000?logo=shadcnui&logoColor=white" alt="shadcn compatible" /></p>

<p>
  <a href="https://godui.design"><strong>Documentation</strong></a> ·
  <a href="https://godui.design/docs/components"><strong>Components</strong></a> ·
  <a href="https://godui.design/docs/installation"><strong>Installation</strong></a> ·
  <a href="./CONTRIBUTING.md"><strong>Contributing</strong></a>
</p>

</div>

---

## Overview

GodUI is an open-source collection of animated components built with React,
TypeScript, Tailwind CSS v4 and Motion. It has two parts:

- **Components:** animated versions of the [shadcn/ui](https://ui.shadcn.com)
  components, with the same files, exports and props. Their motion animates only
  transform, opacity and filter, so it runs on the GPU.
- **Lab:** expressive, experimental components beyond the shadcn catalog.

GodUI is distributed as a shadcn registry. The CLI copies each component into
your project, so you own the source. If you already use shadcn/ui, add the
`@godui` registry and install components by name.

## What you get

- **You own the code:** the shadcn CLI copies components into your codebase
  instead of installing a versioned dependency.
- **Drop-in for shadcn/ui:** installing `@godui/dialog` replaces
  `components/ui/dialog.tsx` with an animated version, and existing imports keep
  working.
- **GPU-only motion:** core components animate only transform, opacity and
  filter. CI fails any change that animates layout or paint.
- **Tailwind v4 tokens:** themed with CSS variables. Light and dark modes work
  without extra config.
- **TypeScript:** every component and its props are typed.

## Installation

GodUI is distributed as a shadcn registry. Components are copied straight into
your project, so you own the source.

**1. Create or set up a project:**

```bash
pnpm dlx shadcn@latest init
```

**2. Add the GodUI registries** to the `registries` field of your
`components.json` (one-time setup). `@godui` serves the animated shadcn/ui
drop-ins; `@godui-lab` serves Lab, GodUI's expressive, experimental pieces
beyond the shadcn catalog:

```json
{
  "registries": {
    "@godui": "https://godui.design/r/{name}.json",
    "@godui-lab": "https://godui.design/r/lab/{name}.json"
  }
}
```

Lab used to be called Extras: an existing `"@godui-extras"` entry pointing at
`https://godui.design/r/extras/{name}.json` keeps working.

**3. Add any component by name:**

```bash
pnpm dlx shadcn@latest add @godui/dialog
```

This replaces `components/ui/dialog.tsx` with the animated version and merges
the `godui-motion` tokens into your global stylesheet. Lab components install
the same way from the second registry, into `components/godui/`:

```bash
pnpm dlx shadcn@latest add @godui-lab/magic-button
```

> To skip step 2, install with the full registry URL:
> `pnpm dlx shadcn@latest add https://godui.design/r/lab/magic-button.json`

See the full [installation guide](https://godui.design/docs/installation) for
typography and dark-mode setup.

## Quick start

Core components keep shadcn's import paths:

```tsx
import { Button } from "@/components/ui/button";

export function Demo() {
  return <Button>Get Started</Button>;
}
```

Lab components import from `components/godui/`:

```tsx
import { MagicButton } from "@/components/godui/magic-button";

export function Demo() {
  return <MagicButton size="lg">Get Started</MagicButton>;
}
```

## Components

[Components](https://godui.design/docs/components) covers the shadcn/ui
catalog: accordion, dialog, dropdown menu, select, sidebar, tabs and the rest.
[Lab](https://godui.design/docs/lab) groups its pieces by category: buttons,
text, overlays, navigation, layout, effects, glass, backgrounds,
visualizations, inputs, AI and collaboration.

## Local development

GodUI is a [pnpm](https://pnpm.io) + [Turborepo](https://turborepo.com)
monorepo. Requires **Node >= 20.19.0** and **pnpm 10.x**.

```bash
# Clone
git clone https://github.com/LucasBassetti/godui.git
cd godui

# Install dependencies
pnpm install

# Start everything (docs + storybook) in dev
pnpm dev

# Build the shadcn registry from registry.json
pnpm build:registry

# Run tests
pnpm test

# Lint & format with Biome
pnpm check        # check
pnpm check:fix    # check and auto-fix
```

## Project structure

```
godui/
├── apps/
│   ├── docs/          # Documentation site (Next.js + Fumadocs)
│   └── storybook/     # Component showcase (Storybook)
├── packages/
│   ├── components/    # @godui/components: animated shadcn/ui drop-ins (core)
│   └── lab/           # @godui/lab: expressive, experimental pieces (maintained as-is)
├── registry.json      # core shadcn registry definition (source of truth)
└── registry-lab.json  # Lab registry, served from /r/lab (/r/extras still works)
```

## Contributing

New components, bug fixes, docs and ideas are welcome. Read the
[Contributing Guide](./CONTRIBUTING.md) and follow the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Lucas Bassetti

## Star History

<a href="https://www.star-history.com/?repos=LucasBassetti%2Fgodui&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&theme=dark&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=LucasBassetti/godui&type=date&legend=top-left&sealed_token=Eco6rP5S6yhB-dwc1cgNpBCcbIi_Wg570aLFL_JgOQ8sDHnqysK_Dg_N_tEHNchW5IRlhIltx060Q0kZ8Dkk_b6ZigA559HwP7OMDalppL8khPsz0TWUrw" />
 </picture>
</a>

---

<div align="center">

Built by <a href="https://github.com/LucasBassetti">Lucas Bassetti</a> and
<a href="https://github.com/LucasBassetti/godui/graphs/contributors">contributors</a>.

<a href="https://github.com/LucasBassetti/godui">Star the repo</a> ·
<a href="https://godui.design">godui.design</a>

</div>
