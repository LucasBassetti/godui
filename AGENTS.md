# GodUI — Agent Rules

GodUI is a design system monorepo (**pnpm + Turbo**): `@godui/components` (`packages/components`, core — animated shadcn/ui drop-ins), `@godui/extras` (`packages/extras`, pre-pivot components, maintained as-is), docs (`apps/docs`, Next.js + Fumadocs), and Storybook (`apps/storybook`).

Skills live in `.agents/skills/` (`.claude/skills` and `.cursor/skills` symlink to it). Read the relevant SKILL.md **before** starting the matching task.

## Commands

Use **pnpm** — never npm or yarn.

| Command | Purpose |
| --- | --- |
| `pnpm check` / `pnpm check:fix` | Biome lint + format (`:fix` writes) |
| `pnpm test` | Vitest |
| `pnpm build:registry` | Build both registries → `apps/docs/public/r` (+ `/r/extras`) |
| `pnpm --filter storybook test:motion-trace` | Runtime GPU-only trace (Playwright + Chrome tracing) |
| `pnpm --filter @godui/extras motion:report` | Regenerate the Extras GPU report |
| `pnpm dev` | Turbo dev (all apps) |
| `pnpm storybook` | Storybook |

## When to invoke which skill

- **Creating or modifying a component** → invoke **`godui-component-creation`** first. (`component-creation` is the generic background variant.)
- **Any color / token / palette / dark-mode / contrast work** → invoke **`oklch-skill`**.
- **UI polish — animation, hover, shadow, border-radius, typography, micro-interaction, "feels off"** → invoke **`make-interfaces-feel-better`** (and `frontend-design`).

## Component checklist (core shadcn drop-ins) — not done until all exist

1. Source: `packages/components/src/ui/<name>.tsx`, mirroring shadcn new-york-v4 `components/ui/<name>.tsx` — same exports, props, `data-slot`s and Radix packages. Header comment names the shadcn version it mirrors. API changes are additive only.
2. `export * from "./ui/<name>";` added to `packages/components/src/index.ts`
3. Entry in root `registry.json` (`registry:ui`, `registryDependencies` includes `@godui/godui-motion` + the shadcn deps upstream declares), then `pnpm build:registry`
4. Storybook story `apps/storybook/src/stories/ui/<name>.stories.tsx` (title `UI/<Name>` with spaces for multi-word names, e.g. `UI/Alert Dialog` → story id `ui-alert-dialog`, matching the docs slug; `tags: ["autodocs"]`) **and** a trace spec `apps/storybook/motion-trace/<name>.spec.ts` using `traceInteraction` + `expectGpuOnly`
5. Vitest `packages/components/src/ui/<name>.test.tsx`: parity, behaviour (open/close, keyboard), reduced motion. Parity = vendor shadcn's source (`node packages/components/scripts/vendor-shadcn.mjs <name>` → `test/shadcn/<name>.tsx`, never edit it), render the same `Usage({ ui })` through both modules and `expectSlotParity(slotTree(), expected, [extraSlots])` (`test/parity.ts`); typing `ui: typeof Shadcn` and passing GodUI makes tsc prove props are a superset
6. Docs page `apps/docs/content/docs/components/<name>/index.mdx` (no category folder) + `learn.mdx` beside it, `<name>` in `apps/docs/content/docs/components/meta.json`, and a `<Card>` in `components/index.mdx`

## Project gotchas (non-obvious — these bite repeatedly)

