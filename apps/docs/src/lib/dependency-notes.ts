/**
 * Components that pull in a runtime dependency beyond the house stack — React,
 * TypeScript, Tailwind CSS and Motion. Each one leans on a small, focused
 * third-party package for a job that isn't practical to hand-roll (physics,
 * WebGL globe, QR encoding, …). Surfaced as a badge + tooltip below the page
 * description via <ComponentBadges>, keyed by component name — the last segment
 * of a `/docs/components/<category>/<name>` slug.
 */

export interface DependencyNote {
  /** The npm package the component depends on. */
  pkg: string;
  /** One-line, user-facing explanation of what the package does here. */
  reason: string;
}

export const DEPENDENCY_NOTES: Record<string, DependencyNote> = {
  confetti: {
    pkg: "canvas-confetti",
    reason: "renders the particle burst on a <canvas>",
  },
  globe: {
    pkg: "cobe",
    reason: "draws the interactive WebGL globe",
  },
  gravity: {
    pkg: "matter-js",
    reason: "runs the 2D physics simulation for the falling, draggable bodies",
  },
  highlighter: {
    pkg: "rough-notation",
    reason: "sketches the hand-drawn annotation strokes",
  },
  "store-badge": {
    pkg: "uqr",
    reason: "encodes the scannable QR code",
  },
  "world-map": {
    pkg: "dotted-map",
    reason: "computes the dotted world-map grid from lat/long",
  },
};
