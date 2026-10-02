"use client";

import * as React from "react";

/**
 * The mount rule for selection pops: `true` once `value` has changed since
 * this component mounted — never on first paint or remount (menu items mount
 * on every open). Compared during render, so it flips in the same commit as
 * the change. Set it as `data-animate` and gate the pop keyframe on it.
 *
 * If the animated element is Presence-managed (a Radix `*Indicator`), also
 * gate the keyframe on the element's own "on" state
 * (`data-[state=checked]:`): otherwise the commit that unchecks it adds the
 * keyframe, Presence sees a new animation, and the indicator re-pops before
 * it disappears.
 */
export function useAnimateOnChange(value: unknown): boolean {
  const [animate, setAnimate] = React.useState(false);
  const [last, setLast] = React.useState(value);
  if (!Object.is(value, last)) {
    setLast(value);
    setAnimate(true);
  }
  return animate;
}
