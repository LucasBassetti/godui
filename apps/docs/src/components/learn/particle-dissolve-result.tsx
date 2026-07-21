"use client";

import { ParticleDissolve } from "@godui/components";

/**
 * Closing panel — real `ParticleDissolve` looping so the reader sees
 * scatter → form → disperse with per-particle delay and idle shimmer.
 */
export function ParticleDissolveResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — loop mode
        </span>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-6 md:p-10">
        <ParticleDissolve
          text="GodUI"
          mode="loop"
          trigger="in-view"
          width={520}
          height={200}
          className="max-w-full text-primary"
        />
      </div>
    </div>
  );
}
