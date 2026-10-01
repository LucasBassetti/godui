/**
 * MotionScore — a static S→F grade for a component's animation render cost.
 *
 * Mirrors Motion's MotionScore tiers (https://score.motion.dev/methodology): a
 * grade names *how* the browser has to run the animation, from `S` (the whole
 * thing composited off the main thread) down to `F` (per-frame layout
 * thrashing). It's a property-based model — every animated property sits in a
 * tier, and a component takes the **worst** tier of anything it animates.
 *
 * Motion doesn't publish the numeric weighting behind its grades, so this is a
 * faithful re-implementation of the *tiers*, not their private formula. We tier
 * from signals the repo already curates — the render-cost `kind` a component is
 * tagged with (docs `MOTION_NOTES`, mirrored from {@link ./motion-allowlist})
 * and the exact GATED properties it's sanctioned to animate — rather than a raw
 * source scan, because the scanner ({@link ./motion-lint}) can't see keyframe
 * loops (e.g. a `background-position` rainbow) that dominate the real cost.
 *
 * This module holds only the pure tier logic + tier copy; callers feed it the
 * signals. The docs app wraps it (`apps/docs/src/lib/motion-score.ts`) to look
 * those signals up by component name and render the grade as a badge.
 */

export type MotionGrade = "S" | "A" | "B" | "C" | "D" | "F";

/** Render-cost class of a non-compositor animation (mirrors `MotionNoteKind`). */
export type MotionCostKind = "layout" | "paint" | "compute";

export interface MotionTierMeta {
  /** Official tier name, e.g. "Compositor-only", "Paint-triggering". */
  name: string;
  /** One-line, user-facing description of what the tier means. */
  summary: string;
}

/** The six MotionScore tiers, worst-case ordering S (best) → F (worst). */
export const MOTION_TIER_META: Record<MotionGrade, MotionTierMeta> = {
  S: {
    name: "Compositor-only",
    summary: "The browser runs the whole animation off the main thread.",
  },
  A: {
    name: "Main-thread composite",
    summary:
      "Rendering happens off the main thread, but the animation logic runs on it.",
  },
  B: {
    name: "Measure before composite",
    summary:
      "A compositor technique that first reads layout, adding setup cost.",
  },
  C: {
    name: "Paint-triggering",
    summary: "Pixels are redrawn as the animation changes.",
  },
  D: {
    name: "Layout-triggering",
    summary: "Geometry is recalculated, then painted and composited.",
  },
  F: {
    name: "Thrashing",
    summary: "Repeated DOM reads and writes force synchronous browser work.",
  },
};

const SEVERITY: Record<MotionGrade, number> = {
  S: 0,
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  F: 5,
};

/** Return the worse (higher-severity) of two tiers. */
function worse(a: MotionGrade, b: MotionGrade): MotionGrade {
  return SEVERITY[a] >= SEVERITY[b] ? a : b;
}

/** The tier a component's curated render-cost kind lands in. */
const KIND_TIER: Record<MotionCostKind, MotionGrade> = {
  paint: "C", // repaints each frame
  layout: "D", // recalculates geometry each frame
  // A JS-driven canvas/WebGL/physics loop redraws pixels each frame — the same
  // paint-triggering cost class; it never relayouts the document.
  compute: "C",
};

// Compositor-only properties (official tier S) — the browser moves an
// already-painted layer on the GPU without relayout or repaint.
const COMPOSITOR_PROPS = new Set([
  "transform",
  "translate",
  "translatex",
  "translatey",
  "translatez",
  "translate3d",
  "scale",
  "scalex",
  "scaley",
  "scale3d",
  "rotate",
  "rotatex",
  "rotatey",
  "rotatez",
  "rotate3d",
  "skew",
  "skewx",
  "skewy",
  "perspective",
  "opacity",
  "filter",
  "backdropfilter",
  "clippath", // clip-path is composited (official S)
  "x", // framer transform shorthands
  "y",
  "z",
]);

// Paint-triggering CSS properties (official tier C).
const PAINT_PROPS = new Set([
  "boxshadow",
  "borderradius",
  "backgroundposition",
  "backgroundsize",
  "color",
  "backgroundcolor",
  "bordercolor",
  "fill",
  "stroke",
]);

/**
 * Official MotionScore tier for a single normalised (lowercase, hyphen-stripped)
 * CSS/SVG property. See the methodology tier table.
 */
export function propTier(prop: string): MotionGrade {
  if (COMPOSITOR_PROPS.has(prop)) return "S";
  if (PAINT_PROPS.has(prop)) return "C";
  // SVG geometry attributes (x1/x2/y1/y2) repaint rather than relayout.
  if (/^[xy]\d$/.test(prop)) return "C";
  // width / height / margin / padding / top / inset / gap / font-size / flex…
  return "D";
}

export interface MotionTierInput {
  /**
   * Curated render-cost kind. `undefined` means the component animates only
   * compositor properties (the GPU-only, best-case profile).
   */
  kind?: MotionCostKind;
  /** True when the component never animates at all — trivially compositor-safe. */
  isStatic?: boolean;
  /**
   * Normalised GATED properties the component is sanctioned to animate in
   * {@link ./motion-allowlist}. Each is tiered and the worst is taken.
   */
  allowlistProps?: string[];
}

/**
 * Grade a component's animation by its worst-tier animated property, using the
 * official MotionScore tiers.
 */
export function motionTier(input: MotionTierInput): MotionGrade {
  const { kind, isStatic = false, allowlistProps = [] } = input;

  // Nothing to composite, or only compositor-cheap properties → best case.
  if (isStatic || !kind) return "S";

  let grade = KIND_TIER[kind];
  for (const prop of allowlistProps) grade = worse(grade, propTier(prop));
  return grade;
}
