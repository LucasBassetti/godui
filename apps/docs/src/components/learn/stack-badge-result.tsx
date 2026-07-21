"use client";

import { StackBadge } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * StackBadge. Scroll it into view for the stagger, then hover a chip.
 */
export function StackBadgeResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover a chip
        </span>
      </div>
      <div className="flex min-h-[220px] flex-wrap items-center justify-center gap-6 p-10">
        <StackBadge
          items={[
            "react",
            "typescript",
            "tailwind",
            "nextjs",
            "node",
            "figma",
            "rust",
            "postgres",
          ]}
        />
      </div>
    </div>
  );
}
