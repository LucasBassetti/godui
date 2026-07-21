"use client";

import { WarpStarfield } from "@godui/components";

/**
 * Live WarpStarfield on the themed card surface — stars use --foreground,
 * so light and dark both stay readable without a forced night sky.
 */
export function WarpStarfieldResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move for parallax
        </span>
      </div>
      <div className="relative min-h-[320px] overflow-hidden bg-[var(--card)] md:min-h-[380px]">
        <WarpStarfield
          starCount={400}
          speed={1}
          depth={1.5}
          parallax={30}
          warp={false}
        />
      </div>
    </div>
  );
}
