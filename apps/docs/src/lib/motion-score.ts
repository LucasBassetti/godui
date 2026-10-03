import { GPU_REPORT, type MotionGrade, motionTier } from "@godui/lab";
import { perfNote, STATIC_COMPONENTS } from "./motion-notes";

/**
 * Per-component MotionScore for the docs badge. Grades a component by the worst
 * tier of anything it animates (see the official tiers in
 * `@godui/components`'s `motion-score.ts`), reading the render-cost signals the
 * repo already has — the `MOTION_NOTES` kind/reason, whether it's a
 * `STATIC_COMPONENTS` member, and the layout/paint-heavy props found by the
 * generated `GPU_REPORT`. Keyed by the same component name used by
 * `MOTION_NOTES` (the last segment of a `/docs/extras/<category>/<name>` slug).
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
  const note = perfNote(componentName);
  const isStatic = STATIC_COMPONENTS.has(componentName);
  // Layout/paint-heavy props from the generated strict scan of Extras.
  const allowlistProps = GPU_REPORT[componentName]?.gated ?? [];

  const grade = motionTier({ kind: note?.kind, isStatic, allowlistProps });
  const reason = note?.reason ?? (isStatic ? STATIC : GPU_ONLY);
  return { grade, reason };
}
