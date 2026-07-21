"use client";

import { BeamDraw } from "@godui/components";

/**
 * Live BeamDraw — scroll the docs page (or this tall preview) to watch the
 * default four-path fan stroke in via spring-smoothed pathLength.
 */
export function BeamDrawResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll to draw
        </span>
      </div>
      {/* Extra bottom travel so scrollYProgress can pass 0.8 and finish the draw —
          BeamDraw maps [0.1, 0.8] → pathLength and needs runway past the SVG. */}
      <div className="flex flex-col items-center px-6 pt-10 pb-[70vh] md:px-10 md:pt-14">
        <div className="relative aspect-[5/2] w-full max-w-lg overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]">
          <BeamDraw
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
          />
          <div className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
          </div>
          {[10, 37.5, 62.5, 90].map((top) => (
            <div
              key={top}
              className="absolute right-3 flex h-7 w-14 -translate-y-1/2 items-center justify-center rounded-lg border border-border bg-background shadow-sm"
              style={{ top: `${top}%` }}
            >
              <span className="h-1.5 w-6 rounded-full bg-foreground/25" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
