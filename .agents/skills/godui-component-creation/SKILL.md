---
name: godui-component-creation
description: Create new core components for GodUI (@godui/components) — animated, drop-in replacements for shadcn/ui with strict GPU-only motion. Use when adding a component, fixing missing Tailwind styles on components, wiring Storybook stories, or writing docs pages (main page + required Learn tab) with Workbench/Example and ComponentInstall.
---

# GodUI Component Creation

GodUI core (`@godui/components`) is **shadcn/ui, animated**: every component is a
drop-in replacement for its shadcn new-york-v4 counterpart (same file, exports,
props, `data-slot`s, Radix primitives) with motion that runs only on the
compositor. Pre-pivot components live in `@godui/extras` (`packages/extras`) and
are frozen — don't add new components there.

## Quick reference

| Step | File |
|------|------|
| Component | `packages/components/src/ui/{name}.tsx` (mirrors shadcn `components/ui/{name}.tsx`) |
| Export | `packages/components/src/index.ts` |
| Tailwind scan | `packages/components/styles.css` → `@source "./src"` |
| Shared motion | `godui-motion` — tokens/keyframes in `packages/components/styles.css`, hook `src/hooks/use-flip-group.ts`, registry item `godui-motion` |
| Component-only keyframes | `styles.css` **and** the component's `registry.json` entry (`cssVars.theme` + `css`) |
| GPU gate | `packages/components/src/motion-gate/` (runs in `pnpm --filter @godui/components test`) |
| Storybook | `apps/storybook/src/stories/ui/{name}.stories.tsx` (title `UI/{Name}`) |
| Runtime trace | `apps/storybook/motion-trace/{name}.spec.ts` (`traceInteraction` + `expectGpuOnly`) |
| Docs | `apps/docs/content/docs/components/{name}/index.mdx` (no category folder) |
| Learn tab (required) | `apps/docs/content/docs/components/{name}/learn.mdx` + scenes in `apps/docs/src/components/learn/` — **use the `godui-learn-article` skill** |
| Nav | `apps/docs/content/docs/components/meta.json` (`root: true` folder) |
| Index card | `apps/docs/content/docs/components/index.mdx` → `<PreviewCard>` |
| Placeholder preview | `apps/docs/src/components/card-previews/previews/{name}.tsx` + slug in `registry.tsx` |

## 1. Create the component

Start from shadcn's current new-york-v4 source for the same component and keep
its public surface **identical**: file name, named exports, props, `data-slot`
attributes, Radix package, `cn` from `@/lib/utils`. Add a header comment naming
the shadcn version you mirrored. API changes are additive only (e.g. an optional
`motion?: "default" | "subtle" | "none"`); never rename or remove a shadcn prop.

Follow shadcn v4 conventions: React 19 function components with `ref` as a prop
(no `forwardRef`), `"use client"` where shadcn has it.

```tsx
// Mirrors shadcn/ui new-york-v4 popover (registry version: <date or commit>).
"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import type * as React from "react";
import { cn } from "@/lib/utils";

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-popover w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
          "origin-(--radix-popover-content-transform-origin)",
          "data-[state=open]:animate-godui-fade-scale-in data-[state=closed]:animate-godui-fade-scale-out",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
```

Export the components **and their prop types** from `packages/components/src/index.ts`.

## 2. Ensure Tailwind scans component files

**This is the most common reason styles don't apply.**

`packages/components/styles.css` must include:

```css
@import "tailwindcss";
@import "./theme/light.css";
@import "./theme/dark.css";

@source "./src";
```

Consuming apps also scan explicitly:

- `apps/storybook/src/tailwind.css` → `@source "../node_modules/@godui/components/src"` (and `…/@godui/extras/src`)
- `apps/docs/src/app/globals.css` → `@source "../../../../packages/components/src"` (and `…/packages/extras/src`)

If utilities like `bg-primary` render unstyled, verify `@source "./src"` exists and restart the dev server. Both apps already depend on `@godui/components` via `workspace:*` and it is in the docs `transpilePackages` — no `pnpm install` needed for a new component in the shared package.

## 3. Styling approach — inline Tailwind only

**Author all component styles as inline Tailwind utilities in the `.tsx`.** Do **not** create CSS files or add `@layer components` blocks. `styles.css` is the Tailwind **entry only** (`@import`, `@theme`, `@custom-variant`, `@keyframes`).

