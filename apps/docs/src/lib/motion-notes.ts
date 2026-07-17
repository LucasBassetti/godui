/**
 * Components that don't 100% follow the Motion Performance guideline (animate
 * transform / opacity / filter only). Each one animates a layout- or paint-heavy
 * property by design, so it can't run purely on the compositor.
 *
 * The machine-enforced source of truth is
 * `packages/components/src/motion/motion-allowlist.ts` (a CI test gates it). This
 * map adds the human-facing "why", plus the ambient background-position/size
 * keyframe loops that the scanner doesn't yet see. Keyed by component name — the
 * last segment of a `/docs/components/<category>/<name>` slug. Surfaced as an
 * amber badge + tooltip below the page description via <ComponentBadges>;
 * components absent from this map get the green "GPU-only" badge instead.
 */

export type MotionNoteKind = "layout" | "paint" | "compute";

export interface MotionNote {
  kind: MotionNoteKind;
  /** One-line, user-facing explanation shown in the tooltip. */
  reason: string;
}

export const MOTION_NOTES: Record<string, MotionNote> = {
  // ── Height / width / flex reveals & shared-layout morphs ──────────────────
  accordion: {
    kind: "layout",
    reason:
      "Panels expand by animating height to auto — the sanctioned collapse pattern, but a layout property, not GPU-composited.",
  },
  "agent-timeline": {
    kind: "layout",
    reason: "Rows reveal by animating height to auto — a layout property.",
  },
  "notification-inbox": {
    kind: "layout",
    reason: "Items collapse by animating height to auto — a layout property.",
  },
  "prompt-composer": {
    kind: "layout",
    reason: "The composer auto-grows by animating height — a layout property.",
  },
  "tab-bar": {
    kind: "layout",
    reason:
      "The active tab reveals its label by animating width to auto — a layout property.",
  },
  "filter-bar": {
    kind: "layout",
    reason: "The field expands by animating its width — a layout property.",
  },
  "dynamic-island": {
    kind: "layout",
    reason:
      "The island morphs its width, height and radius between states — a shared-layout animation on the main thread.",
  },
  "mega-menu": {
    kind: "layout",
    reason:
      "Panels morph their width and height on open — a shared-layout animation on the main thread.",
  },
  toast: {
    kind: "layout",
    reason:
      "The stack expands and collapses by animating height — a layout property.",
  },
  "image-accordion": {
    kind: "layout",
    reason:
      "Panels share one flex track and animate flex-grow, so every sibling reflows each frame. There is no compositor-only equivalent.",
  },
  "app-showcase": {
    kind: "layout",
    reason:
      "The pagination pill animates its width (8→24px) — a layout property, though tiny and only on click.",
  },
  "progress-fold-button": {
    kind: "layout",
    reason: "The progress fill animates its width — a layout property.",
  },
  // ── Paint: box-shadow, clip-path, SVG geometry, background loops ───────────
  "image-compare": {
    kind: "paint",
    reason:
      "The reveal animates clip-path on release — a paint/geometry property (one-shot, 120ms).",
  },
  "animated-beam": {
    kind: "paint",
    reason:
      "The beam animates its SVG endpoint coordinates — length-driven geometry, redrawn on the main thread rather than composited.",
  },
  "agent-flow": {
    kind: "paint",
    reason:
      "Node status changes animate box-shadow alongside colors — main-thread paint.",
  },
  "magnetic-button": {
    kind: "paint",
    reason:
      "Hover animates box-shadow alongside background and color — main-thread paint.",
  },
  "otp-input": {
    kind: "paint",
    reason:
      "Focus animates box-shadow alongside the border color — main-thread paint.",
  },
  stepper: {
    kind: "paint",
    reason:
      "Step-state changes animate box-shadow alongside colors — main-thread paint.",
  },
  "bento-grid": {
    kind: "paint",
    reason:
      "The hover lift animates box-shadow; the card clips its overflow, so the shadow can't move to a GPU layer without restructuring.",
  },
  "magic-input": {
    kind: "paint",
    reason:
      "The determinate progress fills via animated background-size, and the focused rainbow edge runs a background-position loop — main-thread paint.",
  },
  // ── Continuous background-position paint loops (paused when off screen) ────
  "aurora-text": {
    kind: "paint",
    reason:
      "The gradient text runs a continuous background-position loop (main-thread paint). It's paused automatically while off screen.",
  },
  "magic-button": {
    kind: "paint",
    reason:
      "The rainbow edge and shadow run a continuous background-position loop (main-thread paint). It's paused automatically while off screen.",
  },
  "magic-tab": {
    kind: "paint",
    reason:
      "The selected tab's rainbow runs a continuous background-position loop (main-thread paint). It's paused automatically while off screen.",
  },
  "holographic-card": {
    kind: "paint",
    reason:
      "The holographic sheen repaints a masked gradient as the pointer moves — main-thread paint during interaction.",
  },
  // ── SVG filters, displacement maps, masks, font-variation (main-thread paint) ─
  "elastic-text": {
    kind: "paint",
    reason:
      "Animates font weight via font-variation-settings, so the text re-rasterizes each frame rather than compositing. Starts when scrolled into view.",
  },
  "gooey-fab": {
    kind: "paint",
    reason:
      "Blends the menu blobs through an SVG goo filter (feGaussianBlur + feColorMatrix) — main-thread paint while opening.",
  },
  "gooey-stack": {
    kind: "paint",
    reason:
      "Merges the cards through an SVG goo filter plus an animated blur — main-thread paint.",
  },
  "liquid-image": {
    kind: "paint",
    reason:
      "Drives an SVG displacement map each frame for the liquid ripple — main-thread paint.",
  },
  "spotlight-reveal": {
    kind: "paint",
    reason:
      "Moves a radial mask/gradient spotlight via CSS variables — main-thread paint as the pointer moves.",
  },
  // ── Canvas / WebGL / physics render loops (main-thread or GPU compute) ────
  globe: {
    kind: "compute",
    reason:
      "Renders and auto-rotates a WebGL globe (cobe) every frame — GPU compute driven by JS, not a compositor-only animation. Runs continuously while mounted.",
  },
  gravity: {
    kind: "compute",
    reason:
      "Runs a matter-js physics simulation each frame — main-thread compute. Pauses automatically when off screen or the tab is hidden.",
  },
  "flow-field": {
    kind: "compute",
    reason:
      "Draws particle trails to a 2D canvas every frame — main-thread paint. Pauses automatically when off screen or the tab is hidden.",
  },
  "particle-dissolve": {
    kind: "compute",
    reason:
      "Renders dissolving particles on a 2D canvas — main-thread paint, only during the dissolve. Pauses when off screen.",
  },
  "pixel-grid": {
    kind: "compute",
    reason:
      "Flickers a grid of cells on a 2D canvas each frame — main-thread paint. Pauses automatically when off screen or the tab is hidden.",
  },
  "topographic-drift": {
    kind: "compute",
    reason:
      "Draws marching-squares contours on a 2D canvas each frame — main-thread paint. Pauses when off screen or the tab is hidden.",
  },
  "warp-starfield": {
    kind: "compute",
    reason:
      "Renders a moving starfield on a 2D canvas each frame — main-thread paint. Pauses when off screen or the tab is hidden.",
  },
  "liquid-metaballs": {
    kind: "compute",
    reason:
      "Animates SVG circle positions through a goo filter each frame — main-thread paint. Pauses when off screen or the tab is hidden.",
  },
  confetti: {
    kind: "compute",
    reason:
      "Bursts particles onto a <canvas> via canvas-confetti each time it fires — main-thread paint for ~2s, then it stops on its own.",
  },
};

/**
 * Components that render statically — no animation of any kind (no Motion, CSS
 * transition/keyframe, or render loop). They're the best-case performance
 * profile, so they earn a green "Static" badge instead of the animated
 * "GPU-only" one. Keyed by component name, same as MOTION_NOTES.
 */
export const STATIC_COMPONENTS = new Set<string>([
  "decorative-background",
  "effect-background",
  "geometric-background",
  "gradient-background",
]);
