# Component "Learn" Tab — Design Spec

**Date:** 2026-07-19
**Scope:** Magic Button only (first of many). Ships the tab system + one Learn article + the reusable scroll-scene primitive.
**Status:** Approved design, pre-implementation.

## Goal

Add a segmented `Docs | Learn` tab to the top of each component page. `Docs` is the existing content. `Learn` is a tier-S design-engineer blog post that deconstructs the component's motion and construction, using scroll-triggered animated "layer" scenes (with replay) and annotated code walkthroughs — while keeping the current layout (sidenav, right TOC, breadcrumb row) intact.

Only Magic Button gets a Learn page in this first pass. The tab appears **only** on components that have a Learn page.

## Decisions (locked during brainstorming)

1. **Tab style:** segmented pill (`Docs | Learn`), right-aligned on the breadcrumb row. Compact toggle, clearly a switch.
2. **Routing:** separate route per component. `Docs` = existing `/docs/components/buttons/magic-button`; `Learn` = new `/docs/components/buttons/magic-button/learn`. Own URL → shareable, own right-panel TOC (article headings), server-rendered. No client-side single-page toggle.
3. **Authoring:** Learn page is **MDX prose + custom interactive React components**. Connective writing in MDX (so TOC auto-generates from headings); the scroll-animated scenes and code walkthroughs are components dropped into the MDX.
4. **Aesthetic:** illustrative scenes are **pure grayscale**, wrapped in the exact `ComponentPreview` card chrome. Color is reserved for the single scene whose subject *is* color (the rainbow edge) and for embedded live `MagicButton` instances (which keep their real look).
5. **Article:** 6 sections, grounded in the real component mechanics.

## Routing & sidebar mechanics

- New file: `apps/docs/content/docs/components/buttons/magic-button/learn.mdx`. This creates the folder-sibling route at slug depth 4: `["components","buttons","magic-button","learn"]`. The existing flat `magic-button.mdx` is untouched and keeps serving depth-3 `/magic-button`.
- **Sidebar:** `apps/docs/content/docs/meta.json` is an explicit `pages` allowlist. The learn page is **not** added to it → it never appears in the sidebar. No extra hiding config needed.
- `learn.mdx` frontmatter carries its own `title` + `description` (e.g. title "Anatomy of the Magic Button").

## Page rendering (`apps/docs/src/app/docs/[[...slug]]/page.tsx`)

Extend the existing single catch-all page:

- **Detect the component base** for any slug where `slug[0] === "components" && slug.length >= 3`. Component base = first 3 segments. Learn page = base + `["learn"]` (depth 4, last segment `"learn"`).
- **Learn-page existence check:** `source.getPage([...base, "learn"])`. Drives both (a) whether to render the Learn tab on the Docs page, and (b) validity of the Learn route.
- **Tabs render** in/next to the breadcrumb row (see Breadcrumbs change). Passed: `docsHref`, `learnHref`, `active: "docs" | "learn"`, and whether a learn page exists (tab only shows if it does).
- **On the Learn page (depth 4):** breadcrumb reads `Docs › Components › Magic Button` (Magic Button links to the Docs tab); active tab = Learn. Component badges (perf/dep) are **not** shown on the Learn page. Title/description come from `learn.mdx`.
- Keep `generateStaticParams` (already enumerates all pages via `source.generateParams()`, includes the new learn page).

## Breadcrumb + Tabs (`apps/docs/src/app/docs/_components/breadcrumbs.tsx` + new `component-tabs.tsx`)

- Breadcrumb row becomes a flex `justify-between`: crumbs left, `<ComponentTabs>` right (when present).
- New `ComponentTabs` client-or-server component: two links styled as a segmented control, reusing the existing `Segmented` look (`bg-[var(--muted)]` track, raised `bg-[var(--card)]` active thumb) from `docs-tabs.tsx` for visual consistency with the Preview/Code and viewport toggles. Because tabs are navigation (real `<a>` routes), render as links, not stateful buttons.
- Mobile: tabs remain visible (compact); breadcrumb may wrap.

## Reusable scroll-scene primitive

