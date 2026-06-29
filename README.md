<div align="center">

<a href="https://godui.design">
  <img src="https://raw.githubusercontent.com/LucasBassetti/godui/main/apps/docs/public/og-image.png" alt="GodUI — Motion UI Collection for Modern Interfaces" width="100%" />
</a>

<h1>GodUI</h1>

<p><strong>Motion UI Collection for Modern Interfaces.</strong></p>

<p>
  Built with React, TypeScript, Tailwind CSS v4, and Motion — distributed as a
  <a href="https://ui.shadcn.com">shadcn</a> registry, so components are copied
  straight into your project and you own every line.
</p>

<p><a href="https://github.com/LucasBassetti/godui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a> <a href="https://github.com/LucasBassetti/godui/stargazers"><img src="https://img.shields.io/github/stars/LucasBassetti/godui?style=flat&logo=github&color=yellow" alt="GitHub stars" /></a> <a href="https://github.com/LucasBassetti/godui/commits/main"><img src="https://img.shields.io/github/last-commit/LucasBassetti/godui?logo=git&logoColor=white" alt="Last commit" /></a> <a href="https://github.com/LucasBassetti/godui/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome" /></a></p>

<p><img src="https://img.shields.io/badge/React-18%20%7C%2019-149ECA?logo=react&logoColor=white" alt="React" /> <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /> <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" /> <img src="https://img.shields.io/badge/Motion-0055FF?logo=framer&logoColor=white" alt="Motion" /> <img src="https://img.shields.io/badge/shadcn-compatible-000000?logo=shadcnui&logoColor=white" alt="shadcn compatible" /></p>

<p>
  <a href="https://godui.design"><strong>Documentation</strong></a> ·
  <a href="https://godui.design/docs/components"><strong>Components</strong></a> ·
  <a href="https://godui.design/docs/installation"><strong>Installation</strong></a> ·
  <a href="./CONTRIBUTING.md"><strong>Contributing</strong></a>
</p>

</div>

---

## Overview

**GodUI** is a collection of open-source, animated UI components for Design
Engineers. Built with **React**, **TypeScript**, **Tailwind CSS v4**, and
**Motion**, and distributed as a [shadcn](https://ui.shadcn.com) registry — so
the components are copied straight into your project and you own every line.

If you already use [shadcn/ui](https://ui.shadcn.com), GodUI drops in with the
exact same workflow: add the `@godui` registry, then pull components by name.

## ✨ What you get

- **You own the code.** Components are installed into your codebase via the
  shadcn CLI — not hidden behind a versioned dependency.
- **Motion-first.** Every component ships with polished, performant animation
  out of the box.
- **shadcn-native.** Same install flow as shadcn/ui. If you already use shadcn,
  just add the `@godui` registry.
- **Tailwind v4 tokens.** Themed with CSS variables — light and dark modes work
  with zero extra config.
- **Type-safe.** Full TypeScript types for every component and its props.

## 📦 Installation

GodUI is distributed as a shadcn registry. Components are copied straight into
your project — you own the source.

**1. Create or set up a project:**

```bash
pnpm dlx shadcn@latest init
```

**2. Add the `@godui` registry** to the `registries` field of your
`components.json` (one-time setup):

```json
{
  "registries": {
    "@godui": "https://godui.design/r/{name}.json"
  }
}
```

**3. Add any component by name:**

```bash
pnpm dlx shadcn@latest add @godui/magic-button
```

This copies the component into `components/godui/` and merges the GodUI theme
tokens and component styles into your global stylesheet automatically.

> Prefer zero configuration? Skip step 2 and install with the full registry URL:
> `pnpm dlx shadcn@latest add https://godui.design/r/magic-button.json`

See the full [installation guide](https://godui.design/docs/installation) for
typography and dark-mode setup.

## 🚀 Quick start

Once a component is installed, import and use it:

```tsx
import { MagicButton } from "@/components/godui/magic-button";

export function Demo() {
  return <MagicButton size="lg">Get Started</MagicButton>;
}
```

## 🧩 Components

A growing collection of animated components, organized by category — buttons,
text, overlays, navigation, layout, effects, glass, backgrounds,
visualizations, inputs, and more.

**[Browse all components →](https://godui.design/docs/components)**

## 🛠️ Local development

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

## 📁 Project structure

```
godui/
├── apps/
│   ├── docs/          # Documentation site (Next.js + Fumadocs)
│   └── storybook/     # Component showcase (Storybook)
├── packages/
│   └── components/    # @godui/components — the component library
└── registry.json      # shadcn registry definition (source of truth)
```

## 🤝 Contributing

Contributions are welcome — new components, bug fixes, docs, and ideas. Read the
[Contributing Guide](./CONTRIBUTING.md) to get started, and please follow our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## 📄 License

[MIT](./LICENSE) © Lucas Bassetti

---

<div align="center">

Built by <a href="https://github.com/LucasBassetti">Lucas Bassetti</a> and
<a href="https://github.com/LucasBassetti/godui/graphs/contributors">contributors</a>.

If GodUI helps you ship, consider <a href="https://github.com/LucasBassetti/godui">starring the repo</a> ⭐ ·
<a href="https://godui.design">godui.design</a>

</div>
