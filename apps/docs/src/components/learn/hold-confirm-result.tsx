"use client";

import { HoldConfirmButton } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * component so the reader can feel every mechanism the article just pulled
 * apart: press and hold, or release early to cancel.
 */
export function HoldConfirmResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — press and hold, or release early
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-10">
        <HoldConfirmButton variant="destructive">
          Hold to delete
        </HoldConfirmButton>
        <HoldConfirmButton variant="default" duration={1400}>
          Hold to publish
        </HoldConfirmButton>
      </div>
    </div>
  );
}
