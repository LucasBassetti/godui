"use client";

import { NumberTicker } from "@godui/components";

/**
 * Closing panel — live NumberTicker instances so the reader feels the
 * in-view spring, direction, delay, and decimal formatting in one place.
 */
export function NumberTickerResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll, wait, spring
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-end justify-center gap-10 p-10">
        <div className="flex flex-col items-center gap-2">
          <NumberTicker
            value={100}
            className="text-5xl font-bold tracking-tight"
          />
          <span className="font-mono text-[11px] text-fd-muted-foreground">
            up · 0→100
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <NumberTicker
            value={1984.42}
            decimalPlaces={2}
            className="text-5xl font-bold tracking-tight"
          />
          <span className="font-mono text-[11px] text-fd-muted-foreground">
            decimals
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <NumberTicker
            value={100}
            direction="down"
            delay={0.4}
            className="text-5xl font-bold tracking-tight"
          />
          <span className="font-mono text-[11px] text-fd-muted-foreground">
            down · delay 0.4s
          </span>
        </div>
      </div>
    </div>
  );
}
