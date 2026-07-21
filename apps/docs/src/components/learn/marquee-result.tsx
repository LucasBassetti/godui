"use client";

import { Marquee } from "@godui/components";

/**
 * Closing panel — the real Marquee with token-bar stand-ins (no brand copy
 * needed; the live docs demo already carries logos).
 */

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export function MarqueeResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover to pause
        </span>
      </div>
      <div className="flex min-h-[200px] items-center justify-center py-10">
        <Marquee speed={28} className="w-full">
          {CELLS.map((i) => (
            <span
              key={i}
              className="flex h-12 w-28 items-center justify-center rounded-lg border border-border bg-card shadow-sm"
            >
              <span className="h-2 w-14 rounded-full bg-foreground/25" />
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
