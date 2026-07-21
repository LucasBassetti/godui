"use client";

import { SpotlightReveal } from "@godui/components";

/**
 * Closing panel — the real SpotlightReveal. Hover to follow, click to pin.
 */
export function SpotlightRevealResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover to follow, click to pin
        </span>
      </div>
      <div className="flex min-h-[320px] items-center justify-center p-6 md:p-10">
        <SpotlightReveal
          radius={140}
          className="aspect-[16/10] w-full max-w-md border border-border"
          reveal={
            <div className="grid size-full place-items-center bg-foreground">
              <div className="text-center">
                <p className="font-mono text-2xl font-semibold tracking-[0.18em] text-background">
                  GODUI
                </p>
              </div>
            </div>
          }
        >
          <div className="grid size-full place-items-center bg-card">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Cover layer
              </p>
              <p className="mt-2 text-lg font-semibold text-foreground">
                Move to reveal
              </p>
            </div>
          </div>
        </SpotlightReveal>
      </div>
    </div>
  );
}
