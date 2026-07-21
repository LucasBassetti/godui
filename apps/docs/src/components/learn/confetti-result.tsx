"use client";

import { ConfettiButton } from "@godui/components";

/**
 * Live ConfettiButton — click fires from the button's normalized viewport
 * origin with the DEFAULTS merge (spread 70, particleCount 120, …).
 */
export function ConfettiResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click to fire
        </span>
      </div>
      <div className="flex min-h-[240px] items-center justify-center p-10">
        <ConfettiButton
          className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-primary-foreground text-sm shadow-sm [transition:background_200ms_ease] hover:bg-primary/90 active:scale-[0.98]"
          options={{ particleCount: 140, spread: 90, startVelocity: 46 }}
        >
          Celebrate
        </ConfettiButton>
      </div>
    </div>
  );
}
