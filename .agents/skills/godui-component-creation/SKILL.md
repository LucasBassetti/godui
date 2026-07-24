---
name: godui-component-creation
description: Create new components for the GodUI design system in @godui/components. Use when adding a component, fixing missing Tailwind styles on components, wiring Storybook stories, or writing docs pages (main page + required Learn tab) with ComponentPreview and ComponentInstall.
---

# GodUI Component Creation

Follow this workflow when adding a component to `@godui/components`.

## Quick reference

| Step | File |
|------|------|
| Component | `packages/components/src/{name}.tsx` |
| Export | `packages/components/src/index.ts` |
| Tailwind scan | `packages/components/styles.css` → `@source "./src"` |
| Keyframes (dev) | `packages/components/styles.css` → `@keyframes` (+ `--animate-*` in `@theme`) |
| Keyframes (dist) | the component's own `registry.json` entry → `cssVars.theme` (token) + `css` (`@keyframes`) — **not** the shared `godui-theme` |
| Storybook | `apps/storybook/src/stories/{name}.stories.tsx` |
| Docs | `apps/docs/content/docs/components/{category}/{name}/index.mdx` |
| Learn tab (required) | `apps/docs/content/docs/components/{category}/{name}/learn.mdx` + scenes in `apps/docs/src/components/learn/` — **use the `godui-learn-article` skill** |
| Index card | `apps/docs/content/docs/components/index.mdx` → `<PreviewCard>` |
| Placeholder preview | `apps/docs/src/components/card-previews/previews/{name}.tsx` + slug in `registry.tsx` |
| Nav | `apps/docs/content/docs/components/meta.json` |

## 1. Create the component

Use static Tailwind utility classes with design tokens. Map variants to static class strings:

```typescript
import * as React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  outline: "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button };
```

Export the component **and its prop/variant types** from `packages/components/src/index.ts`:

```typescript
export { Button, type ButtonProps, type ButtonVariant } from "./button";
```

Only add `"use client"` when the component uses React hooks or client-only APIs.

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

- `apps/storybook/src/tailwind.css` → `@source "../node_modules/@godui/components/src"`
- `apps/docs/src/app/globals.css` → `@source "../../../../packages/components/src"`

If utilities like `bg-primary` render unstyled, verify `@source "./src"` exists and restart the dev server. Both apps already depend on `@godui/components` via `workspace:*` and it is in the docs `transpilePackages` — no `pnpm install` needed for a new component in the shared package.

## 3. Styling approach — inline Tailwind only

**Author all component styles as inline Tailwind utilities in the `.tsx`.** Do **not** create CSS files or add `@layer components` blocks. `styles.css` is the Tailwind **entry only** (`@import`, `@theme`, `@custom-variant`, `@keyframes`).

Express CSS-heavy designs (3D buttons, sprite masks, gradients, state machines) with utilities + arbitrary values rather than a stylesheet:

