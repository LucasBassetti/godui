---
name: godui-component-creation
description: Create new core components for GodUI (@godui/components) — animated, drop-in replacements for shadcn/ui with strict GPU-only motion. Use when adding a component, fixing missing Tailwind styles on components, wiring Storybook stories, or writing docs pages (main page + required Learn tab) with Workbench/Example and ComponentInstall.
---

# GodUI Component Creation

GodUI core (`@godui/components`) is **shadcn/ui, animated**: every component is a
drop-in replacement for its shadcn new-york-v4 counterpart (same file, exports,
props, `data-slot`s, Radix primitives) with motion that runs only on the
compositor. Lab — GodUI's expressive, experimental pieces beyond the shadcn
catalog — lives in `@godui/lab` (`packages/lab`), maintained as-is with a
report-only GPU badge; don't add new components there.

## Quick reference

| Step | File |
|------|------|
| shadcn reference | `node packages/components/scripts/vendor-shadcn.mjs {name}` → `packages/components/test/shadcn/{name}.tsx` (verbatim, never edit) |
| Component | `packages/components/src/ui/{name}.tsx` (mirrors shadcn `components/ui/{name}.tsx`) |
| Export | `packages/components/src/index.ts` |
| Tailwind scan | `packages/components/styles.css` → `@source "./src"` |
| Shared motion | `godui-motion` — tokens/keyframes in `packages/components/styles.css`, hooks `src/hooks/use-flip-group.ts` (snap + FLIP) and `src/hooks/use-active-indicator.ts` (sliding indicator), registry item `godui-motion` |
| Component-only keyframes | `styles.css` **and** the component's `registry.json` entry (`cssVars.theme` + `css`) |
| GPU gate | `packages/components/src/motion-gate/` (runs in `pnpm --filter @godui/components test`) |
| Storybook | `apps/storybook/src/stories/ui/{name}.stories.tsx` (title `UI/{Title Case}`, e.g. `UI/Alert Dialog` → id `ui-alert-dialog`) |
| Runtime trace | `apps/storybook/motion-trace/{name}.spec.ts` (`traceInteraction` + `expectGpuOnly`) |
| Docs | `apps/docs/content/docs/components/{name}/index.mdx` (no category folder) |
| Docs demo | `apps/docs/src/components/demos/core/{name}-demo.tsx` (imports `@godui/components`) |
| Learn tab (required) | `apps/docs/content/docs/components/{name}/learn.mdx` built from the core kit in `apps/docs/src/components/learn/core/` (`KeyframeScene`, `SpringCurveScene`, `FlipScene`, `AutoPlayScene`, `LiveResult`) — see the `godui-learn-article` skill for LearnPlayer rules |
| Nav (main sidebar) | `components/{name}` in the root `apps/docs/content/docs/meta.json` (Components section, alphabetical) and `{name}` in `apps/docs/content/docs/components/meta.json` |
| Index card | `apps/docs/content/docs/components/index.mdx` → `<PreviewCard href title>` under its group, preview `apps/docs/src/components/card-previews/core/{name}.tsx` (skeleton `Sk`/`Ac`/`Panel`, GPU-only `group-hover` transitions) registered in `card-previews/registry.tsx` |

## 1. Create the component

Vendor shadcn's current new-york-v4 source first
(`node packages/components/scripts/vendor-shadcn.mjs {name}`), then copy it to
`src/ui/{name}.tsx` and change only classes and motion. Keep its public surface
**identical**: file name, named exports, props, `data-slot` attributes, the
`radix-ui` import, shadcn's own utility classes (including `z-50`, which wins
over the z-index scale here — parity first). Add the header comment naming the
snapshot. API changes are additive only; an extra DOM element needs its own
`data-slot` and is listed as an `extraSlots` entry in the parity test.

Imports stay install-shaped — `@/lib/utils`, `@/components/ui/<x>`,
`@/hooks/<x>` — never relative; the shadcn CLI rewrites `@/` on install.

```tsx
"use client"

// GodUI Popover — mirrors shadcn/ui new-york-v4 components/ui/popover.tsx (registry snapshot 2026-10-01).
// Motion: scales from the trigger and drifts 4px out of it on a spring; fades. GPU-only.

import { Popover as PopoverPrimitive } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

function PopoverContent({ className, align = "center", sideOffset = 4, ...props }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:[--godui-enter-y:-0.25rem] data-[side=left]:[--godui-enter-x:0.25rem] data-[side=right]:[--godui-enter-x:-0.25rem] data-[side=top]:[--godui-enter-y:0.25rem] data-[state=open]:animate-godui-popover-in data-[state=closed]:animate-godui-popover-out",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}
```

Add `export * from "./ui/{name}";` to `packages/components/src/index.ts`.

Parity test shape (`src/ui/{name}.test.tsx`):

```tsx
import * as Shadcn from "../../test/shadcn/popover";
import { expectSlotParity, slotTree } from "../../test/parity";
import * as Godui from "./popover";

function Usage({ ui }: { ui: typeof Shadcn }) { /* shadcn's canonical demo, built from ui.* */ }

const { unmount } = render(<Usage ui={Shadcn} />);
const expected = slotTree();
unmount();
render(<Usage ui={Godui} />); // tsc: GodUI props must accept everything shadcn's do
expectSlotParity(slotTree(), expected);
```

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

