---
name: godui-learn-article
description: Add a "Learn" tab + tier-S design-engineer article to a GodUI component docs page. Use when writing a Learn deep-dive for a component (motion breakdown, scroll-triggered animated scenes with replay, annotated code, live result). Covers routing, sidebar hiding, the ScrollScene primitive, scene patterns, and every gotcha.
---

# GodUI Learn Article

A **Learn** tab sits at the right of a component page's breadcrumb row (`Docs | Learn`
segmented control). `Docs` is the normal component page; `Learn` is a blog-style,
scroll-animated deconstruction of how the component's motion is built — layered
scenes that auto-play on scroll-in with a replay button, annotated code, and a live
result. Same layout as the rest of docs (sidenav + right TOC).

The tab system, routing, sidebar hiding, and the reusable `ScrollScene` primitive are
**already built and generic**. Adding a Learn article to a *new* component is mostly:
create the folder, write `learn.mdx`, and build a few component-specific scene
components. This skill documents the whole system so you can extend it correctly.

Reference implementation: **Magic Button** —
`apps/docs/content/docs/components/buttons/magic-button/learn.mdx` and
`apps/docs/src/components/learn/*`.

## Quick reference

| Piece | File | Per-component? |
|------|------|----------------|
| Docs page (moved into folder) | `apps/docs/content/docs/components/{cat}/{name}/index.mdx` | ✅ create |
| Learn article | `apps/docs/content/docs/components/{cat}/{name}/learn.mdx` | ✅ create |
| Component-specific scenes | `apps/docs/src/components/learn/{scene}.tsx` | ✅ create |
| Register scenes for MDX | `apps/docs/src/components/mdx.tsx` | ✅ add |
| Reusable scene shell | `apps/docs/src/components/learn/scroll-scene.tsx` | ♻️ reuse |
| Motion Score panel | `apps/docs/src/components/learn/motion-score-panel.tsx` + registry entry | ✅ add registry row (see §6.5) |
| Result preview (live component) | `apps/docs/src/components/learn/result-preview.tsx` | ♻️ generalize or copy |
| Tabs control | `apps/docs/src/app/docs/_components/component-tabs.tsx` | ♻️ generic |
| Page routing + tab wiring | `apps/docs/src/app/docs/[[...slug]]/page.tsx` | ♻️ generic |
| Keep sidebar link active on learn | `apps/docs/src/app/docs/_components/sidebar-active-link.tsx` | ♻️ generic |
| Sidebar prune plugin | `apps/docs/src/lib/source.ts` → `hideLearnPagesPlugin` | ♻️ generic |
| Sidebar nav order | `apps/docs/content/docs/meta.json` | ⚠️ do **not** add the learn page |

## How the system works (read before extending)

### Routing — folder + index.mdx pattern (CRITICAL)

To get `/docs/components/{cat}/{name}` **and** `/docs/components/{cat}/{name}/learn`,
the component must be a **folder with `index.mdx`**, not a flat `{name}.mdx` file:

```
components/buttons/magic-button/
  index.mdx   ← the Docs page (was magic-button.mdx)
  learn.mdx   ← the Learn article
```

**Why not a flat sibling** (`magic-button.mdx` + `magic-button/learn.mdx`): fumadocs
then treats the docs page as a *child* of the folder, so pruning `learn` still leaves
a child and the sidebar renders an expandable "Magic button" group. With `index.mdx`,
`folder.index` is set, pruning `learn` empties `children`, and the prune plugin
collapses the folder back to a plain leaf. Always use the folder+index layout.

The catch-all page (`[[...slug]]/page.tsx`) needs no change per component. It:
- derives `base = slug.slice(0,3)` for `slug[0]==="components" && length>=3`;
- `isLearnPage` = length 4 and last segment `learn`;
- shows the Learn **tab only if `source.getPage([...base,"learn"])` exists**;
- on the learn page, the breadcrumb's last crumb uses the **component** title
  (from `source.getPage(base)`), not the article's frontmatter title;
- component badges (perf/dep) render on the docs page only (`length===3`).

### Sidebar hiding — `hideLearnPagesPlugin`

`source.ts` runs a `transformPageTree.root` plugin that recursively drops any page
node whose `url` ends in `/learn`, and collapses a folder emptied by that removal to
its `index` leaf. Routing is unaffected (`source.getPage` still resolves the learn
page). **Do not** list the learn page in `meta.json` — the explicit `pages` allowlist
plus this plugin keep it out of the sidebar. This plugin is generic; new components
need nothing here.

### Keeping the component link selected on the learn tab