Express CSS-heavy designs (3D buttons, sprite masks, gradients, state machines) with utilities + arbitrary values rather than a stylesheet:

- **`group` / `peer`** on the parent + `group-hover:` / `group-focus-visible:` / `group-active:` on children — replaces `.parent:hover .child` descendant selectors.
- **`group-data-[variant=default]:` / `data-[status=loading]:`** — replaces `[data-variant="x"]` state selectors. Keep the `data-*` attributes on the element.
- **`has-[…]:`, `placeholder:`, `motion-reduce:`, `focus-within:`** — replace `:has()`, `::placeholder`, `prefers-reduced-motion`, `:focus-within`.
- **Arbitrary properties** `[background:linear-gradient(...)]`, `[mask-image:var(--mask)]`, `[perspective:800px]`, `[transform:rotateX(35deg)]` — for `color-mix` gradients, sprite masks, 3D. Asset URLs: `import` the asset and pass it through an inline `style={{ "--mask": \`url(\${asset})\` }}` CSS var.
- **Size scales** stay token-driven: `px-[var(--button-px-md)] text-[length:var(--button-text-md)]` (the `--button-*` tokens live in `@theme`). Map size → static utility strings in a `Record`.
- **Animations** use `animate-<name>` utilities backed by a `--animate-*` token (never a `${var}` nested in an arbitrary value — the scanner can't resolve it). Prefer the shared `animate-godui-*` keyframes from `godui-motion`. A component-only `@keyframes` + token live in **two** spots: `styles.css` (so Storybook/docs render) **and** the component's own `registry.json` entry (`cssVars.theme` token + `css` `@keyframes`). Keep them out of `godui-theme` and `godui-motion`.
- **Transitions name compositor properties only** — `transition-opacity`, `transition-transform`, `transition-[translate,scale]`, `transition-[opacity,filter]`. Never bare `transition`, `transition-colors`, `transition-shadow` or `transition-all` (the gate fails them).

Only `@keyframes` and the `@theme` token layer belong in CSS. Everything visual is a utility class on the element.

## Motion — strict GPU-only (required, CI-gated)

Core components animate **only** `transform` (translate / scale / rotate),
`opacity` and `filter`. There is **no allowlist** — the gate in
`packages/components/src/motion-gate/` scans every core source file,
`styles.css` and every `registry.json` `css` block with `@godui/motion-lint`
in strict mode and fails `pnpm test` on anything else. Cheap paint counts too:
no `color`/`background-color`/`border-color` transitions, no bare Tailwind
`transition`, no `transition-colors`.

**CSS-first.** Enter/exit and state motion are CSS keyframes keyed on Radix
`data-[state=open|closed]` (and `data-[side=…]`), using the `godui-motion` tokens:

| Token | Use |
|-------|-----|
| `animate-godui-fade-scale-in` / `-out` | popovers, menus, dialogs, tooltips (pair with `origin-(--radix-…-transform-origin)`) |
| `animate-godui-slide-in-from-{top,right,bottom,left}` / `slide-out-to-*` | sheets, toasts, side-aware popovers; widen with `[--godui-enter-distance:100%]` for full-panel slides |
| `animate-godui-pop` | press feedback |
| `ease-spring-snappy` / `ease-spring-smooth` / `ease-spring-bouncy` | CSS `linear()` springs for `transition-*` (`ease-spring-snappy` etc. utilities) |
| `ease-out-expo` | exits |
| `--godui-duration-fast|base|slow` | 150 / 260 / 380ms, e.g. `duration-(--godui-duration-base)` |

**Sizes snap, positions FLIP.** Never animate `height`, `width`, `grid-template-rows`
or `max-height`. Let the size change instantly; mark siblings that move with
`data-flip` and call `useFlipGroup(containerRef, trigger)` so they glide with an
inverse `translate`; fade/slide the revealed content in with a keyframe.

**Hover/press feedback.** Color changes snap, or put the hover color on an
overlay whose `opacity` transitions. Shadows: a static-shadow layer whose
`opacity` animates. Focus rings: a pseudo-element ring animating `opacity` +
`scale`, never `ring`/`box-shadow` transitions.

**Reduced motion is built into the shared keyframes**: every `godui-*`
keyframe multiplies its movement by `--godui-motion`, which only `:root` sets
(0 under `prefers-reduced-motion`), so a local `[--godui-enter-distance:100%]`
still collapses to a fade; durations shorten and `useFlipGroup` skips. Your own
**transform transitions** (switch thumb, tab indicator, hover lift) are not
covered — add `motion-reduce:transition-none` / `motion-reduce:translate-none` etc.

**Gestures only → `motion` (framer).** Drag-to-dismiss (drawer, toast swipe),
carousel drag, slider thumb spring. `animate`/`initial`/`exit`/`while*` objects may
contain only transform/opacity/filter keys — the gate scans them.

**Prove it at runtime.** Add `apps/storybook/motion-trace/{name}.spec.ts`:

```ts
import { type Page, test } from "@playwright/test";
import { expectGpuOnly, traceInteraction } from "./trace";

test("{name} opens on the compositor", async ({ page }) => {
  const result = await traceInteraction(page, {
    storyId: "ui-{name}--default",
    act: async (p: Page) => {
      await p.getByRole("button", { name: "Open" }).click();
    },
    windowMs: 600,
  });
  expectGpuOnly(result);
});
```

Run with `pnpm --filter storybook test:motion-trace` (real time only — never
`--virtual-time-budget`).

## 4. Storybook story

```typescript
import { MyComponent, type MyComponentProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "UI/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { children: "Default", variant: "primary" } satisfies MyComponentProps,
};
```

Include stories for each variant, sizes, and disabled state.

## 5. Docs page

Core docs have **no category folder**. Each component is its own folder so the
Learn tab can sit beside it: create
`apps/docs/content/docs/components/{name}/index.mdx` (the main page) — the Learn
tab is `learn.mdx` in the same folder (see §5.5).

Besides the Workbench examples, every core page has a **What's animated** table
(interaction, keyframe/token, properties, easing, duration) and a "Replacing
shadcn" note: same file path, same API, install overwrites
`components/ui/{name}.tsx`.

Component pages are **Workbench-first**: stage examples as `<Example>` tabs, then
Installation → Usage → Props in the Docs drawer.

```mdx
---
title: My Component
description: Short description.
date: "2026-07-10"
workbench: true
---

import { MyComponent } from "@godui/components";
import { MyComponentDemo } from "@/components/demos/my-component-demo";

<Workbench>

One-sentence lead.

<Example
  label="Default"
  story="ui-mycomponent"
  code={`import { MyComponent } from "@/components/ui/my-component";

export function MyComponentDemo() {
  return <MyComponent variant="primary">Example</MyComponent>;
}`}
>
  <MyComponentDemo />
</Example>

{/* More variants = more <Example label="…"> tabs only — never ## headings between them */}

## Installation
<ComponentInstall name="my-component" />

## Usage
\`\`\`tsx
import { MyComponent } from "@/components/ui/my-component";
\`\`\`

## Props
| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Visual style |

</Workbench>
```

The `date` frontmatter is the component's **creation date** (`YYYY-MM-DD`) and is
**required for new components**. For one month after that date the sidebar nav
shows a "New" badge (wired via `date` → `frontmatterSchema` in `source.config.ts`
→ `newBadgePlugin` in `src/lib/source.ts`). Use today's date.

`Workbench`, `Example`, and `ComponentInstall` are registered globally in
`apps/docs/src/components/mdx.tsx`.

### Demo layout kit (`apps/docs/src/components/demos/_kit.tsx`)

| Kit | When | Example `fullWidth` |
| --- | --- | --- |
| `DemoCenter` | Buttons, inputs, small cards | no |
| `DemoMedia` | Image compare / accordion / galleries | no |
| `DemoScrollPort variant="fill"` | Stage-fill scrubbers (container-scroll, hero-parallax, beam-draw) | **yes** |
| `DemoScrollPort variant="framed"` | Mini readers (scroll-progress, scroll-text-reveal, scroll-reveal) | no |
| `DemoScene` | Full-bleed scenes (backgrounds, dock, inertia gallery) | **yes** |

Do **not** nest `max-w-*` under `fullWidth` unless the demo intentionally builds an inset scene.

### Example content standard (stage tabs)

Every component page should feel like it was authored with the same taste — not a
mix of “Press me” fillers and full desktop scenes.

| Tab | Content |
| --- | --- |
| **Default** | One intentional product moment. Real verbs / labels (`Get started`, `Hold to delete`, `Email address`). Not a variant matrix. Not “Press/Hover/Push me”. Optional companion CTA only when the component is naturally a pair (e.g. primary + outline). |
| **Variants / Masks / …** | Prop galleries. Distinct product labels per item (`Continue` / `Save draft` / `View docs`) — or Short/Medium/Large for sizes. Never make Default *be* this gallery when the tab also exists. |
| **Feature tabs** | Only unique behaviors (Loading, Squash, Async, Static Label). Drop tabs that re-show Default. |
| **Disabled** | Same label as Default + `disabled`. |

**Polish ceiling:** bare control centered on the stage is the default. Reserve
`DemoScene` / habitat chrome (wallpaper, menu bars) for environmental components
(dock, backgrounds, pointer playgrounds) — don’t under-author buttons to look
random, and don’t over-author every control into a fake desktop.

**Mobile preview (required check).** The Workbench stage has a desktop/mobile toggle; mobile renders the demo inside a **360px** `<iframe>` so real `@media` queries fire. Demos must be fluid so they don't overflow it, **without changing the desktop rendering**:

- Swap a fixed `w-[26rem]` for `w-full max-w-[26rem]` — on the wide desktop container this still resolves to 26rem (identical), but shrinks below 360px on mobile.
- Any padding/margin you add purely to keep the card off the mobile edges must be **mobile-only** — gate it with `max-sm:` (e.g. `max-sm:px-4`, `max-sm:mx-4`) so desktop stays byte-for-byte the same. Never add flat `px-4`/`mx-4` that also hits desktop.

Always flip the toggle to mobile AND back to desktop: mobile must not clip or h-scroll, desktop must look exactly as before (see §8).

**MDX `<p>`-in-`<p>` hydration trap (happens frequently).** Inside Example
children, any text sitting on **its own line** inside a block element gets wrapped by MDX
in an extra `<p>`. If that element is itself a `<p>` (or the preview already lives inside
prose), you get `<p>` nested in `<p>` → `In HTML, <p> cannot be a descendant of <p>` and a
hydration error. **Keep text inline on the same line as its tag:**

```mdx
<!-- WRONG — MDX wraps the text in its own <p> -->
<p className="...">
  Your content sits above the background.
</p>

<!-- RIGHT — text inline, no extra <p> -->
<p className="...">Your content sits above the background.</p>
```

This is render-only (the live children), so `eslint` / `biome` won't catch it — it only
shows in `docs:dev`. Same trap applies to any block tag with multi-line bare text.

**Parameterized installs (Extras backgrounds only).** A component
whose install should bake a choice is served by the dynamic route
`apps/docs/src/app/r/extras/[item]/route.ts` (wrapping `@godui/extras/registry`) via a
`?variant=` query param — **not** by `shadcn build`. Such items are removed from
`registry.json` so the route owns `/r/{name}.json`, the generated component carries its
overridable defaults inside `// @default-props:start/end` markers (the route swaps that
block), and the install command is the full-URL form
`shadcn add "https://godui.design/r/{name}.json?variant=…"`. The interactive picker lives in
`apps/docs/src/components/background-showcase.tsx`.

**Nav:** `components` and `extras` are Fumadocs **root folders** (sidebar tabs).
Register a core page in `apps/docs/content/docs/components/meta.json` (`pages`
entries are paths relative to that folder, e.g. `"popover"`); a page absent from it
won't appear in the Components tab.

Also add a `<PreviewCard>` for the component to
`apps/docs/content/docs/components/index.mdx` (hand-maintained). `<PreviewCard>`
(registered globally in `mdx.tsx`) takes `href` + `title` with the description as
children, and renders a live **placeholder preview** on top (see §6):

```mdx
<PreviewCard href="/docs/components/my-component" title="My Component">
  One-line description of what it does.
</PreviewCard>
```

## 5.5. Learn tab (required)

Every component ships a **Learn tab** — a scroll-triggered, animated deep-dive that sits
beside the main page as `apps/docs/content/docs/components/{name}/learn.mdx`
(same folder as `index.mdx`, which is why the page is a folder, not a flat `.mdx`).

**Invoke the `godui-learn-article` skill to build it** — it owns the routing, the tab
wiring, the `ScrollScene` primitive, scene patterns, and the gotchas. Don't hand-roll it.

The article ends with a **Motion Score** section (a `## Motion Score` heading +
`<MotionScorePanel name="{name}" />` before `## The result`) that grades the component's
animated properties S→F — the learn skill's §6.5 covers the pattern (shared panel +
registry entry in `motion-score-panels.ts`). Its grade comes from the component's
`MOTION_NOTES` entry (`apps/docs/src/lib/motion-notes.ts`), the same signal behind the
docs-page **Motion** badge — so add/verify that entry. **Static (`STATIC_COMPONENTS`)
components get no Motion Score section and no Motion badge** — only the green "Static"
badge.