- `apps/storybook/src/tailwind.css` → `@source "../node_modules/@godui/components/src"` (and `…/@godui/lab/src`)
- `apps/docs/src/app/globals.css` → `@source "../../../../packages/components/src"` (and `…/packages/lab/src`)

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

Component pages are **Workbench-first** and minimal: stage examples as
`<Example>` tabs, then **only** Installation → Usage → API in the Docs drawer.
No lead paragraph, no motion prose. API = one `### <Part>` per exported part
(one line naming what it renders / is built on + "accepts all its props", then a
`Prop | Type | Default | Description` table of the wrapper's own props/defaults
and the key library props; trivial styled parts get the sentence only).

Motion docs live on the **Learn tab** (`learn.mdx`), after `</LearnPlayer>`:
a **What's animated** table (interaction, keyframe/token, properties, easing,
duration) before `## Why GPU-only`, and a closing `## Replacing shadcn` note
(same file path, same API, install overwrites `components/ui/{name}.tsx`).

```mdx
---
title: My Component
description: Short description.
workbench: true
---

import { MyComponent } from "@godui/components";
import { MyComponentDemo } from "@/components/demos/my-component-demo";

<Workbench>

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

## API

### MyComponent

Renders a native `<div>` and accepts all of its props.

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Visual style |

</Workbench>
```

Core pages carry **no `date` frontmatter** (no "New" badges in the nav).

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

**Parameterized installs (Lab backgrounds only).** A component
whose install should bake a choice is served by the dynamic route
`apps/docs/src/app/r/lab/[item]/route.ts` (wrapping `@godui/lab/registry`) via a
`?variant=` query param — **not** by `shadcn build`. Such items are left out of
`registry-lab.json` so the route owns `/r/lab/{name}.json` (the `/r/{name}.json` and
`/r/extras/{name}.json` rewrites reach it too), the generated component carries its
overridable defaults inside `// @default-props:start/end` markers (the route swaps that
block), and the install command is the full-URL form
`shadcn add "https://godui.design/r/lab/{name}.json?variant=…"`. The interactive picker lives in
`apps/docs/src/components/background-showcase.tsx`.

**Nav:** Components are listed in the **main sidebar** through the root
`apps/docs/content/docs/meta.json` (add `components/{name}` to its Components
section, alphabetical); Lab is header-only. Also add `{name}` to
`apps/docs/content/docs/components/meta.json` (`pages` entries are paths relative to
that folder, e.g. `"popover"`) — the index preview-count test reads its length. A page
absent from either file won't appear.

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

Core articles use the LearnPlayer layout (`learnPlayer: true`) and the shared
core kit in `apps/docs/src/components/learn/core/` (registered in `mdx.tsx`):

| Scene | Shows |
| --- | --- |
| `KeyframeScene motion subject tracks` | a mock surface looping the real `animate-godui-*` enter/exit classes (`subject`: dialog, sheet, menu, tooltip, drawer, toast, check, radio) |
| `SpringCurveScene easing` | the shipped `linear()` / `cubic-bezier()` read back from the browser, plotted |
| `FlipScene variant` | slowed-down FLIP (`accordion` uses the real `useFlipGroup`; `tabs` draws a ghost of the old box) |
| `AutoPlayScene demo` | the real component driven on a timer (`button`, `checkbox`, `command`, `radio`, `switch`, `tabs`, `toggle`, `toggle-group`; add a demo there when you need one) |
| `LiveResult hint` | the final interactive chapter (`isResult`) |

Write 2–3 chapters plus the result, with `code` excerpts copied from the real
source, then `## What's animated`, `## Why GPU-only`, `## Reduced motion` and
`## Replacing shadcn` sections after `</LearnPlayer>`. Core pages have **no Motion Score** — core is CI-gated
GPU-only, and the page shows the GPU-only + shadcn/ui badges instead. Use the
`godui-learn-article` skill for LearnPlayer rules and gotchas when a component
needs a bespoke scene.

