# Pixel Grid — Design

## Summary

A `"use client"` canvas component for the GodUI design system, modeled on
MagicUI's FlickeringGrid. It renders a grid of small squares whose opacity
flickers stochastically. On top of the flicker base, the cursor adds a smooth
radial spotlight: cells within an interaction radius are eased toward
`maxOpacity` by distance falloff. The square color resolves a theme token by
default (light/dark aware) and can be overridden with an explicit `color` prop.

## Goals

- Faithful flicker base from FlickeringGrid (Float32Array opacity grid,
  deltaTime-scaled stochastic updates, DPR scaling, ResizeObserver responsive
  sizing, IntersectionObserver off-screen pause).
- Optional mouse-proximity spotlight that feels subtle and premium, not gimmicky.
- Theme-aware default color via runtime token resolution; explicit `color`
  override short-circuits resolution.
- Follow GodUI component conventions (file layout, registry entry, barrel
  export, Storybook stories, docs page).

## Non-Goals

- Ignite/decay trailing glow, repel/scale, or scroll-driven reveals (considered,
  rejected — spotlight chosen for a professional, restrained feel).
- WebGL. 2D canvas is sufficient.

## File Layout

`packages/components/src/pixel-grid/`

- `pixel-grid.tsx` — the component.
- `pixel-grid.source.ts` — registry source string (matches other components).
- `index.ts` — local barrel export.

Plus:

- `packages/components/src/index.ts` — add export.
- `registry.json` — add hand-maintained entry, then `build:registry`. Do not
  reformat existing entries.
- `packages/components/src/background-components.test.tsx` — add tests.

## Props

| prop                  | type                          | default                  |
| --------------------- | ----------------------------- | ------------------------ |
| `squareSize`          | number                        | 4                        |
| `gridGap`             | number                        | 6                        |
| `flickerChance`       | number                        | 0.3                      |
| `color`               | string                        | theme token resolved     |
| `maxOpacity`          | number                        | 0.3                      |
| `interactive`         | boolean                       | true                     |
| `interactionRadius`   | number                        | 120                      |
| `interactionStrength` | number (0–1)                  | 1                        |
| `width`               | number \| undefined           | — (auto-fill parent)     |
| `height`              | number \| undefined           | — (auto-fill parent)     |
| `className`           | string                        | —                        |
| ...rest               | `HTMLAttributes<HTMLDivElement>` |                       |

## Color Resolution

- Default: read the computed color of a hidden probe element carrying the
  `text-foreground` class (resolves the `--color-foreground` theme token), then
  parse to an `rgba(...)` string via a 1×1 temp canvas (the upstream technique).
- Re-resolve on theme change: a `MutationObserver` on `documentElement`'s
  `class` attribute (GodUI toggles light/dark via a class) triggers re-resolve
  and repaint.
- If the `color` prop is provided, skip token resolution entirely and use it.

Rationale: canvas cannot consume a CSS `var()` directly, and prior GodUI work
showed raw `var(--color-*)` in `@layer` renders the wrong theme color — so we
resolve the concrete color at runtime instead.

## Render Loop

- `Float32Array` holds one opacity value per cell (upstream).
- Per frame:
  1. Flicker update — each cell, with probability `flickerChance` scaled by
     `deltaTime`, gets a new random base opacity in `[0, maxOpacity]`.
  2. Spotlight (when `interactive` and a pointer is present): for each cell at
     center `(cx, cy)` and pointer `(mx, my)`,
     `dist = hypot(cx - mx, cy - my)`,
     `t = max(0, 1 - dist / interactionRadius)`,
     `boost = smoothstep(t) * interactionStrength`,
     `final = base + (maxOpacity - base) * boost`.
  3. Paint each cell at `final` opacity.
- Pointer tracked via `pointermove` / `pointerleave` on the container. On leave,
  the spotlight target lerps out smoothly rather than snapping off.

## Performance & Cleanup

- DPR scaling for crisp rendering on retina.
- `ResizeObserver` recomputes grid dimensions on container resize.
- `IntersectionObserver` pauses the rAF loop when the canvas is off-screen.
- On unmount: cancel rAF, disconnect ResizeObserver / IntersectionObserver /
  MutationObserver, remove pointer listeners. No leaked animation frames.

## Testing

Add to `background-components.test.tsx`:

- Renders without crashing and mounts a `<canvas>`.
- Respects an explicit `color` prop (token resolution skipped).
- Unmount cleanup leaves no pending animation frame.

## Docs & Storybook

- Storybook stories: default, `interactive={false}`, custom `color`, dense grid
  (small `squareSize` / `gridGap`).
- Docs page with `ComponentPreview` + `ComponentInstall`.

Both handled per the `godui-component-creation` skill during implementation.
