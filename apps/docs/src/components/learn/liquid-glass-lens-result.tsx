"use client";

import { LiquidGlassLens } from "@godui/components";

/**
 * Live lens over a neutral structured stage — enough contrast for refraction,
 * no brand-colored conic.
 */
export function LiquidGlassLensResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover the stage
        </span>
      </div>
      <div
        className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-[var(--muted)] p-10 md:min-h-[380px]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 20%, color-mix(in oklab, var(--foreground) 12%, transparent), transparent 40%), linear-gradient(to right, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "auto, 28px 28px, 28px 28px",
        }}
      >
        <div className="relative z-raised max-w-sm space-y-4 text-center">
          <div className="mx-auto h-3 w-40 rounded-full bg-[var(--foreground)]/45" />
          <div className="mx-auto h-2 w-full rounded-full bg-[var(--foreground)]/22" />
          <div className="mx-auto h-2 w-[80%] rounded-full bg-[var(--foreground)]/15" />
          <div className="mx-auto h-2 w-[60%] rounded-full bg-[var(--foreground)]/12" />
        </div>
        <LiquidGlassLens size={220} strength={80} sheen={0.5} />
      </div>
    </div>
  );
}