Because the learn route has no sidebar node, fumadocs marks the component's sidebar
link `data-active="false"` there. `SidebarActiveLink` (client) flips it back to
`"true"` (with a `MutationObserver` to survive re-renders) **only while
`pathname` is still that component's `/learn`**. On leave it clears the forced
flag (immediately if another sidebar item is already active) so client
navigation never leaves two `data-active="true"` pills. `page.tsx` renders it
when `isLearnPage`. Generic — no per-component work.

## Adding a Learn article to a new component

### 1. Convert the component page to a folder

```bash
git mv apps/docs/content/docs/components/{cat}/{name}.mdx \
       apps/docs/content/docs/components/{cat}/{name}/index.mdx
```

Route and content are unchanged. `meta.json` still references
`components/{cat}/{name}` and resolves to the folder index — leave it as-is.

### 2. Read the real component source

The article must be grounded in the actual implementation, not invented. Read
`packages/components/src/{name}/{name}.tsx` and note the true mechanisms: transforms,
transition timings/beziers, keyframes, observers, a11y (keyboard/`focus-visible`/
`motion-reduce`). Every claim and code excerpt in the article comes from here.

### 3. Build component-specific scenes

Each interactive block wraps the shared `ScrollScene`. Its render-prop hands you
`{ cycle, reduced }`:
- **`cycle`** — 0 before scroll-in, 1 on scroll-in, +1 per replay. **Use it as a React
  `key`** on the animated subtree so CSS keyframes restart on replay.
- **`reduced`** — `prefers-reduced-motion`; render the resolved (final) state with no
  animation.

**Reliable replay = keyframes + `key={cycle}` remount.** Do NOT drive scenes with a
transition toggled by a boolean — that replay is unreliable. Use CSS `@keyframes` (in
an inline `<style>`) applied to elements that remount when `cycle` changes.

Skeleton:

```tsx
"use client";

import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes myscene-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.myscene-el { animation: myscene-in 700ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.myscene-static .myscene-el { animation: none; opacity: 1; transform: none; }
`;

