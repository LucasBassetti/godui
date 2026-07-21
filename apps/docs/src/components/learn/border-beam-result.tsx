"use client";

import { BorderBeam } from "@godui/components";

/**
 * Live BorderBeam on a quiet card — rainbow loop, optional glow off so the
 * mask + offsetPath read cleanly.
 */
export function BorderBeamResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — rainbow · 8s loop
        </span>
      </div>
      <div className="flex min-h-[260px] items-center justify-center p-8 md:p-12">
        <div className="relative flex w-full max-w-[320px] flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
          <div className="h-2 w-28 rounded-full bg-foreground/25" />
          <div className="h-1.5 w-full max-w-[200px] rounded-full bg-muted-foreground/25" />
          <div className="h-1.5 w-full max-w-[160px] rounded-full bg-muted-foreground/20" />
          <BorderBeam duration={8} size={70} />
        </div>
      </div>
    </div>
  );
}