Non-negotiable when authoring the scenes (the learn skill covers this in full, repeated
here because it's the most common review bounce): **use the black/white pattern and verify
BOTH themes.** Illustrative shapes use theme tokens (`--foreground`, `--background`,
`--card`, `--muted`) — **never** fixed-luminance colors (`bg-black/*`, `bg-white/*`,
`border-white/*`, `text-white`, hex), which only contrast in one theme and vanish in the
other. Contrast a `--foreground` surface with `--background` overlays/icons (and vice-versa),
and border same-colored plates with `border-[var(--foreground)]/20`. Toggle light↔dark and
confirm nothing disappears before finishing.

## 6. Component index card

The core index (`components/index.mdx`) lists components as `<PreviewCard href title>`
(description as children) under their group heading, alphabetical within the group. Every
card needs a skeleton preview, or it renders text-only and breaks the uniform grid.

**a. Create `apps/docs/src/components/card-previews/core/{name}.tsx`** — a default-export
built from the shared kit (`../previews/_kit`): `Sk` (gray block `bg-[var(--muted-foreground)]/20`),
`Ac` (the single accent, `bg-primary`), `Panel` (framed surface). Set shape/size via
`className`. Drive motion with CSS `group-hover` only (the card root is `group`) — no `play`
prop, no JS/framer, no remote images. Transition only GPU properties
(`transition-[translate,scale,opacity]` / `transition-transform`), never color/size/shadow.

```tsx
"use client";

import { Ac, Sk } from "../previews/_kit";

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

**b. Register it** in `apps/docs/src/components/card-previews/registry.tsx` — add
`import Core<Pascal> from "./core/{name}";` (alphabetical among the `Core*` imports) and
`"{name}": Core<Pascal>,` (or bare `{name}:` when the slug is a plain identifier) in the
`cardPreviews` record under the `// Core` block. The record is keyed by the card href's
last segment, so the key **must** equal the docs slug. Previews are statically imported
(no lazy chunk), so keep them light.

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
- **NEVER** pop a selection indicator (check, dot, chip, selected day) on first paint, remount or menu open — gate the keyframe on a `data-animate` set only when the value changes (the mount rule in `AGENTS.md`; pattern: `checkbox.tsx`).
- **NEVER** invent spring/duration/easing numbers — use `godui-motion` tokens (`animate-godui-*`, `ease-spring-*`, `--godui-duration-*`).
- **NEVER** use arbitrary z-index — use the scale: `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast`.
- **NEVER** put bare text on its own line inside a block tag in `Example` children — MDX wraps it in a `<p>`, causing `<p>`-in-`<p>` hydration errors. Keep text inline (see §5).
- **NEVER** skip nav registration — add `components/{name}` to the root `apps/docs/content/docs/meta.json`, `{name}` to `apps/docs/content/docs/components/meta.json`, and a `<PreviewCard>` in `components/index.mdx`, or it won't appear (see §5).
- **NEVER** ship a component without a Learn tab — every component needs `{name}/learn.mdx`, built via the `godui-learn-article` skill (see §5.5).
- **NEVER** use fixed-luminance colors (`bg-black/*`, `bg-white/*`, `border-white/*`, `text-white`, hex) in a Learn scene — they only contrast in one theme. Use theme tokens and verify light **and** dark (see §5.5).
- **NEVER** ship a `<PreviewCard>` without its placeholder preview — create `card-previews/core/{name}.tsx` and register it as `Core<Pascal>` in `card-previews/registry.tsx` (key = href slug), or the card renders text-only and breaks the uniform grid (see §6).
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

- [ ] shadcn reference vendored to `test/shadcn/{name}.tsx`; `packages/components/src/ui/{name}.tsx` mirrors it (same exports/props/`data-slot`s/`radix-ui`, install-shaped `@/` imports), header comment with the snapshot
- [ ] `export * from "./ui/{name}";` in `index.ts`
- [ ] Styles authored as inline Tailwind utilities — no CSS file / no `@layer components`
- [ ] Motion: `animate-godui-*` on Radix `data-[state]`, `ease-spring-*` / `--godui-duration-*`; transform/opacity/filter only; sizes snap + `useFlipGroup`; gate green (`pnpm --filter @godui/components test`)
- [ ] `registry.json` entry (`registry:ui`, `registryDependencies` incl. `@godui/godui-motion` + upstream shadcn deps), then `pnpm build:registry`
- [ ] Vitest `src/ui/{name}.test.tsx`: `Usage({ ui })` through `Shadcn` and `Godui` → `expectSlotParity`; exports ⊇ shadcn's; open/close + keyboard; reduced motion
- [ ] Storybook story `stories/ui/{name}.stories.tsx` (title `UI/{Title Case}`, `tags: ["autodocs"]`)
- [ ] Runtime trace spec `motion-trace/{name}.spec.ts` (open **and** close; `setup` for the close) passing (`pnpm --filter storybook test:motion-trace`), and shown to fail when the GPU fix is removed if it guards a library override
- [ ] Docs `components/{name}/index.mdx`: Workbench + Example tabs, then only Installation (ComponentInstall) → Usage → API (props table per part); "What's animated" table + "Replacing shadcn" note go in `learn.mdx`
- [ ] Demo `demos/core/{name}-demo.tsx`; Example `code` = demo with `@/components/ui/*` imports
- [ ] Learn tab `components/{name}/learn.mdx` (LearnPlayer + core kit scenes, code excerpts copied from the real source) — verified in **both** light and dark
- [ ] Example children: text inline in its tag (no `<p>`-in-`<p>`)
- [ ] Registered in `components/meta.json` and the root `meta.json` (alphabetical); `<PreviewCard>` + core preview in the index; no `date` frontmatter
- [ ] Static Tailwind classes only (no dynamic class construction)
- [ ] Demo is fluid (≤360px safe); verified via the Workbench mobile toggle
- [ ] Verified in Storybook and docs after dev server restart
