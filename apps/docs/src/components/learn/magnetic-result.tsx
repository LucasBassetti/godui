"use client";

import { MagneticButton } from "@godui/components";
import type { CSSProperties } from "react";

const SENSOR_RANGE = 32;

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * MagneticButton. One instance gets a dashed overlay the width of `range` so
 * the invisible sensor (normally 0px) is visible while you move the cursor.
 */
export function MagneticResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move the cursor near each button
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-10 p-10">
        <div className="relative inline-flex">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute rounded-[16px] border border-dashed border-fd-border/70"
            style={{ inset: -SENSOR_RANGE } as CSSProperties}
          />
          <MagneticButton size="lg" range={SENSOR_RANGE}>
            Sensor range={SENSOR_RANGE}
          </MagneticButton>
        </div>
        <MagneticButton variant="secondary" size="lg" strength={0.8}>
          strength=0.8
        </MagneticButton>
        <MagneticButton variant="outline" size="lg" staticLabel>
          staticLabel
        </MagneticButton>
      </div>
    </div>
  );
}
