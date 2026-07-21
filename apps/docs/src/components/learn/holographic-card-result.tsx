"use client";

import { HolographicCard } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `HolographicCard`. Move the pointer across either card: the foil, glare,
 * and glitter all shift together as it tilts, like a real trading-card holo.
 */
export function HolographicCardResult() {
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
      <div className="flex min-h-[340px] flex-wrap items-center justify-center gap-8 p-10">
        <HolographicCard variant="rainbow" className="h-72 w-52 p-5">
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
            Founding Member
          </span>
          <div className="mt-24">
            <h3 className="text-xl font-semibold tracking-tight text-white">
              GodUI
            </h3>
            <p className="mt-1 text-xs text-white/70">
              Move your pointer across the card.
            </p>
          </div>
        </HolographicCard>
        <HolographicCard variant="galaxy" className="h-72 w-52" />
      </div>
    </div>
  );
}