- **`group` / `peer`** on the parent + `group-hover:` / `group-focus-visible:` / `group-active:` on children — replaces `.parent:hover .child` descendant selectors.
- **`group-data-[variant=default]:` / `data-[status=loading]:`** — replaces `[data-variant="x"]` state selectors. Keep the `data-*` attributes on the element.
- **`has-[…]:`, `placeholder:`, `motion-reduce:`, `focus-within:`** — replace `:has()`, `::placeholder`, `prefers-reduced-motion`, `:focus-within`.
- **Arbitrary properties** `[background:linear-gradient(...)]`, `[mask-image:var(--mask)]`, `[perspective:800px]`, `[transform:rotateX(35deg)]` — for `color-mix` gradients, sprite masks, 3D. Asset URLs: `import` the asset and pass it through an inline `style={{ "--mask": \`url(\${asset})\` }}` CSS var.
- **Size scales** stay token-driven: `px-[var(--button-px-md)] text-[length:var(--button-text-md)]` (the `--button-*` tokens live in `@theme`). Map size → static utility strings in a `Record`.
- **Animations** use `animate-<name>` utilities backed by a `--animate-*` token (never a `${var}` nested in an arbitrary value — the scanner can't resolve it). A component's `@keyframes` + token live in **two** spots: `styles.css` (`@keyframes` + `@theme`, so Storybook/docs render) **and** the component's own `registry.json` entry (`cssVars.theme` token + `css` `@keyframes`). Keep them out of the shared `godui-theme` entry so installing one component pulls only its own animations; shared keyframes repeat per entry (the CLI dedupes on install).
- **Never `transition: all`** — specify exact properties (`transition-transform`, `[transition:filter_600ms]`).

Only `@keyframes` and the `@theme` token layer belong in CSS. Everything visual is a utility class on the element.

## Motion — use the guideline tokens (required)

All animation must speak the GodUI **motion language**. Do not invent new spring,
duration, or easing numbers — pick from the documented presets so the new
component feels like the rest of the library.

**Source of truth:** `packages/components/src/motion/tokens.ts` (re-exported from
`@godui/components` and from the docs). Copy-paste components are self-contained,
so **use these values _inline_** — don't import the module into a component.
The docs/guidelines import it; components mirror the values. They must match.

| Token | Values |
|-------|--------|
| `DURATION` | `fast 0.15`, `base 0.2`, `slow 0.3`, `slower 0.4` (seconds; larger-traversal/ambient) |
| `EASE` (Motion tuple) | `standard [0.3,0.7,0.4,1]`, `out [0.22,1,0.36,1]`, `back [0.3,0.7,0.4,1.5]`, `inOut [0.65,0,0.35,1]` |
| `EASE_CSS` (className) | `cubic-bezier(0.3,0.7,0.4,1)` standard · `…,1.5` back · `cubic-bezier(0.22,1,0.36,1)` out |
| `SPRING` | `smooth {320,32,mass 0.9}` · `crisp {500,40}` · `snappy {520,32}` · `bouncy {170,12,mass 0.1}` |
| `STAGGER` | `tight 0.03`, `base 0.05`, `loose 0.08` |
| `ENTER` / `EXIT` | `{opacity:0,y:12}` / `{opacity:0,y:8}` |

Pick the spring by intent: **smooth** = surfaces/morph/shared-layout, **crisp** =
height/collapse, **snappy** = menus/popovers/overlays pop, **bouncy** =
magnify/overshoot/follow-through.

Follow the principles ([/docs/guidelines/principles](/docs/guidelines/principles),
recipes at [/docs/guidelines/patterns](/docs/guidelines/patterns)):

- **Performance is enforced — animate `transform`, `opacity`, or `filter` only.**
  These run on the compositor and hold 60fps. A CI test
  (`src/motion/motion-lint.test.ts`, part of `pnpm test`) scans every component and
  **fails the build** on any animation of a layout/paint-heavy prop —
  `width`/`height`/`inset`/`margin`/`padding`/`flex`/`gap`, `box-shadow`,
  `background-size`, `clip-path`, `border-radius`. `transition-all` and ambient
  (looping) layout animation are **hard-banned**, no escape. It scans both CSS
  transitions (`[transition:…]`) and framer objects (`animate`/`whileHover`/`exit`/…).
  - **Fix, don't dodge:** a `box-shadow` transition → a static-shadow overlay whose
    `opacity` animates; a growing `width` → `transform: scaleX`; a colour glow →
    an opacity cross-fade. (`filter` is fine — browsers composite it.)
  - **Genuinely intrinsic?** shared-layout morph, `height:auto` collapse, SVG beam
    geometry — add an entry to `src/motion/motion-allowlist.ts` with a one-line
    reason. That list is an audit trail; a growing list is a smell. Check locally:
    `pnpm --filter @godui/components test:motion`.
- **Always honor reduced motion.** Use `useReducedMotion()` and drop transforms
  (keep a subtle opacity change or go static); for CSS transitions add
  `motion-reduce:[transition:none]`. ~Every animated component does this already.
- **Never `transition: all`** — name exact properties (see §3).

```tsx
import { motion, useReducedMotion } from "framer-motion";

const reduce = useReducedMotion();
<motion.div
  initial={reduce ? false : { opacity: 0, y: 12 }}   // ENTER
  animate={{ opacity: 1, y: 0 }}
  exit={reduce ? undefined : { opacity: 0, y: 8 }}     // EXIT
  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 32 }} // SPRING.snappy
/>;
```

## 4. Storybook story

```typescript
import { MyComponent, type MyComponentProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/MyComponent",
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

Docs live under a **category subfolder** (e.g. `buttons/`, `text/`), and each component
is its **own folder** so the Learn tab can sit beside it: create
`apps/docs/content/docs/components/{category}/{name}/index.mdx` (the main page) — a Learn
tab will be added as `learn.mdx` in the same folder (see §5.5). Use the Preview/Code tabs,
then Installation, Usage, Props:

```mdx
---
title: My Component
description: Short description.
date: "2026-07-10"
---

import { MyComponent } from "@godui/components";

<ComponentPreview code={`import { MyComponent } from "@godui/components";

export function MyComponentDemo() {
  return <MyComponent variant="primary">Example</MyComponent>;
}`}>
  <MyComponent variant="primary">Example</MyComponent>
</ComponentPreview>

The `date` frontmatter is the component's **creation date** (`YYYY-MM-DD`) and is
**required for new components**. For one month after that date the sidebar nav
shows a "New" badge (wired via `date` → `frontmatterSchema` in `source.config.ts`
→ `newBadgePlugin` in `src/lib/source.ts`). Use today's date.

## Installation
<ComponentInstall componentName="MyComponent" />

## Usage
\`\`\`tsx
import { MyComponent } from "@godui/components";
\`\`\`

## Props
| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `variant` | `"primary" \| "secondary"` | `"primary"` | Visual style |
```

`ComponentPreview` and `ComponentInstall` are registered globally in `apps/docs/src/components/mdx.tsx`.

**Mobile preview (required check).** `ComponentPreview` has a desktop/mobile toggle; mobile renders the demo inside a **360px** `<iframe>` so real `@media` queries fire. Demos must be fluid so they don't overflow it, **without changing the desktop rendering**:

- Swap a fixed `w-[26rem]` for `w-full max-w-[26rem]` — on the wide desktop container this still resolves to 26rem (identical), but shrinks below 360px on mobile.
- Any padding/margin you add purely to keep the card off the mobile edges must be **mobile-only** — gate it with `max-sm:` (e.g. `max-sm:px-4`, `max-sm:mx-4`) so desktop stays byte-for-byte the same. Never add flat `px-4`/`mx-4` that also hits desktop.

Always flip the toggle to mobile AND back to desktop: mobile must not clip or h-scroll, desktop must look exactly as before (see §8).

**MDX `<p>`-in-`<p>` hydration trap (happens frequently).** Inside `ComponentPreview`
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

**Parameterized installs (e.g. a background variant baked into the file).** A component
whose install should bake a choice is served by the dynamic route
`apps/docs/src/app/r/[item]/route.ts` (wrapping `@godui/components/registry`) via a
`?variant=` query param — **not** by `shadcn build`. Such items are removed from
`registry.json` so the route owns `/r/{name}.json`, the generated component carries its
overridable defaults inside `// @default-props:start/end` markers (the route swaps that
block), and the install command is the full-URL form
`shadcn add "https://godui.design/r/{name}.json?variant=…"`. The interactive picker lives in
`apps/docs/src/components/background-showcase.tsx`.

**Nav is driven by one root file: `apps/docs/content/docs/meta.json`** (not a per-folder
`meta.json`, and there is **no** Fumadocs folder auto-nav here — a page absent from this
file simply won't appear in the sidebar). Slugs are the full path from `docs/`, i.e.
`components/{category}/{name}`. Category headers use the `---Label---` separator:

```json
{
  "title": "GodUI",
  "pages": [
    "---Buttons---",
    "components/buttons/magic-button",
    "components/buttons/my-component",
    "---Text---",
    "components/text/typography"
  ]
}
```

Also add a `<PreviewCard>` for the component to its category section in
`apps/docs/content/docs/components/index.mdx` (the Components landing grid) — that page is
hand-maintained too. `<PreviewCard>` (registered globally in `mdx.tsx`) takes the same
`href` + `title` as the old fumadocs `<Card>`, with the description as children, and renders
a live **placeholder preview** on top (see §6):

```mdx
<PreviewCard href="/docs/components/buttons/my-component" title="My Component">
  One-line description of what it does.
</PreviewCard>
```

## 5.5. Learn tab (required)

Every component ships a **Learn tab** — a scroll-triggered, animated deep-dive that sits
beside the main page as `apps/docs/content/docs/components/{category}/{name}/learn.mdx`
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
      <Ac className="absolute inset-y-0 left-0 w-1/3 rounded-lg transition-[width] duration-500 group-hover:w-full" />
    </div>
  );
}
```

Common motion patterns: `grid-rows-[0fr]↔group-hover:grid-rows-[1fr]` (expand/reveal),
`group-hover:translate-*/scale-*/rotate-*`, staggered `style={{ transitionDelay }}` on plain
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
- **NEVER** skip `React.forwardRef` — components must forward refs for composition.
- **NEVER** add `"use client"` unless hooks/client APIs are used.
- **NEVER** invent spring/duration/easing numbers — use the motion tokens (see "Motion"). Match the documented values inline.
- **NEVER** ship an animation without a reduced-motion path, and **never** `transition: all`.
- **NEVER** use arbitrary z-index — use the scale: `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast`.
- **NEVER** put bare text on its own line inside a block tag in `ComponentPreview` children — MDX wraps it in a `<p>`, causing `<p>`-in-`<p>` hydration errors. Keep text inline (see §5).
- **NEVER** rely on folder auto-nav for docs — register the page in the root `apps/docs/content/docs/meta.json` (slug `components/{category}/{name}`) and add a `<PreviewCard>` in `components/index.mdx`, or it won't appear (see §5).
- **NEVER** ship a component without a Learn tab — every component needs `{name}/learn.mdx`, built via the `godui-learn-article` skill (see §5.5).
- **NEVER** use fixed-luminance colors (`bg-black/*`, `bg-white/*`, `border-white/*`, `text-white`, hex) in a Learn scene — they only contrast in one theme. Use theme tokens and verify light **and** dark (see §5.5).
- **NEVER** ship a `<PreviewCard>` without its placeholder preview — create `card-previews/previews/{name}.tsx` (filename = href slug) and add the slug to `CURATED_SLUGS`, or the card renders text-only and breaks the uniform grid (see §6).
- **NEVER** give a demo (or the component itself) a fixed width wider than the mobile preview — `ComponentPreview` has a mobile toggle that renders the demo in a **360px** iframe, so a hard `w-[26rem]`/`w-96`/`min-w-[...]` overflows and clips. Use fluid widths: `w-full max-w-[26rem]` (shrinks on mobile, still 26rem on desktop). Gate any extra edge padding/margin to mobile with `max-sm:` so **desktop stays unchanged** — never add flat `px-4`/`mx-4` that also alters desktop (see §5).

## 9. Theme tokens

| Category | Examples | Backing token |
|----------|----------|---------------|
| Colors | `bg-primary`, `text-foreground`, `border-border`, `hover:bg-accent` | `--color-*` |
| Radius | `rounded-sm/md/lg/xl` | `--radius-*` |
| Shadows | `shadow-2xs` … `shadow-2xl` | `--shadow-*` |
| Z-index | `z-base`, `z-raised`, `z-overlay`, `z-sticky`, `z-popover`, `z-modal`, `z-toast` | `--z-index-*` |
| Fonts | `font-sans`, `font-mono`, `font-serif` | `--font-*` |

## 10. Checklist

- [ ] `packages/components/src/{name}.tsx` with `forwardRef`
- [ ] Exported (component + prop/variant types) from `index.ts`
- [ ] `@source "./src"` in `styles.css`
- [ ] Styles authored as inline Tailwind utilities — no CSS file / no `@layer components` (only `@keyframes` + `@theme` may touch `styles.css`)
- [ ] Motion uses the guideline tokens (DURATION/EASE/SPRING/STAGGER/ENTER/EXIT) inline — no invented numbers; transform/opacity only; reduced-motion handled (see "Motion")
- [ ] Storybook story with `tags: ["autodocs"]`
- [ ] Docs MDX under `components/{category}/{name}/index.mdx` with ComponentPreview + ComponentInstall
- [ ] Learn tab `components/{category}/{name}/learn.mdx` built via the `godui-learn-article` skill — scenes use the black/white pattern and are verified in **both** light and dark theme (see §5.5)
- [ ] Motion Score section in the Learn article (`## Motion Score` + `<MotionScorePanel name="{name}" />` before The result, plus a `MOTION_SCORE_PANELS` registry entry) — grade matches the docs Motion badge; **skip for static (`STATIC_COMPONENTS`) components** (see learn skill §6.5)
- [ ] `date: YYYY-MM-DD` (today) in the MDX frontmatter — required; drives the "New" sidebar badge for one month
- [ ] ComponentPreview children: text inline in its tag (no `<p>`-in-`<p>` — see §5)
- [ ] Registered in root `apps/docs/content/docs/meta.json` as `components/{category}/{name}`
- [ ] `<PreviewCard>` added to its section in `components/index.mdx`
- [ ] Placeholder preview `card-previews/previews/{name}.tsx` (kit skeleton, `group-hover` motion) + slug in `CURATED_SLUGS` (see §6)
- [ ] Static Tailwind classes only (no dynamic class construction)
- [ ] Demo is fluid — `w-full max-w-[...]`, no fixed width wider than 360px; verified via the ComponentPreview mobile toggle (see §8)
- [ ] Verified styles in Storybook and docs after dev server restart
