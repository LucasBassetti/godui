# GodUI — Agent Rules

GodUI is a design system monorepo (**pnpm + Turbo**): `@godui/components` (`packages/components`), docs (`apps/docs`, Next.js + Fumadocs), and Storybook (`apps/storybook`).

Skills live in `.agents/skills/` (`.claude/skills` and `.cursor/skills` symlink to it). Read the relevant SKILL.md **before** starting the matching task.

## Commands

Use **pnpm** — never npm or yarn.

| Command | Purpose |
| --- | --- |
| `pnpm check` / `pnpm check:fix` | Biome lint + format (`:fix` writes) |
| `pnpm test` | Vitest |
| `pnpm build:registry` | Build shadcn registry → `apps/docs/public/r` |
| `pnpm dev` | Turbo dev (all apps) |
| `pnpm storybook` | Storybook |

## When to invoke which skill

- **Creating or modifying a component** → invoke **`godui-component-creation`** first. (`component-creation` is the generic background variant.)
- **Any color / token / palette / dark-mode / contrast work** → invoke **`oklch-skill`**.
- **UI polish — animation, hover, shadow, border-radius, typography, micro-interaction, "feels off"** → invoke **`make-interfaces-feel-better`** (and `frontend-design`).

## Component checklist — not done until all exist

1. Source: `packages/components/src/<name>/`
2. Export (component **+ prop/variant types**) added to `packages/components/src/index.ts`
3. Entry in root `registry.json`, then `pnpm build:registry`
4. Storybook story: `apps/storybook/src/stories/<name>.stories.tsx` (`tags: ["autodocs"]`)
5. Vitest test: `packages/components/src/<name>/<name>.test.tsx`
6. Docs page under `apps/docs/content/docs/components/<category>/<name>.mdx` (category **subfolder**, not flat) + slug added to `apps/docs/content/docs/components/meta.json`

## Project gotchas (non-obvious — these bite repeatedly)

- **No new CSS files; no `@layer components` blocks.** Author component styles as **inline Tailwind utilities** in the `.tsx` (`group`/`peer` + `data-[…]` variants + arbitrary properties for masks/3D/gradients). `styles.css` is the Tailwind **entry only** — `@import`, `@theme`, `@custom-variant`, `@keyframes`. Reference animations with `animate-<name>` utilities, never a `${var}` nested inside an arbitrary value (the scanner can't resolve it — write the class literal).
- **Keyframes are per-component, not in the shared theme.** A component's `@keyframes` + its `--animate-*` token live in **two** places: `styles.css` (so Storybook/docs render) **and** that component's own `registry.json` entry (`cssVars.theme` for the token + `css` for the `@keyframes`). Keep them **out** of the `godui-theme` entry — the theme is pure design tokens, so installing one component pulls only its own animations. Shared keyframes (e.g. `magic-rainbow` on button/tab/input) are repeated in each entry; the shadcn CLI dedupes them on install. No per-component `@layer components` block.
- **`registry.json` is hand-maintained.** Add the new entry, run `pnpm build:registry`; do **not** reformat existing entries.
- **Static Tailwind classes only.** Never build class names dynamically (`grid-cols-${n}`) — the scanner can't see interpolated classes. Map to static strings.
- **No raw `var(--color-*)` inside `@layer` blocks** — renders the wrong theme color. Use Tailwind utilities (`bg-primary`, `text-foreground`, …).
- **Border-ring mask needs inline longhand mask props.** Tailwind `[mask:...]` shorthand resets clip/composite — write the longhands.
- **Theme tokens: sRGB-clamped base chroma + `@media (color-gamut: p3)`** to restore richer chroma. `oklch-skill` governs all color tokens.
- Use the **z-index scale** (`z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast`), never arbitrary z values.
- Add `"use client"` **only** when the component uses hooks / client APIs. Components must `React.forwardRef`.

## Before claiming done / committing

- Run `pnpm check` and `pnpm test` — both must pass.
- If `registry.json` or any component changed, run `pnpm build:registry`.
