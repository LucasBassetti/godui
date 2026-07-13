/**
 * GodUI motion tokens — the single source of truth for the library's motion
 * language. Documented in the Motion Guidelines (Principles + Patterns).
 *
 * Copy-paste components are self-contained, so they don't import this module at
 * runtime; instead they use these exact values inline. This file is the spec
 * those values conform to, and the docs import it directly so the guidelines and
 * the components can never drift. When adding a component, pick from these
 * presets rather than inventing new spring/duration/easing numbers.
 */

import type { Transition } from "framer-motion";

/** Durations in seconds. Enter is calmer than exit; opacity sits in the middle.
 * `slower` covers larger-traversal / ambient moves (matches Material 3 medium4). */
export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
  slower: 0.4,
} as const;

/** Cubic-bezier easing curves, as Motion tuples. */
export const EASE = {
  /** Decelerate-to-rest. The expressive "settle" curve (reveals, FAQ). */
  out: [0.22, 1, 0.36, 1],
  /** The default GodUI curve — a touch of spring without overshoot. */
  standard: [0.3, 0.7, 0.4, 1],
  /** Overshoot variant of `standard` for playful pops and lifts. */
  back: [0.3, 0.7, 0.4, 1.5],
  /** Symmetric in-out for looping traversals. */
  inOut: [0.65, 0, 0.35, 1],
  /** Constant speed — the only correct curve for length-driven flow (traced
   * borders, marching beams) so the front never speeds up or settles. */
  linear: [0, 0, 1, 1],
} as const satisfies Record<string, [number, number, number, number]>;

/** The same easings as CSS strings, for `transition`/`[transition:…]` classNames. */
export const EASE_CSS = {
  out: "cubic-bezier(0.22,1,0.36,1)",
  standard: "cubic-bezier(0.3,0.7,0.4,1)",
  back: "cubic-bezier(0.3,0.7,0.4,1.5)",
  inOut: "cubic-bezier(0.65,0,0.35,1)",
  linear: "linear",
} as const;

/**
 * Ambient flow speed in **pixels per second**. For length-driven motion — traced
 * borders, beams, marching packets — set each element's duration to
 * `length / speed` (with {@link EASE.linear}) so the light holds one constant
 * pace across differently-sized elements and reads as a single continuous flow
 * rather than separate clips. This is the ambient counterpart to {@link DURATION}
 * (which is for fixed-length micro-motion).
 */
export const FLOW_SPEED = {
  /** Calm hero-diagram pace (≈ a card border in ~0.8s). */
  base: 280,
} as const;

/** Spring presets, named by feel. */
export const SPRING = {
  /** Underdamped morph for surfaces — dialogs, shared-layout transitions. */
  smooth: { type: "spring", stiffness: 320, damping: 32, mass: 0.9 },
  /** Crisp height/collapse — accordion. */
  crisp: { type: "spring", stiffness: 500, damping: 40 },
  /** Snappy pop for menus and popovers — dropdown. */
  snappy: { type: "spring", stiffness: 520, damping: 32 },
  /** Lively overshoot for follow-through and magnetic motion — dock. */
  bouncy: { type: "spring", stiffness: 170, damping: 12, mass: 0.1 },
} as const satisfies Record<string, Transition>;

/** Stagger gaps in seconds for sequenced children. */
export const STAGGER = {
  tight: 0.03,
  base: 0.05,
  loose: 0.08,
} as const;

/** Canonical enter offset: fade up. */
export const ENTER = { opacity: 0, y: 12 } as const;

/** Canonical exit offset: fade down, shorter travel than enter. */
export const EXIT = { opacity: 0, y: 8 } as const;

/**
 * Pick `value` normally, or `fallback` when the user prefers reduced motion.
 * Pass `useReducedMotion()` as the first argument.
 */
export function motionSafe<T>(
  reduce: boolean | null,
  value: T,
  fallback: T,
): T {
  return reduce ? fallback : value;
}
