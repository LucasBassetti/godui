"use client";

import { TopographicDrift } from "@godui/components";

export function TopographicDriftResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drifting contours
        </span>
      </div>
      <div className="relative min-h-[320px] overflow-hidden md:min-h-[380px]">
        <TopographicDrift
          lineCount={9}
          noiseScale={0.004}
          speed={1}
          weight={1}
        />
      </div>
    </div>
  );
}