export function MyScene() {
  return (
    <ScrollScene label="Section" note="what this shows">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "myscene-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="myscene-el ...">…</div>
        </div>
      )}
    </ScrollScene>
  );
}
```

**Scene design rules:**
- **Match the final component.** Anatomy / structure scenes must use the same
  geometry the reader will see in the Result (open state, direction, piece count).
  If the component is an open FAB with satellites, draw that silhouette — do not
  invent a generic plate stack that doesn't map to the live UI.
- **Don't clone Magic Button visuals.** Reference scenes teach *techniques*
  (keyed keyframes, legends, looping cycles) — not a layout to copy. A new
  component gets scenes invented from *its* source, not a reskin of
  `layer-reveal` / `push-physics` / `rainbow-sweep`.
- **Prose count = diagram count.** If the article says "two layers," the scene
  and legend show two items. Don't add a third plate "for the trigger" when the
  mechanism under discussion is blob vs control.
- **Compositor-only motion**: animate `transform` / `opacity` / `filter` only. No
  `top`/`width`/`box-shadow`/`clip-path`. (The CI motion-lint gate only scans
  `packages/components`, so docs scenes aren't enforced — hold the rule anyway; it's
  the whole point of the article.)
- **Grayscale by default, and theme-safe.** Illustrative plates/shapes use the
  theme tokens `bg-[var(--card)]`, `bg-[var(--muted)]`, `bg-[var(--foreground)]`,
  `bg-[var(--background)]`. Reserve real color for a scene whose *subject is color*
  (e.g. a gradient), and for the live component in the result panel.
- **Black/white pattern — every scene MUST work in BOTH light and dark theme.**
  This is the #1 source of bugs: a shape that's fine in dark mode goes invisible in
  light (or vice-versa). Rules:
  - **Never** use a fixed-luminance color on a theme-colored surface:
    `bg-black/*`, `bg-white/*`, `border-white/*`, `border-black/*`, `text-white`,
    `text-black`, hex like `#000`/`#fff`. Each only contrasts in ONE theme.
    (e.g. a black button `bg-[var(--foreground)]` on light theme is black; a
    `bg-black/25` fill over it is black-on-black → invisible.)
  - **Contrast a surface with the OPPOSITE token.** A surface painted
    `bg-[var(--foreground)]` inverts per theme (black on light, white on dark); an
    overlay/fill/icon on top of it must use `--background` (`bg-[var(--background)]/30`,
    `text-[var(--background)]`) so it inverts the same way and always contrasts.
    Same in reverse for a `--card`/`--background` surface: tint with `--foreground`.
  - **Borders on same-colored fills** (white plate on white canvas): a neutral
    `border-fd-border` is often too faint. Use `border-[var(--foreground)]/20` — a
    foreground-tinted border reads in both themes.
  - **Verify both themes before finishing.** Toggle the docs theme and look at every
    scene; nothing may disappear, and the first/lowest layer must stay visible.
- **No copy on the diagram shapes.** Never put button text ("Hold to delete",
  "Slide to confirm", "Get started") on the animated pieces — it reads as instructional
  UI and distracts from the motion. Where a shape needs to stand in for a label/content,
  use a neutral gray token bar (`h-2 w-12 rounded-full bg-[var(--foreground)]/30`, light
  on dark surfaces). Leave faces blank when the shape alone carries the point. Explanation
  lives in the legend, the mono captions, and the prose — not on the shape. Real component
  labels are fine (and expected) only in the `Result` panel, since that's the live product.
- **Legend swatches MUST match the diagram (color + shape).** This is the #1 legend bug.
  Every bottom-legend entry names a **concrete piece the reader can see** in the scene —
  not an abstract CSS concept with no visual counterpart.

  | Rule | Pass | Fail |
  |------|------|------|
  | **Color** | Swatch fill/border/opacity appears on that diagram piece | Opacity-only ramps (`/30` vs `/60` vs solid) that never appear as distinct pieces; `primary` / white / black that aren't on the diagram |
  | **Shape** | Swatch silhouette matches the piece | Same `h-1.5 w-8 rounded-full` pill for a card, a pointer, a dashed frame, and a hairline |
  | **Meaning** | Name = visible piece (Viewport, Tile, Active plate, Pointer) | Temporal labels (Pan / Settle / Flick) or CSS props (Perspective / Tilt) with no matching cue |

  **Shape vocabulary** (pick the one that matches the piece):
  - **Circle / dot** — pointer, avatar, orb, status, thumb
  - **Plate** (`rounded-md` / `rounded-xl` / card border) — cards, panels, tiles
  - **Pill / bar** — only when the diagram itself uses a pill/bar (token label, progress fill, dock bus)
  - **Dashed rect / ring** — clip viewport, dashed guide, idle/ghost outline
  - **Hairline** — separator, connector, threshold, SVG stroke
  - **Diamond / isometric** — caret, or a tile that *reads* diamond because of `rotateX`/`rotateZ` (draw the swatch with the same transform + fill)

  Prefer a local `LegendSwatch({ kind })` helper (or full shape classes on `swatch`) over always wrapping `item.swatch` in `h-1.5 w-8 rounded-full`. If two legend items would get identical swatches, either differentiate shapes or merge the items.

  **If a concept isn't visible, make it visible first** — then swatch it. Example: a
  `perspective` / overflow clip that has no border → add a dashed viewport outline on
  the diagram, then use a matching dashed-frame swatch. Do **not** invent a circle or
  dotted pill that doesn't exist in the scene (classic 3D Marquee failure).

  Temporal / motion phases (drag → settle → fling) need a **visible cue** for each
  phase (pointer dot, active plate, ghost outline at overshoot) — or rename the legend
  to the pieces that are actually drawn.
- **Label with a grounded legend, not floating tags.** Put a bottom legend row (swatch
  + name + one-liner per element). Floating absolutely-positioned tags read as
  broken — avoid them. Align legend column count with the number of pieces.
- **3D exploded views (only when they help):** center a
  `[transform-style:preserve-3d]` stage in a fixed-size box (`[perspective:1000px]`),
  separate plates along `translateZ`. Works for stacked rectangular layers (Magic
  Button). Avoid for concentric circles — they occlude and look broken; prefer a
  front-facing split (layer A | layer B | together) instead. Don't put readable
  text on rotated plates (it distorts) — name them in the legend.
- **Looping demos** (e.g. a push cycle) are good — use `animation: … infinite`, gated
  behind `cycle > 0` via the keyed remount so it only runs after scroll-in.

Reference scenes (technique patterns, not templates to clone):
- `layer-reveal.tsx` — isometric explode + legend (rectangular layers). Text-free plates.
- `gooey-layers.tsx` — same open silhouette, split by layer (blob | control | both). Uses a `+` glyph, no words.
- `mask-twin-labels.tsx` / `slide-anatomy.tsx` — canonical **token-bar** stand-ins for a label (`h-2 w-12 rounded-full bg-[var(--foreground)]/30`, light on dark).
- `orbit-carousel-orbit.tsx` — motion legend with shape-matched pieces (pointer · active plate · flick ghost), not opacity pills.
- `three-d-marquee-anatomy.tsx` — viewport dashed frame + isometric tile swatch matching the clipped diamond grid.
- `rainbow-sweep.tsx` — the one colored scene (gradient), reuses `animate-magic-rainbow`.
- `push-physics.tsx` — looping rest→hover→press cycle. NOTE: its face still reads "Push me" — that predates the no-copy rule; do **not** copy that, blank the face or use a token bar instead.

### 4. Result preview (live component)

End with the real, interactive component so the reader feels every mechanism. Copy /
generalize `result-preview.tsx` — same `ComponentPreview`-style chrome, importing the
component from `@godui/components`:

```tsx
"use client";
import { TheComponent } from "@godui/components";
// …chrome (border/rounded-2xl/bg-fd-card + bar label "Result")…
// <TheComponent /> instances in a centered flex canvas
```

### 5. Register scenes for MDX

In `apps/docs/src/components/mdx.tsx`, import each scene + `ResultPreview` and add them
to the object returned by `getMDXComponents` (after `PreviewCard`). Keep imports
alphabetically ordered by path (biome `organizeImports` enforces it —
`@/components/lang-badge` sorts before `@/components/learn/*`).

### 6. Write `learn.mdx`

Frontmatter `title` is the **article** title (breadcrumb still shows the component name
via `page.tsx`). Voice: senior design engineer + technical writer — specific,
mechanism-first, no filler. Each section pairs a scene (or code block) with prose.
Suggested spine (scale to the component):

1. **Anatomy** — structural scene (what the layers/pieces are).
2. **The motion** — the signature interaction, timings + bezier, looping scene.
3. **Why this technique** — the perf/craft decision (e.g. transform vs layout).
4. **The showpiece detail** — the one flashy mechanism (often the colored scene).
5. **Cheap when idle / lifecycle** — observers, pausing, cleanup.
6. **Accessibility** — keyboard, `focus-visible`, `motion-reduce`.
7. **Motion Score** — `<MotionScorePanel name="{name}" />`, the static render-cost grade (see §6.5).
8. **The result** — `<ResultPreview />`.

Headings become the right-hand TOC automatically. Use fenced ```tsx blocks with real
excerpts from the component source.

### 6.5. Motion Score panel (required)

Every Learn article carries a **Motion Score** section — a small table that grades the
component's animation by render cost (the official MotionScore S→F tiers: `S` composited
off the main thread … `F` layout thrashing) and rolls its animated properties up to a
final grade (worst tier wins). It sits **directly before `## The result`**, and the whole
section is just the heading + the panel, no prose:

```mdx
## Motion Score

<MotionScorePanel name="{name}" />
```

**Static components get NO Motion Score.** The `*-background` effects in
`STATIC_COMPONENTS` render with plain CSS and never animate — there's nothing to grade, so
they get **no** Motion Score section here **and no Motion badge** on the docs page (they
keep only the green "Static" badge). Skip §6.5 entirely for them.

**Prerequisite — the machine grade.** For an animated component, the final grade comes from
`motionScore("{name}")` (`apps/docs/src/lib/motion-score.ts`), which reads the component's
curated `MOTION_NOTES[{name}]` entry (`apps/docs/src/lib/motion-notes.ts`) + its
`MOTION_ALLOWLIST` props. If the component isn't in `MOTION_NOTES`, it grades **S**
(compositor-only). Make sure that entry exists and is honest first — it's the same signal
that drives the docs-page **Motion** badge.

**Shared panel + registry.** The UI is one reusable component —
`apps/docs/src/components/learn/motion-score-panel.tsx` (already registered in `mdx.tsx`).
Per-component work is only an entry in `apps/docs/src/lib/motion-score-panels.ts`:

```ts
"{name}": {
  title: "Display Name", // same as the docs page title
  properties: [
    // AUDIT THE REAL SOURCE — one row per property the component actually animates.
    // `prop` is the normalised name propTier() grades (lowercase, no hyphens); `label`
    // is how it reads; `note` is one line on what that property drives.
    // Optional `tier` overrides propTier() when the real cost isn't a single CSS
    // property (SVG goo, canvas/WebGL loops) so the worst row matches the header grade.
    { prop: "translate", label: "translate", note: "…what it drives…" },
    { prop: "backgroundposition", label: "background-position", note: "…" },
  ],
},
```

Rules:
- **Audit, don't guess.** List the properties from the component's real transitions /
  keyframes / framer objects (the same source you read in §2). `propTier` grades each:
  `transform`/`opacity`/`filter`/`clip-path` → **S**; `background-position`/`box-shadow`/
  `border-radius`/color/SVG attrs → **C**; `width`/`height`/`margin`/`top`/`font-size` → **D**.
  The header grade (`motionScore(name)`) and the worst row must agree.
- **Do not** create a per-component `*-score.tsx` — extend the registry and drop
  `<MotionScorePanel name="{name}" />` into the Learn MDX.
- It is **not** a `ScrollScene` — it's a static reference table, so no replay/keyed-remount.

### 7. Verify

```bash
pnpm --filter docs exec tsc --noEmit          # types
pnpm exec biome check apps/docs/src/components/learn   # lint
pnpm --filter docs build                       # SSG both routes
```

**Scan for stray copy on the diagram shapes** — every human-readable string inside a
scene (outside the legend/caption/prose) should be a token bar or blank, not button
text. Eyeball the hits; the only quoted words left should be legend/caption strings and
`Result`-panel component labels:

```bash
grep -nE '>[A-Za-z][A-Za-z ]{2,}<' apps/docs/src/components/learn/{scene}.tsx
```

Then run the dev server and check in a browser (a docs dev server may already be
running on a non-3000 port — grep the log). Confirm:
- `Docs | Learn` tabs on the docs page; Learn active on the learn page.
- Sidebar shows the component as a **plain leaf**, **selected on both** tabs; the learn
  page is **not** its own sidebar row.
- Right TOC lists the article headings.
- Scenes auto-play on scroll-in; **replay re-runs** each; reduced-motion shows the
  resolved state.
- **Every legend swatch maps to a visible diagram piece** (same color + shape). Cover
  anatomy *and* motion/lifecycle cards — not just anatomy. No orphan circles/pills for
  CSS concepts that aren't drawn.
- **Motion Score panel** (§6.5) sits before `## The result` as
  `<MotionScorePanel name="{name}" />`, its registry entry exists, its header grade
  matches the worst property row and the docs-page Motion badge, and it reads in
  **both** themes. Static (`*-background`) components have **no** panel and **no**
  Motion badge.
- Component with no learn page shows **no** tabs.

Headless screenshot without installing Playwright (chromium is cached):

```bash
BIN="$HOME/Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell"
"$BIN" --headless --disable-gpu --hide-scrollbars --virtual-time-budget=3000 \
  --window-size=1300,2000 --screenshot=/tmp/learn.png "$URL"
```

To verify replay programmatically, launch with `--remote-debugging-port=9333`, then
drive CDP over the built-in global `WebSocket` (Node ≥20): click
`button[aria-label="Replay animation"]` and assert an animated element's computed
`opacity` drops then returns to 1.

## Gotchas (all hit while building the reference)

- **Flat sibling file breaks the sidebar.** Must be `folder/index.mdx` + `folder/learn.mdx`
  so the prune plugin can collapse the folder to a leaf.
- **`bg-fd-muted` renders wrong** — the GodUI theme aliases `--color-fd-muted` to
  muted-foreground. Use raw `bg-[var(--muted)]` / `bg-[var(--card)]` (matches
  `Segmented` in `docs-tabs.tsx`).
- **Custom CSS vars in `style`** need a cast: `style={{ "--tz": "78px" } as CSSProperties}`
  (import `type { CSSProperties } from "react"`).
- **Inline `<style>`** needs `dangerouslySetInnerHTML` + a `biome-ignore
  lint/security/noDangerouslySetInnerHtml` comment. Keep the CSS a static constant (no
  interpolation of user input).
- **Decorative SVGs** need `aria-hidden="true"` (biome `noSvgWithoutTitle`). The replay
  icon in `ScrollScene` is the canonical circular-arrow SVG.
- **Import order** — biome `organizeImports` sorts by path; fix or run
  `pnpm exec biome check --write <file>`.
- **Commit hook runs `pnpm check && pnpm test`** repo-wide; both must pass before any
  commit. Pre-existing `<img>` warnings in demos are warnings (non-blocking); an
  unsorted import is an error (blocking).
- **Don't animate layout/paint props** even though docs scenes aren't CI-gated.
- **Live component import** works in docs (`@godui/components`); the docs `index.mdx`
  already imports components the same way.
- **Legend ≠ opacity pills.** Never default every legend entry to
  `h-1.5 w-8 rounded-full` with only `--foreground` opacity changes. Shape-match the
  piece (plate / dot / dashed frame / hairline / isometric tile). If the concept isn't
  on the diagram, draw the cue first (e.g. dashed viewport), then swatch it.
- **Prose / legend / diagram stay in sync.** Same piece count; same names; Result
  geometry matches anatomy when the article is teaching structure.
