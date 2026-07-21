"use client";

import { GeometricBackground } from "@godui/components";

export function GeometricBackgroundResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component
        </span>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-white p-10">
        <GeometricBackground />
        <div className="relative z-raised space-y-3 text-center">
          <div className="mx-auto h-3 w-36 rounded-full bg-[var(--foreground)]/40" />
          <div className="mx-auto h-2 w-48 rounded-full bg-[var(--foreground)]/20" />
        </div>
      </div>
    </div>
  );
}