New client component(s) under `apps/docs/src/components/learn/`:

- **`ScrollScene`** — the shared wrapper. Renders `ComponentPreview`-matched chrome: `rounded-2xl border border-fd-border bg-fd-card`, a top bar with a label (segmented-style, non-interactive) + a **replay** button using the exact circular-arrow SVG from `component-preview.tsx`, and a `min-h-[360px]` canvas.
  - **Auto-play on scroll-in:** `IntersectionObserver` adds a `play` state when the scene enters the viewport (fires once, or re-arms — TBD-free: fires once on first entry).
  - **Replay:** bumps a `key`/state to restart the animation (mirror the `replayKey` pattern already in `ComponentPreview`).
  - **Reduced motion:** under `prefers-reduced-motion`, render the final ("exploded"/resolved) state immediately with no transition. Replay is a no-op visual reset.
  - Motion is **transform + opacity + filter only** (compositor-safe) to satisfy the CI motion-perf guardrail (`motion-allowlist.ts`). No animating width/box-shadow/clip-path/top.
- **Scene contents** are passed as children / a render prop, so the same primitive drives all three interactive scenes:
  1. **LayerReveal** — the signature exploded 3-layer stack (grayscale): shadow / edge / front face separate in 3D (`rotateX/rotateZ` stage, `translateZ` per layer) with labels fading in.
  2. **PushPhysics** — a slowed push showing the three layers' `translate-y` deltas across rest → hover (-4→-6px) → press (-2px), annotating the durations (600/250/34ms) and the overshoot bezier `cubic-bezier(0.3,0.7,0.4,1.5)`.
  3. **RainbowSweep** — the only colored scene: the `200% background-size` gradient sliding via `animate-magic-rainbow`, shown slowed with a position marker.

Registered in `getMDXComponents()` (`apps/docs/src/components/mdx.tsx`) so `learn.mdx` can use `<ScrollScene>` / `<LayerReveal>` etc.

## Article outline (`learn.mdx`)

Voice: senior design engineer + technical writer. Deep, specific, grounded in the real source (`packages/components/src/magic-button/magic-button.tsx`). Each interactive scene is followed by prose + an annotated code block explaining that mechanism.

1. **Anatomy — the three-layer stack** → `LayerReveal`. Three `<span>`s (shadow, edge, front face) fake real thickness; why three, how they compose.
2. **The push physics** → `PushPhysics`. Per-state durations (600ms rest / 250ms hover / 34ms press) and the overshoot bezier that gives the springy lift; shadow deepens (translate-y 2→4→1px) while the face lifts (-4→-6→-2px).
3. **Why `translate`, not `top` / `box-shadow`** → annotated code. Compositor-only motion; ties to the repo's motion-perf guardrail. `will-change: translate`.
4. **The rainbow edge** → `RainbowSweep`. `200%` background-size gradient + `animate-magic-rainbow` position flow; `motion-reduce:animate-none`.
5. **Cheap when idle** → annotated code. `IntersectionObserver` pausing the keyframe's `animationPlayState` off-screen (with `rootMargin:128px`).
6. **Accessibility** → keyboard `pressed` state (Enter/Space), `focus-visible` parity with hover, `motion-reduce`, `disabled` handling.

## Out of scope (YAGNI)

- Learn pages for any other component (this pass = Magic Button only; the system generalizes for later).
- MDX authoring helpers beyond the 3 scenes + code blocks.
- Persisting last-viewed tab, deep-linking to a scene, per-scene TOC entries beyond normal MDX headings.
- Search indexing of Learn pages (can revisit).

## Testing / verification

- Motion-perf CI test (`motion-allowlist.ts`) must pass — scenes animate only transform/opacity/filter.
- Learn tab renders on Magic Button, absent on components with no learn page.
- `/docs/components/buttons/magic-button/learn` renders inside `DocsLayout` with sidenav + right TOC populated from article headings.
- Learn page absent from sidebar tree.
- Reduced-motion: scenes show resolved state, no animation; replay is safe.
- Existing Magic Button Docs page visually unchanged except the new tab.
```
