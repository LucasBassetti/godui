"use client";

import { SimulatedCursors } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — `SimulatedCursors` driving
 * three self-piloted peers over a mock canvas, the same technique the
 * component page's own demo uses for a hands-free preview.
 */
export function LiveCursorsResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — self-driving peers
        </span>
      </div>
      <div className="relative h-[280px] p-6">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-[var(--muted)]/40">
          <SimulatedCursors names={["Ana", "Marco", "Priya"]} />
        </div>
      </div>
    </div>
  );
}
