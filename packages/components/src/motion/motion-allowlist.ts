/**
 * Sanctioned exceptions to the Motion Performance guideline (see motion-lint.ts).
 *
 * Every entry is an animation that intentionally touches a GATED property because
 * the effect is intrinsically layout- or paint-driven and has no compositor-only
 * equivalent (the same class as the guideline's sanctioned `height:auto`).
 *
 * Keys are `<dir>/<file>.tsx` relative to `packages/components/src`. Each entry
 * lists the normalised prop (lowercase, hyphens stripped) and a one-line reason.
 *
 * RULES:
 *  - Adding an entry is a deliberate, reviewable act — a growing list is a smell.
 *  - Prefer converting to transform/opacity/filter over adding an entry.
 *  - `transition-all` and ambient (looping) layout animation can NEVER be
 *    allowlisted — fix them.
 *  - Stale entries (no matching violation) fail the test; keep this pruned.
 */

export interface MotionAllowEntry {
  /** Normalised property name, e.g. "flexgrow", "height", "boxshadow". */
  prop: string;
  /** Why this layout/paint animation is intrinsic and acceptable. */
  reason: string;
}

export const MOTION_ALLOWLIST: Record<string, MotionAllowEntry[]> = {
  // ── Height/width/flex reveals & shared-layout morphs (layout IS the effect) ──
  "accordion/accordion.tsx": [
    {
      prop: "height",
      reason: "collapse to height:auto — sanctioned reveal pattern",
    },
  ],
  "agent-timeline/agent-timeline.tsx": [
    { prop: "height", reason: "timeline row collapse to height:auto" },
  ],
  "notification-inbox/notification-inbox.tsx": [
    { prop: "height", reason: "stack item collapse to height:auto" },
  ],
  "prompt-composer/prompt-composer.tsx": [
    { prop: "height", reason: "textarea auto-grow to height:auto" },
  ],
  "tab-bar/tab-bar.tsx": [
    { prop: "width", reason: "active-tab label reveal to width:auto" },
  ],
  "dynamic-island/dynamic-island.tsx": [
    { prop: "width", reason: "signature shared-layout container morph" },
    { prop: "height", reason: "signature shared-layout container morph" },
    { prop: "borderradius", reason: "signature shared-layout container morph" },
  ],
  "mega-menu/mega-menu.tsx": [
    { prop: "height", reason: "panel + mobile-accordion shared-layout morph" },
    { prop: "width", reason: "panel shared-layout morph" },
  ],
  "toast/toast.tsx": [
    {
      prop: "height",
      reason: "toast stack expand/collapse — height to measured px",
    },
  ],
  "image-accordion/image-accordion.tsx": [
    {
      prop: "flexgrow",
      reason:
        "panels share one flex track; siblings must reflow — no compositor equivalent",
    },
  ],
  "app-showcase/app-showcase.tsx": [
    {
      prop: "width",
      reason: "pagination pill 8→24px, single element, per click",
    },
  ],
  "magic-input/magic-input.tsx": [
    {
      prop: "backgroundsize",
      reason:
        "determinate progress-bar fill mechanism (edge + shadow gradients)",
    },
  ],
  "image-compare/image-compare.tsx": [
    {
      prop: "clippath",
      reason: "before/after reveal geometry; 120ms one-shot on pointer release",
    },
  ],
  // ── SVG geometry (length-driven beam, same family as pathLength) ──
  "animated-beam/animated-beam.tsx": [
    { prop: "x1", reason: "SVG endpoint geometry for the length-driven beam" },
    { prop: "x2", reason: "SVG endpoint geometry for the length-driven beam" },
    { prop: "y1", reason: "SVG endpoint geometry for the length-driven beam" },
    { prop: "y2", reason: "SVG endpoint geometry for the length-driven beam" },
  ],
  // ── box-shadow that can't be cheaply isolated to a GPU-only overlay ──
  "agent-flow/agent-flow.tsx": [
    {
      prop: "boxshadow",
      reason:
        "node status glow shares its transition with border/background paint — isolating it wins nothing",
    },
  ],
  "stepper/stepper.tsx": [
    {
      prop: "boxshadow",
      reason:
        "step-state shadow shares its transition with background/border/color paint",
    },
  ],
  "bento-grid/bento-grid.tsx": [
    {
      prop: "boxshadow",
      reason:
        "hover-lift shadow; card is overflow-hidden so the shadow can't move to a clipped child without a wrapper restructure",
    },
  ],
};
