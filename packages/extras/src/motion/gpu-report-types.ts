/**
 * Per-component result of the strict GPU-only scan over Extras.
 * `nonCompositor`: every animated property that isn't transform/opacity/filter.
 * `gated`: the subset the lenient policy treats as layout/paint-heavy (drives
 * the docs motion grade).
 */
export type GpuReport = Record<
  string,
  { nonCompositor: string[]; gated: string[] }
>;
