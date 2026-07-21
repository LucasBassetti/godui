"use client";

import { SpotlightCard } from "@godui/components";

/**
 * Closing panel — the real SpotlightCard. Move across either card to feel
 * the CSS-var follow and the optional border ring.
 */
export function SpotlightCardResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move your pointer across each card
        </span>
      </div>
      <div className="flex min-h-[300px] flex-wrap items-center justify-center gap-8 p-10">
        <SpotlightCard className="w-64 p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Default glow
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Radial follows the pointer; border lights with it.
          </p>
        </SpotlightCard>
        <SpotlightCard
          border={false}
          radius={220}
          glowColor="color-mix(in oklch, var(--primary) 35%, transparent)"
          className="w-64 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground">Fill only</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            border=false drops the ring layer entirely.
          </p>
        </SpotlightCard>
      </div>
    </div>
  );
}
