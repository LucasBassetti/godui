import type { InputType } from "storybook/internal/types";

/**
 * argType builders for the GodUI Playground. They keep every story's Controls
 * panel uniform: one consistent control mapping, one set of category buckets,
 * and zero per-file boilerplate. Use them inside a `meta.argTypes` map.
 *
 * Categories order the Controls panel into readable groups. Keep to this set so
 * every component reads the same way.
 */
export type Category =
  | "Appearance"
  | "Behavior"
  | "Content"
  | "State"
  | "Events";

const cat = (category?: Category): Pick<InputType, "table"> =>
  category ? { table: { category } } : {};

/** Dropdown of string-literal union options. */
export const select = (
  options: readonly string[],
  category?: Category,
): InputType => ({
  control: { type: "select" },
  options: [...options],
  ...cat(category),
});

/** Inline radio for short option sets (2–4 values) you want visible at a glance. */
export const radio = (
  options: readonly string[],
  category?: Category,
): InputType => ({
  control: { type: "inline-radio" },
  options: [...options],
  ...cat(category),
});

/** Boolean toggle. */
export const toggle = (category?: Category): InputType => ({
  control: { type: "boolean" },
  ...cat(category),
});

/** Numeric slider with explicit bounds, so users can't push values off-design. */
export const range = (
  min: number,
  max: number,
  step: number,
  category?: Category,
): InputType => ({
  control: { type: "range", min, max, step },
  ...cat(category),
});

/** Plain number input (unbounded). Prefer `range` when sensible bounds exist. */
export const number = (category?: Category): InputType => ({
  control: { type: "number" },
  ...cat(category),
});

/** Color picker. */
export const color = (category?: Category): InputType => ({
  control: { type: "color" },
  ...cat(category),
});

/** Free text input. */
export const text = (category?: Category): InputType => ({
  control: { type: "text" },
  ...cat(category),
});

/**
 * Callback prop → Actions panel entry. Pair with `fn()` in `args` so the spy is
 * wired and interactions get logged. Always grouped under "Events".
 */
export const action = (name: string): InputType => ({
  action: name,
  table: { category: "Events" },
});

/**
 * Complex props (data arrays, refs, render props) that shouldn't appear as a
 * control. Hidden from the Controls table but still passed through `args`.
 */
export const hidden = (): InputType => ({
  control: false,
  table: { disable: true },
});
