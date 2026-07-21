"use client";

import { FluidCursorDemo } from "@/components/demos/fluid-cursor-demo";

/**
 * Closing panel — the real `FluidCursor`, scoped to the demo card. Fine
 * pointers only; reduced-motion users see nothing (component returns null).
 */
export function FluidCursorResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move inside the card
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-6 md:p-10">
        <FluidCursorDemo />
      </div>
    </div>
  );
}
