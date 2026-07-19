"use client";

import { MaskButton } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * MaskButton, one per sprite. Hover or tab to each and watch the flipbook.
 */
export function MaskResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover, focus, or press each
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-10">
        <MaskButton mask="nature">Hover me</MaskButton>
        <MaskButton mask="urban">Hover me</MaskButton>
        <MaskButton mask="forest">Hover me</MaskButton>
      </div>
    </div>
  );
}
