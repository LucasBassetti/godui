"use client";

import { TiltCard } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `TiltCard`. Move the pointer across either card and it tilts toward you
 * with parallax depth and a glare that tracks the cursor; the right card
 * cranks `maxTilt`/`depth` for a more dramatic effect.
 */
export function TiltCardResult() {
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
        <TiltCard className="w-64 p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Designed in 3D
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            One spring drives rotation, depth, and glare together.
          </p>
        </TiltCard>
        <TiltCard maxTilt={22} depth={70} className="w-64 p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Deeper parallax
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Crank maxTilt and depth for a more dramatic effect.
          </p>
        </TiltCard>
      </div>
    </div>
  );
}