Non-negotiable when authoring the scenes (the learn skill covers this in full, repeated
here because it's the most common review bounce): **use the black/white pattern and verify
BOTH themes.** Illustrative shapes use theme tokens (`--foreground`, `--background`,
`--card`, `--muted`) — **never** fixed-luminance colors (`bg-black/*`, `bg-white/*`,
`border-white/*`, `text-white`, hex), which only contrast in one theme and vanish in the
other. Contrast a `--foreground` surface with `--background` overlays/icons (and vice-versa),
and border same-colored plates with `border-[var(--foreground)]/20`. Toggle light↔dark and
confirm nothing disappears before finishing.

## 6. Component index placeholder preview (required)

Every index card shows a uniform **skeleton placeholder** — muted gray blocks + a single
accent highlight on a dotted background, animating on card hover. They are NOT live
components; they all share one visual language so the grid reads consistently. Add one for
each new component:

**a. Create `apps/docs/src/components/card-previews/previews/{name}.tsx`** — a default-export
built from the shared kit (`./_kit`): `Sk` (gray block `bg-[var(--muted-foreground)]/20`),
`Ac` (the single accent, `bg-primary`), `Panel` (framed surface). Set shape/size via
`className`. Drive motion with CSS `group-hover` only (the card root is `group`) — no `play`
prop, no JS/framer, no remote images.

```tsx
"use client";

import { Ac, Sk } from "./_kit";

export default function MyComponentPreview() {
  return (
    <div className="relative h-10 w-32">
      <Sk className="h-9 w-32 rounded-lg" />
      <Ac className="absolute inset-0 origin-left scale-x-[0.33] rounded-lg transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
}
```

Common motion patterns (GPU-only here too): `origin-* scale-y-0 group-hover:scale-y-100`
(reveal), `group-hover:translate-*/scale-*/rotate-*`, staggered `style={{ transitionDelay }}` on plain
divs, `[background:radial-gradient(...var(--primary)...)]` glows. Keep it minimal and
abstract — one representative motif, ~`size-24` / a single pill / a small panel.

**b. Register the slug** in `apps/docs/src/components/card-previews/registry.tsx` — add
`"{name}"` to the `CURATED_SLUGS` array (under its category). The registry lazy-imports
`./previews/{slug}` by the card href's last segment, so the filename **must** equal that
slug.

## 7. Naming rules

- Component names must be valid JS identifiers (`MagicButton` not `3DButton`)
- File names: kebab-case (`shimmer-button.tsx`, `magic-button.tsx`)
- Export PascalCase component + prop types from `index.ts`

## 8. Anti-patterns

- **NEVER** construct Tailwind class names dynamically (`grid-cols-${n}`) — map to static strings; the scanner can't see interpolated classes.
- **NEVER** skip `@source "./src"` in `styles.css`.
- **NEVER** create a CSS file or add `@layer components` rules for a component — use inline Tailwind utilities (see §3). Only `@keyframes` + the `@theme` token layer live in `styles.css`.
- **NEVER** diverge from shadcn's public API (names, props, `data-slot`s) — additive only. Core uses React 19 `ref`-as-prop like shadcn v4, not `forwardRef`.
- **NEVER** add `"use client"` unless hooks/client APIs are used.
- **NEVER** animate anything but transform/opacity/filter — no `height`, `width`, `box-shadow`, `color`, bare `transition`, `transition-colors`, `transition-all`. There is no allowlist (see "Motion").
- **NEVER** invent spring/duration/easing numbers — use `godui-motion` tokens (`animate-godui-*`, `ease-spring-*`, `--godui-duration-*`).
- **NEVER** use arbitrary z-index — use the scale: `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast`.
- **NEVER** put bare text on its own line inside a block tag in `Example` children — MDX wraps it in a `<p>`, causing `<p>`-in-`<p>` hydration errors. Keep text inline (see §5).
- **NEVER** skip nav registration — add the page to `apps/docs/content/docs/components/meta.json` and a `<PreviewCard>` in `components/index.mdx`, or it won't appear (see §5).
- **NEVER** ship a component without a Learn tab — every component needs `{name}/learn.mdx`, built via the `godui-learn-article` skill (see §5.5).
- **NEVER** use fixed-luminance colors (`bg-black/*`, `bg-white/*`, `border-white/*`, `text-white`, hex) in a Learn scene — they only contrast in one theme. Use theme tokens and verify light **and** dark (see §5.5).
- **NEVER** ship a `<PreviewCard>` without its placeholder preview — create `card-previews/previews/{name}.tsx` (filename = href slug) and add the slug to `CURATED_SLUGS`, or the card renders text-only and breaks the uniform grid (see §6).
- **NEVER** give a demo (or the component itself) a fixed width wider than the mobile preview — the Workbench stage has a mobile toggle that renders the demo in a **360px** iframe, so a hard `w-[26rem]`/`w-96`/`min-w-[...]` overflows and clips. Use fluid widths: `w-full max-w-[26rem]` (shrinks on mobile, still 26rem on desktop). Gate any extra edge padding/margin to mobile with `max-sm:` so **desktop stays unchanged** — never add flat `px-4`/`mx-4` that also alters desktop (see §5).

## 9. Theme tokens

| Category | Examples | Backing token |
|----------|----------|---------------|
| Colors | `bg-primary`, `text-foreground`, `border-border`, `hover:bg-accent` | `--color-*` |
| Radius | `rounded-sm/md/lg/xl` | `--radius-*` |
| Shadows | `shadow-2xs` … `shadow-2xl` | `--shadow-*` |
| Z-index | `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast` | `--z-index-*` |
| Fonts | `font-sans`, `font-mono`, `font-serif` | `--font-*` |

## 10. Checklist

- [ ] `packages/components/src/ui/{name}.tsx` mirroring shadcn new-york-v4 (same exports/props/`data-slot`s/Radix), header comment with the mirrored version
- [ ] Exported (components + prop types) from `index.ts`
- [ ] Styles authored as inline Tailwind utilities — no CSS file / no `@layer components`
- [ ] Motion: `animate-godui-*` on Radix `data-[state]`, `ease-spring-*` / `--godui-duration-*`; transform/opacity/filter only; sizes snap + `useFlipGroup`; gate green (`pnpm --filter @godui/components test`)
- [ ] `registry.json` entry (`registry:ui`, `registryDependencies` incl. `@godui/godui-motion` + upstream shadcn deps), then `pnpm build:registry`
- [ ] Vitest `src/ui/{name}.test.tsx`: shadcn's canonical usage renders with the same `data-slot` tree; open/close + keyboard; reduced motion
- [ ] Storybook story `stories/ui/{name}.stories.tsx` (title `UI/{Name}`, `tags: ["autodocs"]`)
- [ ] Runtime trace spec `motion-trace/{name}.spec.ts` passing (`pnpm --filter storybook test:motion-trace`)
- [ ] Docs `components/{name}/index.mdx` with Workbench + Example + ComponentInstall + "What's animated" table + "Replacing shadcn" note
- [ ] Learn tab `components/{name}/learn.mdx` built via the `godui-learn-article` skill — scenes verified in **both** light and dark
- [ ] `date: YYYY-MM-DD` (today) in the MDX frontmatter
- [ ] Example children: text inline in its tag (no `<p>`-in-`<p>`)
- [ ] Registered in `components/meta.json`; `<PreviewCard>` in `components/index.mdx`; placeholder preview + slug in `CURATED_SLUGS`
- [ ] Static Tailwind classes only (no dynamic class construction)
- [ ] Demo is fluid (≤360px safe); verified via the Workbench mobile toggle
- [ ] Verified in Storybook and docs after dev server restart