- **GPU-only, strict, no allowlist.** Core may animate only `transform`/`translate`/`scale`/`rotate`, `opacity`, `filter`. No `transition`, `transition-colors`, `transition-shadow`, `transition-all`, no animated `height`/`width`/`box-shadow`/`background-position`/`color`. Sizes snap; moved siblings FLIP with `useFlipGroup`. Hover color changes snap or fade an overlay's `opacity`. `pnpm --filter @godui/components test` gates it (`src/motion-gate/`).
- **Motion tokens come from `godui-motion`** (core `styles.css` + the `godui-motion` registry item): `animate-godui-*` keyframes on Radix `data-[state=open|closed]`, `ease-spring-snappy|smooth|bouncy` (CSS `linear()`), `--godui-duration-*`. Reduced motion is built into the `animate-godui-*` keyframes (root-only `--godui-motion` multiplier) and `useFlipGroup`; component-level **transform transitions** (switch thumb, tab indicator, hover lifts) still need `motion-reduce:` handling.
- **Extras live in `packages/extras`** (registry `registry-extras.json` → `/r/extras/`, docs `/docs/extras/<category>/<name>`, stories `Extras/<Category>/<Name>`). Core shadcn drop-ins go in `packages/components`. Don't add new components to Extras.
- **No new CSS files; no `@layer components` blocks.** Author component styles as **inline Tailwind utilities** in the `.tsx` (`group`/`peer` + `data-[…]` variants + arbitrary properties for masks/3D/gradients). `styles.css` is the Tailwind **entry only** — `@import`, `@theme`, `@custom-variant`, `@keyframes`. Reference animations with `animate-<name>` utilities, never a `${var}` nested inside an arbitrary value (the scanner can't resolve it — write the class literal).
- **Keyframes are per-component, not in the shared theme** (shared enter/exit keyframes live in `godui-motion`). A component's `@keyframes` + its `--animate-*` token live in **two** places: `styles.css` (so Storybook/docs render) **and** that component's own `registry.json` entry (`cssVars.theme` for the token + `css` for the `@keyframes`). Keep them **out** of the `godui-theme` entry — the theme is pure design tokens, so installing one component pulls only its own animations. Shared keyframes (e.g. `magic-rainbow` on button/tab/input) are repeated in each entry; the shadcn CLI dedupes them on install. No per-component `@layer components` block.
- **`registry.json` is hand-maintained.** Add the new entry, run `pnpm build:registry`; do **not** reformat existing entries.
- **Static Tailwind classes only.** Never build class names dynamically (`grid-cols-${n}`) — the scanner can't see interpolated classes. Map to static strings.
- **No raw `var(--color-*)` inside `@layer` blocks** — renders the wrong theme color. Use Tailwind utilities (`bg-primary`, `text-foreground`, …).
- **Border-ring mask needs inline longhand mask props.** Tailwind `[mask:...]` shorthand resets clip/composite — write the longhands.
- **Theme tokens: sRGB-clamped base chroma + `@media (color-gamut: p3)`** to restore richer chroma. `oklch-skill` governs all color tokens.
- Use the **z-index scale** (`z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast`), never arbitrary z values.
- Add `"use client"` **only** where shadcn has it or the component uses hooks / client APIs. Core components follow shadcn v4: React 19 function components with `ref` as a prop (no `forwardRef`). Extras keep their existing `forwardRef` style.

- **Core source imports are install-shaped** (`@/lib/utils`, `@/components/ui/<x>`, `@/hooks/<x>`), never relative — the shadcn CLI rewrites `@/` on install. The aliases live in **4 places**: `packages/components/{tsconfig.json,vitest.config.ts}`, `apps/docs/tsconfig.json` (exact `@/lib/utils` only — docs owns other `@/lib/*`), `apps/storybook/{tsconfig.json,vite.config.ts}`.
- **Third-party CSS injected unlayered (sonner, vaul) beats Tailwind's `@layer utilities` at any specificity** — overriding it needs `!` (`[transition-property:opacity]!`). Audit the library's stylesheet in a unit test so upgrades can't add paint transitions back.
- **Chrome won't composite the individual `rotate`/`scale`/`translate` properties on an `<svg>`** (compositeFailed 1<<19). Rotate icons with `[transform:rotate(…)]` + `transition-[transform]`, or animate a wrapper.
- **Trace specs:** `traceInteraction(page, { storyId, setup?, act, windowMs })` — `setup` runs before tracing (open a dialog to trace its close). `expectGpuOnly(result, { maxLayoutFrames })` counts 60Hz frames containing layout (default 1, the frame animations finish); raise it only for a documented discrete snap (accordion close = 3). A trace that passes must be shown to fail when the GPU fix is removed, or it proves nothing (e.g. same-height toasts never exercise height).
- **Docs demos** live in `apps/docs/src/components/demos/core/<name>-demo.tsx` and import from `@godui/components`; the Example `code` string is the demo with imports rewritten to `@/components/ui/*`. Learn articles reuse the kit in `apps/docs/src/components/learn/core/` (`KeyframeScene`, `SpringCurveScene`, `FlipScene`, `AutoPlayScene`, `LiveResult`).

## Before claiming done / committing

- Run `pnpm check` and `pnpm test` — both must pass.
- If `registry.json` or any component changed, run `pnpm build:registry`.
