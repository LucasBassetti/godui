/**
 * GodUI motion system — the single source of truth for animation.
 *
 * Every animated component pulls its timing, springs, and easing from here so
 * the whole library feels like one designed product instead of 50 components
 * each reinventing their own springs and durations.
 *
 * See the Motion guideline in the docs for how and when to use each token.
 */

/** Durations in milliseconds — semantic roles, not arbitrary numbers. */
export const DURATION = {
  /** Reduced-motion / no-op. */
  instant: 0,
  /** Hover, press, micro-feedback. */
  fast: 150,
  /** Toggles, simple open/close, icon swaps. */
  base: 250,
  /** Panels, dropdowns, modal enter. */
  slow: 350,
  /** Large surfaces — drawers, sheets. */
  slower: 500,
} as const;

/** Stagger delays in seconds, for splitting enter animations into chunks. */
export const STAGGER = {
  /** Between semantic groups (title, body, actions). */
  group: 0.05,
  /** Between words in a split title. */
  word: 0.08,
} as const;

/**
 * Framer Motion spring presets — four named roles. Map every component spring
 * to the nearest role instead of hand-tuning stiffness/damping per file.
 */
export const SPRING = {
  /** Buttons, segmented controls, toggles — quick and tight. */
  snappy: { type: "spring", stiffness: 400, damping: 32 },
  /** Panels, dropdowns, layout shifts — settled, no overshoot. */
  smooth: { type: "spring", stiffness: 300, damping: 30 },
  /** Drawers, modals, large surfaces — soft and weighty. */
  gentle: { type: "spring", stiffness: 210, damping: 26 },
  /** Signature overshoot — Dynamic Island, Dock magnify. Use sparingly. */
  expressive: { type: "spring", stiffness: 400, damping: 26 },
} as const;

/**
 * CSS cubic-bezier strings for inline `[transition:...]` or Tailwind arbitrary
 * values, where a Framer spring isn't available.
 */
export const EASE = {
  /** Default UI motion and exits. */
  out: "cubic-bezier(0.2, 0, 0, 1)",
  /** The magic-* snap curve. */
  snap: "cubic-bezier(0.3, 0.7, 0.4, 1)",
  /** Release with a touch of overshoot. */
  overshoot: "cubic-bezier(0.3, 0.7, 0.4, 1.4)",
} as const;

/**
 * Standard enter variants — split content into chunks and stagger them with
 * `STAGGER.group`. Combine opacity + lift + blur for the reveal.
 */
export const ENTER = {
  hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

/**
 * Standard exit — softer and shorter than the enter. Small fixed lift, never
 * the full element height, and never `display: none`.
 */
export const EXIT = {
  opacity: 0,
  y: -12,
  filter: "blur(4px)",
  transition: { duration: DURATION.fast / 1000, ease: "easeIn" },
} as const;

/**
 * Reduced-motion helper. Keep the state change, drop the animation — never hide
 * content. Route every transition through this when honoring `useReducedMotion`.
 *
 * @example
 * const reduce = useReducedMotion();
 * <motion.div transition={motionSafe(reduce, SPRING.smooth)} />
 */
export function motionSafe<T>(reduce: boolean, transition: T) {
  return reduce ? ({ duration: 0 } as const) : transition;
}
