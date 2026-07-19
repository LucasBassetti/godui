# Component "Learn" Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a segmented `Docs | Learn` tab to the Magic Button component page, where `Learn` is a scroll-animated, tier-S design-engineer article at its own route, keeping the existing docs layout intact.

**Architecture:** A new MDX page at `content/docs/components/buttons/magic-button/learn.mdx` renders through the existing `[[...slug]]/page.tsx` catch-all. The page detects component/learn routes, renders a `ComponentTabs` link control in the breadcrumb row, and (on the learn page) hides component badges and titles from the article's own frontmatter. The article uses a reusable client `ScrollScene` primitive (auto-play on scroll-in via `IntersectionObserver`, replay by toggling a `play` flag across a double-rAF, reduced-motion safe) rendering three grayscale scenes plus annotated code blocks.

**Tech Stack:** Next.js 15 (App Router, Turbopack), fumadocs-mdx + fumadocs-ui, Tailwind v4, TypeScript, Biome. Package manager: pnpm (workspace filter `docs`). No unit-test harness in the docs app — verification is `tsc --noEmit`, `biome check`, `next build`, and manual browser checks.

**Conventions to honor:**
- GodUI theme aliases `--color-fd-muted` to muted-foreground — never use `bg-fd-muted`; use raw `bg-[var(--muted)]` / `bg-[var(--card)]` (see `Segmented` in `docs-tabs.tsx`).
- Motion must be transform/opacity/filter only (compositor-safe). The CI motion-lint test only scans `packages/components/src`, so docs scenes aren't gated — but keep the rule anyway.
- Biome enforces `noSvgWithoutTitle` — decorative SVGs need `aria-hidden="true"`.

---

## File Structure

**Create:**
- `apps/docs/src/app/docs/_components/component-tabs.tsx` — server component; segmented `Docs | Learn` link control.
- `apps/docs/src/components/learn/scroll-scene.tsx` — client; reusable scene shell (chrome + auto-play + replay + reduced-motion). Render-prop passes `play: boolean` to children.
- `apps/docs/src/components/learn/layer-reveal.tsx` — client; scene 1 (exploded 3-layer stack).
- `apps/docs/src/components/learn/push-physics.tsx` — client; scene 2 (slowed push, translate deltas).
- `apps/docs/src/components/learn/rainbow-sweep.tsx` — client; scene 3 (gradient sweep, the only colored scene).
- `apps/docs/content/docs/components/buttons/magic-button/learn.mdx` — the article.

**Modify:**
- `apps/docs/src/app/docs/[[...slug]]/page.tsx` — learn/route detection, tab wiring, breadcrumb component-title fix.
- `apps/docs/src/components/mdx.tsx` — register `ScrollScene`, `LayerReveal`, `PushPhysics`, `RainbowSweep`.

**Do NOT touch:** `apps/docs/content/docs/meta.json` — leaving the learn page out of its `pages` allowlist is what keeps it out of the sidebar. `magic-button.mdx` stays unchanged.

---

## Task 1: `ComponentTabs` link control

**Files:**
- Create: `apps/docs/src/app/docs/_components/component-tabs.tsx`

- [ ] **Step 1: Write the component**

Mirrors the `Segmented` look from `docs-tabs.tsx` (equal-width grid, floating `--card` thumb over a `--muted` track) but renders navigation links, not stateful buttons.

