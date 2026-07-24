import {
  MOTION_ALLOWLIST,
  type MotionGrade,
  motionTier,
} from "@godui/components";
import { MOTION_NOTES, STATIC_COMPONENTS } from "./motion-notes";

/**
 * Per-component MotionScore for the docs badge. Grades a component by the worst
 * tier of anything it animates (see the official tiers in
 * `@godui/components`'s `motion-score.ts`), reading the render-cost signals the
 * repo already curates — the `MOTION_NOTES` kind/reason, whether it's a
 * `STATIC_COMPONENTS` member, and the GATED props it's sanctioned to animate in
 * `MOTION_ALLOWLIST`. Keyed by the same component name used by `MOTION_NOTES`
 * (the last segment of a `/docs/components/<category>/<name>` slug).
 */

export interface ComponentMotionScore {
  grade: MotionGrade;
  /** Component-specific note on what drives the grade (tooltip body). */
  reason: string;
}

const GPU_ONLY =
  "Animates only transform, opacity and filter, so the whole animation runs on the GPU compositor — no main-thread layout or paint.";
const STATIC =
  "Renders with plain CSS and never animates — nothing for the browser to keep composing or repainting.";

export function motionScore(componentName: string): ComponentMotionScore {
  const note = MOTION_NOTES[componentName];
  const isStatic = STATIC_COMPONENTS.has(componentName);
  // Allowlist keys are `<name>/<name>.tsx` (dir === file for every component).
  const allowlistProps = (
    MOTION_ALLOWLIST[`${componentName}/${componentName}.tsx`] ?? []
  ).map((entry) => entry.prop);

  const grade = motionTier({ kind: note?.kind, isStatic, allowlistProps });
  const reason = note?.reason ?? (isStatic ? STATIC : GPU_ONLY);
  return { grade, reason };
}
