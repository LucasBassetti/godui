"use client";

import { SpotlightReveal } from "@godui/components";

export function SpotlightRevealDemo() {
  return (
    <SpotlightReveal
      radius={150}
      className="aspect-[16/10] w-full max-w-xl border border-border"
      reveal={
        <div className="grid size-full place-items-center bg-foreground">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-background/60">
              Your invite code
            </p>
            <p className="mt-3 font-mono text-3xl font-semibold tracking-[0.2em] text-background">
              GODUI-2026
            </p>
          </div>
        </div>
      }
    >
      <div className="grid size-full place-items-center bg-card">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Early access
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Move your cursor to reveal
          </p>
        </div>
      </div>
    </SpotlightReveal>
  );
}