```tsx
import Link from "fumadocs-core/link";
import { cn } from "@/lib/cn";

export type ComponentTab = { label: string; href: string; active: boolean };

/**
 * Segmented Docs | Learn control shown at the right of the breadcrumb row on
 * component pages that have a Learn article. Tabs are real routes, so they
 * render as links (not buttons). Visual language matches <Segmented>.
 */
export function ComponentTabs({ tabs }: { tabs: ComponentTab[] }) {
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.active),
  );

  return (
    <div
      className="relative inline-grid h-8 shrink-0 rounded-[10px] border border-fd-border bg-[var(--muted)] p-[3px]"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-[3px] left-[3px] rounded-[7px] bg-[var(--card)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{
          width: `calc((100% - 6px) / ${tabs.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          aria-current={tab.active ? "page" : undefined}
          className={cn(
            "relative z-[1] inline-flex items-center justify-center rounded-[7px] px-3 py-[3px] text-[13px] font-medium leading-[18px] transition-colors",
            tab.active
              ? "text-[var(--foreground)]"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter docs exec tsc --noEmit`
Expected: PASS (no errors referencing component-tabs.tsx).

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/app/docs/_components/component-tabs.tsx
git commit -m "feat(docs): add ComponentTabs segmented link control"
```

---

## Task 2: Wire tabs + learn detection into the page

**Files:**
- Modify: `apps/docs/src/app/docs/[[...slug]]/page.tsx`

- [ ] **Step 1: Replace the slug/crumbs/badges logic and the breadcrumb render**

Replace the body of `Page` from the `const slug` line through the `<Breadcrumbs .../>` line (i.e. lines ~24–56) with the block below. Rationale: (a) compute the component base for depth ≥3; (b) detect the learn page (depth 4, last segment `learn`); (c) look up whether a learn page exists to decide if the tab shows; (d) on the learn page, the breadcrumb's final crumb must be the **component** title (from the base docs page), not the article's frontmatter title; (e) badges stay off the learn page (existing `slug.length === 3` guard already excludes it).

```tsx
  const slug = params.slug ?? [];
  const inComponents = slug[0] === "components";
  // Component base = `components/<category>/<name>` (depth 3). The Learn page is
  // that base + `learn` (depth 4). Badges + tabs hang off the base.
  const base = inComponents && slug.length >= 3 ? slug.slice(0, 3) : undefined;
  const isLearnPage = base != null && slug.length === 4 && slug[3] === "learn";
  const isComponentDocsPage = base != null && slug.length === 3;

  // The Learn tab only appears when a learn page actually exists for this
  // component. `source.getPage` returns null when it doesn't.
  const learnPage = base ? source.getPage([...base, "learn"]) : null;
  const hasLearn = learnPage != null;

  const componentName = base ? base[2] : undefined;
  const motionNote = componentName ? MOTION_NOTES[componentName] : undefined;
  const dependencyNote = componentName
    ? DEPENDENCY_NOTES[componentName]
    : undefined;
  const isStatic = componentName ? STATIC_COMPONENTS.has(componentName) : false;

  // On the Learn page, `page.data.title` is the article title — but the
  // breadcrumb should still read the component's name (pulled from the base
  // docs page), with the Learn tab conveying which sub-page you're on.
  const componentCrumbTitle = base
    ? isLearnPage
      ? (source.getPage(base)?.data.title ?? page.data.title)
      : page.data.title
    : undefined;

  const crumbs: Crumb[] = [
    { name: "Docs", url: slug.length ? "/docs" : undefined },
  ];
  if (inComponents) {
    const atComponentsRoot = slug.length === 1;
    crumbs.push({
      name: "Components",
      url: atComponentsRoot ? undefined : "/docs/components",
    });
    if (!atComponentsRoot) {
      crumbs.push({ name: componentCrumbTitle ?? page.data.title });
    }
  } else if (slug.length) {
    crumbs.push({ name: page.data.title });
  }

  const docsHref = base ? `/docs/${base.join("/")}` : undefined;
  const tabs =
    base && hasLearn && docsHref
      ? [
          { label: "Docs", href: docsHref, active: !isLearnPage },
          { label: "Learn", href: `${docsHref}/learn`, active: isLearnPage },
        ]
      : null;
```

- [ ] **Step 2: Replace the breadcrumb row markup**

In the returned JSX, replace the single `<Breadcrumbs crumbs={crumbs} />` line with a flex row that keeps the crumbs left and the tabs right. Keep the badges/title/description block below it unchanged, except the badges condition — change `isComponentPage` to `isComponentDocsPage` (same meaning, renamed).

```tsx
      <div className="-mb-2 flex items-center justify-between gap-4">
        <Breadcrumbs crumbs={crumbs} />
        {tabs ? <ComponentTabs tabs={tabs} /> : null}
      </div>
      {isComponentDocsPage ? (
        <ComponentBadges
          perf={motionNote}
          dep={dependencyNote}
          isStatic={isStatic}
        />
      ) : null}
```

Note: `Breadcrumbs` carries its own `-mb-2`; move that spacing to the wrapper (add `-mb-2` on the wrapper as above) so the row-to-title gap is unchanged. `Breadcrumbs` still returns `null` when there's a single crumb — the wrapper then just holds the tabs (or nothing).

- [ ] **Step 3: Add the import + delete the now-unused `isComponentPage`**

At the top, add:

```tsx
import { ComponentTabs } from "../_components/component-tabs";
```

Ensure no lingering reference to the old `isComponentPage`/`componentName = slug[2]` lines remains (they're replaced above).

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter docs exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/app/docs/[[...slug]]/page.tsx
git commit -m "feat(docs): detect learn route and render component tabs"
```

---

## Task 3: `ScrollScene` primitive

**Files:**
- Create: `apps/docs/src/components/learn/scroll-scene.tsx`

- [ ] **Step 1: Write the component**

Chrome matches `ComponentPreview` (same border/radius/card + top bar + circular replay icon). Auto-plays once when scrolled into view; `replay()` toggles `play` off then on across a double-`requestAnimationFrame` so transition-based scenes re-run from their start state. Under `prefers-reduced-motion`, it sets `play` immediately (scenes suppress their transitions with `motion-reduce:transition-none`, so the final state shows with no motion).

```tsx
"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type ScrollSceneProps = {
  /** Bar label, e.g. "Anatomy". */
  label: string;
  /** Optional muted sub-label to the right of the label. */
  note?: string;
  /** Render-prop; `play` flips true on scroll-in and on replay. */
  children: (play: boolean) => ReactNode;
  className?: string;
};

export function ScrollScene({
  label,
  note,
  children,
  className,
}: ScrollSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduce =
      typeof matchMedia !== "undefined" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !el || typeof IntersectionObserver === "undefined") {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    setPlay(false);
    // Two frames: let the reset state paint before re-arming, so CSS
    // transitions run again from the start.
    requestAnimationFrame(() => requestAnimationFrame(() => setPlay(true)));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          {label}
        </span>
        {note ? (
          <span className="font-mono text-fd-muted-foreground text-xs">
            {note}
          </span>
        ) : null}
        <button
          type="button"
          onClick={replay}
          aria-label="Replay animation"
          title="Replay"
          className="ms-auto inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
      <div className="relative flex min-h-[360px] items-center justify-center p-6 md:min-h-[420px] md:p-10">
        {children(play)}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter docs exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/components/learn/scroll-scene.tsx
git commit -m "feat(docs): add reusable ScrollScene learn primitive"
```

---

## Task 4: The three scenes

**Files:**
- Create: `apps/docs/src/components/learn/layer-reveal.tsx`
- Create: `apps/docs/src/components/learn/push-physics.tsx`
- Create: `apps/docs/src/components/learn/rainbow-sweep.tsx`

All motion is transform/opacity/filter only. Grayscale everywhere except `RainbowSweep`. Values are tuned during implementation; the code below is complete and working.

- [ ] **Step 1: `layer-reveal.tsx` — exploded 3-layer stack**

```tsx
"use client";

import { ScrollScene } from "./scroll-scene";

// One shared transition for all three plates: springy translate + gentle fade.
const PLATE =
  "absolute inset-0 m-auto flex h-[58px] w-[170px] items-center justify-center rounded-[14px] font-semibold text-[13px] [transition:transform_900ms_cubic-bezier(0.3,0.7,0.4,1.2),opacity_500ms] motion-reduce:transition-none";

const TAG =
  "pointer-events-none absolute rounded-md border border-fd-border bg-[var(--muted)] px-2 py-[3px] font-medium text-[11px] text-fd-muted-foreground [transition:opacity_400ms_300ms] motion-reduce:transition-none";

export function LayerReveal() {
  return (
    <ScrollScene label="Anatomy" note="the three-layer stack">
      {(play) => (
        <div className="[perspective:900px]">
          <div className="relative h-[180px] w-[220px] [transform:rotateX(54deg)_rotateZ(-40deg)] [transform-style:preserve-3d]">
            {/* shadow */}
            <div
              className={`${PLATE} bg-black/50 text-white/70 blur-[5px] ${
                play
                  ? "opacity-100 [transform:translateZ(-26px)]"
                  : "opacity-0 [transform:translateZ(0px)]"
              }`}
            >
              shadow
            </div>
            {/* edge */}
            <div
              className={`${PLATE} bg-[var(--muted)] text-fd-muted-foreground ${
                play
                  ? "opacity-100 [transform:translateZ(26px)]"
                  : "opacity-0 [transform:translateZ(0px)]"
              }`}
            >
              edge
            </div>
            {/* front face */}
            <div
              className={`${PLATE} border border-white/10 bg-[var(--card)] text-fd-foreground ${
                play
                  ? "opacity-100 [transform:translateZ(78px)]"
                  : "opacity-0 [transform:translateZ(0px)]"
              }`}
            >
              Push me
            </div>
          </div>

          {/* labels — placed around the stack, fade in after the plates settle */}
          <span
            className={`${TAG} top-6 right-4 ${play ? "opacity-100" : "opacity-0"}`}
          >
            front face — what you press
          </span>
          <span
            className={`${TAG} top-[150px] right-2 ${play ? "opacity-100" : "opacity-0"}`}
          >
            edge — fakes the thickness
          </span>
          <span
            className={`${TAG} bottom-6 left-4 ${play ? "opacity-100" : "opacity-0"}`}
          >
            shadow — grounds it
          </span>
        </div>
      )}
    </ScrollScene>
  );
}
```

- [ ] **Step 2: `push-physics.tsx` — slowed push showing translate deltas**

Renders the real stack head-on (no 3D rotation) and, when `play` flips, walks the front face + shadow through rest → hover-lift → press-dip using the component's own translate values, slowed for legibility. Annotations call out the deltas.

```tsx
"use client";

import { ScrollScene } from "./scroll-scene";

const SLOW = "[transition:transform_1200ms_cubic-bezier(0.3,0.7,0.4,1.5)]";

export function PushPhysics() {
  return (
    <ScrollScene label="Push physics" note="translate-y, springy bezier">
      {(play) => (
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-[64px] w-[150px]">
            {/* shadow: rest 2px → hover 4px → (settles) */}
            <span
              className={`absolute inset-0 rounded-xl bg-black/40 blur-[4px] ${SLOW} motion-reduce:transition-none ${
                play ? "[transform:translateY(4px)]" : "[transform:translateY(2px)]"
              }`}
            />
            {/* edge */}
            <span className="absolute inset-0 rounded-xl bg-[var(--muted)]" />
            {/* front face: rest -4px → hover -6px */}
            <span
              className={`absolute inset-0 flex items-center justify-center rounded-xl border border-white/10 bg-[var(--card)] font-semibold text-[13px] text-fd-foreground ${SLOW} motion-reduce:transition-none ${
                play
                  ? "[transform:translateY(-6px)]"
                  : "[transform:translateY(-4px)]"
              }`}
            >
              Push me
            </span>
          </div>
          <dl className="grid grid-cols-3 gap-x-8 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            <dt className="text-fd-foreground">rest</dt>
            <dt className="text-fd-foreground">hover</dt>
            <dt className="text-fd-foreground">press</dt>
            <dd>600ms</dd>
            <dd>250ms</dd>
            <dd>34ms</dd>
            <dd>face -4px</dd>
            <dd>face -6px</dd>
            <dd>face -2px</dd>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
```

- [ ] **Step 3: `rainbow-sweep.tsx` — the one colored scene**

Reuses the `animate-magic-rainbow` utility (defined in the shipped `@godui/components` styles, already loaded in the docs app). Shows the `200% background-size` gradient sliding; slowed via `--rainbow-speed`. `play` toggles the animation on so replay restarts the sweep from the reset paint.

```tsx
"use client";

import { ScrollScene } from "./scroll-scene";

const RAINBOW_FILL =
  "[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%]";

export function RainbowSweep() {
  return (
    <ScrollScene label="Rainbow edge" note="200% gradient, position flow">
      {(play) => (
        <div
          className="flex w-full max-w-[320px] flex-col gap-4"
          style={{ ["--rainbow-speed" as string]: "5s" }}
        >
          <div
            className={`h-16 w-full rounded-xl ${RAINBOW_FILL} ${
              play ? "animate-magic-rainbow" : ""
            } motion-reduce:animate-none`}
          />
          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            background-position slides across a 200%-wide gradient
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
```

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm --filter docs exec tsc --noEmit`
Then: `pnpm exec biome check apps/docs/src/components/learn`
Expected: both PASS. (If biome flags the `--rainbow-speed` inline-style cast or SVG, follow existing repo patterns — SVGs here have no title and use `aria-hidden`, which is the sanctioned pattern.)

- [ ] **Step 5: Commit**

```bash
git add apps/docs/src/components/learn
git commit -m "feat(docs): add LayerReveal, PushPhysics, RainbowSweep scenes"
```

---

## Task 5: Register scenes as MDX components

**Files:**
- Modify: `apps/docs/src/components/mdx.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { LayerReveal } from "@/components/learn/layer-reveal";
import { PushPhysics } from "@/components/learn/push-physics";
import { RainbowSweep } from "@/components/learn/rainbow-sweep";
import { ScrollScene } from "@/components/learn/scroll-scene";
```

- [ ] **Step 2: Add them to the returned map**

In `getMDXComponents`, add the four to the object (after `PreviewCard`):

```tsx
    ScrollScene,
    LayerReveal,
    PushPhysics,
    RainbowSweep,
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter docs exec tsc --noEmit`
Expected: PASS.

Note: `ScrollScene` takes a render-prop child `(play) => ...`. It's registered so it *can* be used directly in MDX, but MDX children are elements, not functions — the article uses the ready-made `LayerReveal`/`PushPhysics`/`RainbowSweep` wrappers, not `ScrollScene` directly. Registering it is harmless and documents the primitive.

- [ ] **Step 4: Commit**

```bash
git add apps/docs/src/components/mdx.tsx
git commit -m "feat(docs): register learn scene components for MDX"
```

---

## Task 6: Author the Learn article

**Files:**
- Create: `apps/docs/content/docs/components/buttons/magic-button/learn.mdx`

- [ ] **Step 1: Write the MDX**

Six sections, each pairing an interactive scene with prose + an annotated code excerpt drawn from the real source (`packages/components/src/magic-button/magic-button.tsx`). Voice: senior design engineer + technical writer — specific, mechanism-first, no filler. Frontmatter title is the article title (breadcrumb shows the component name via Task 2).

````mdx
---
title: Anatomy of the Magic Button
description: How a pushable 3D button is built from three flat layers, a springy bezier, and a rainbow that costs nothing when idle.
---

A button that feels *pushable* isn't a texture — it's a lie told by three flat
layers and a spring. Here's every trick, pulled apart.

## The three-layer stack

There is no 3D geometry here. The depth is three stacked `<span>`s: a blurred
**shadow** on the surface, a colored **edge** that fakes the side wall, and the
**front face** you actually read. Lift the face a few pixels above the edge and
your eye fills in a solid object.

<LayerReveal />

Each layer is absolutely positioned in the same box, so they overlap perfectly
at rest. Only their vertical offsets differ.

```tsx
<button className="group relative ...">
  <span className="absolute inset-0 rounded-xl ..." aria-hidden />   {/* shadow */}
  <span className="absolute inset-0 rounded-xl ..." aria-hidden />   {/* edge   */}
  <span className="relative block rounded-xl ...">{children}</span>  {/* face   */}
</button>
```

## The push physics

Depth is static; *push* is motion. The face sits at `-4px`, lifts to `-6px` on
hover, and dips to `-2px` on press — while the shadow deepens underneath. What
sells it is the timing: a slow, springy settle at rest, a snappy overshoot on
hover, and a near-instant `34ms` dip on press.

<PushPhysics />

The overshoot lives in the bezier: `cubic-bezier(0.3, 0.7, 0.4, 1.5)` — that
final `1.5` control point pushes past the target and springs back.

```tsx
// front face
"-translate-y-[4px] [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1)]
 group-hover:-translate-y-[6px]
 group-hover:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]
 group-active:-translate-y-[2px] group-active:[transition:translate_34ms]"
```

## Why `translate`, not `top` or `box-shadow`

Every offset animates `translate`, never `top`/`margin` or an animated
`box-shadow`. Transforms are composited — the browser moves an already-painted
layer on the GPU without re-running layout or paint. Animating `top` would
re-flow the page every frame; animating `box-shadow` would re-paint it. This is
the house rule across GodUI's motion, enforced in CI.

```tsx
"[will-change:translate] [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1)]"
```

## The rainbow edge

The optional rainbow isn't a video or a canvas — it's one gradient twice as wide
as the button, slid sideways forever. `background-size: 200% 100%` gives the
slack; a keyframe animates `background-position` across it.

<RainbowSweep />

```tsx
"[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),...)]
 [background-size:200%_100%] animate-magic-rainbow motion-reduce:animate-none"
```

`motion-reduce:animate-none` freezes the sweep for anyone who's asked the OS to
cut motion.

## Cheap when idle

An infinite `background-position` keyframe is main-thread paint — cheap, but not
free, and pointless when the button is off screen. An `IntersectionObserver`
pauses the animation's `animationPlayState` whenever the button scrolls out of
view, and resumes it seamlessly on the way back in.

```tsx
const io = new IntersectionObserver(
  ([entry]) => {
    for (const layer of root.querySelectorAll(".animate-magic-rainbow"))
      layer.style.animationPlayState = entry.isIntersecting ? "" : "paused";
  },
  { rootMargin: "128px" },
);
```

The `128px` margin resumes it just before it re-enters, so you never catch it
mid-restart.

## Accessibility

Real motion needs real semantics. The button tracks a `pressed` state from
`Enter`/`Space` so keyboard users get the same dip as a mouse press;
`focus-visible` mirrors the hover lift so the focused state reads as raised; and
`motion-reduce` disables both the rainbow and — via the OS setting — the springy
transitions.

```tsx
const handleKeyDown = (e) => {
  if (e.key === "Enter" || e.key === " ") setPressed(true);
};
// focus-visible gets the same lift as hover:
"group-focus-visible:-translate-y-[6px]"
```

That's the whole illusion: three flat layers, one springy curve, a gradient on a
timer, and the discipline to animate only what the GPU can move for free.
````

- [ ] **Step 2: Verify the page builds and renders**

Run: `pnpm --filter docs dev` (Turbopack). In a browser, open `http://localhost:3000/docs/components/buttons/magic-button/learn`.
Expected: article renders inside the docs layout; three scenes animate on scroll-in; replay works; right-hand TOC lists the six section headings.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/content/docs/components/buttons/magic-button/learn.mdx
git commit -m "docs(magic-button): add Learn article"
```

---

## Task 7: Full verification

- [ ] **Step 1: Production build**

Run: `pnpm --filter docs build`
Expected: build succeeds; the learn route appears in the generated route list. (This also runs the type check and MDX compilation.)

- [ ] **Step 2: Manual checks (dev server)**

- [ ] `/docs/components/buttons/magic-button` — segmented `Docs | Learn` sits at the right of the breadcrumb row, `Docs` active. Component badges unchanged.
- [ ] Click `Learn` → routes to `/…/magic-button/learn`; tab thumb slides to `Learn`; breadcrumb still reads `Docs › Components › Magic Button`; **no** perf/dependency badges on the learn page.
- [ ] Left sidebar does **not** list the learn page (it's absent from `meta.json`).
- [ ] A component *without* a learn page (e.g. `shimmer-button`) shows **no** tabs.
- [ ] Right-hand TOC on the learn page lists the six headings.
- [ ] Scenes auto-play once on scroll-in; replay button re-runs each.
- [ ] OS "reduce motion" on → scenes show their resolved state with no animation; rainbow sweep is frozen.
- [ ] Dark and light theme: scenes are grayscale (except the rainbow scene); chrome matches the existing ComponentPreview cards.

- [ ] **Step 3: Lint the whole change**

Run: `pnpm exec biome check apps/docs/src apps/docs/content/docs/components/buttons/magic-button`
Expected: PASS (or auto-fixable formatting only — run `pnpm exec biome check --write` on the listed paths if so, then re-commit).

- [ ] **Step 4: Final commit (if lint produced changes)**

```bash
git add -A
git commit -m "chore(docs): lint pass for learn tab"
```

---

## Self-Review notes

- **Spec coverage:** tab style/placement (Task 1–2), separate route (Task 6 file path + Task 2 detection), MDX + custom components (Tasks 3–6), sidebar hidden via meta.json (Task 2 note + Task 7 check), grayscale scenes + rainbow exception (Task 4), ScrollScene auto-play/replay/reduced-motion (Task 3), 6-section article grounded in source (Task 6), badges off learn page (Task 2), motion compositor-only (Task 4). All covered.
- **Type consistency:** `ComponentTab`/`ComponentTabs`, `ScrollScene({label,note,children})` render-prop `(play: boolean)`, scene exports `LayerReveal`/`PushPhysics`/`RainbowSweep` — names match across Tasks 1–6.
- **Known tunables (not blockers):** scene pixel/timing values in Task 4 are design polish and expected to be adjusted live; the code compiles and runs as written.
