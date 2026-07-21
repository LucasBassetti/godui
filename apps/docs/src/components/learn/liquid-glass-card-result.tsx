"use client";

import { LiquidGlassCard } from "@godui/components";

/**
 * Live card over a busy *neutral* backdrop — contrast + grid so refraction
 * reads, without purple/pink marketing gradients. Color is allowed in Result
 * only when the subject needs it; glass needs structure behind it, not hue.
 */
export function LiquidGlassCardResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — move across the panel
        </span>
      </div>
      <div
        className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[var(--muted)] p-8 md:min-h-[380px]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 25%, color-mix(in oklab, var(--foreground) 14%, transparent), transparent 42%), radial-gradient(circle at 75% 70%, color-mix(in oklab, var(--foreground) 10%, transparent), transparent 40%), linear-gradient(to right, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "auto, auto, 28px 28px, 28px 28px",
        }}
      >
        <LiquidGlassCard className="relative w-80 p-8" radius={28} sheen={0.55}>
          <div className="h-2.5 w-28 rounded-full bg-[var(--foreground)]/50" />
          <div className="mt-4 h-2 w-full rounded-full bg-[var(--foreground)]/25" />
          <div className="mt-2 h-2 w-[80%] rounded-full bg-[var(--foreground)]/18" />
          <div className="mt-6 flex gap-2">
            <div className="h-8 w-20 rounded-lg bg-[var(--foreground)]/15" />
            <div className="h-8 w-8 rounded-lg bg-[var(--foreground)]/10" />
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
