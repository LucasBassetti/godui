import gpuReport from "./gpu-report.json";
import type { GpuReport } from "./gpu-report-types";

/** Generated strict GPU-only scan of every Extras component (report-only). */
export const GPU_REPORT: GpuReport = gpuReport;
export type { GpuReport } from "./gpu-report-types";
export {
  MOTION_TIER_META,
  type MotionCostKind,
  type MotionGrade,
  type MotionTierInput,
  type MotionTierMeta,
  motionTier,
  propTier,
} from "./motion-score";
export {
  DURATION,
  EASE,
  EASE_CSS,
  ENTER,
  EXIT,
  motionSafe,
  SPRING,
  STAGGER,
} from "./tokens";
