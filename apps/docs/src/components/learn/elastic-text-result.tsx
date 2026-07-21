"use client";

import { ElasticText } from "@godui/components";

/**
 * Closing panel — the real ElasticText so the reader feels the auto spotlight
 * sweep, the spring settle on each character, and the hover distance falloff.
 */
export function ElasticTextResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — auto + hover
        </span>
      </div>
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-10 p-10">
        <ElasticText className="text-4xl tracking-tight sm:text-5xl">
          Design for Humans
        </ElasticText>
        <ElasticText
          mode="hover"
          className="text-2xl tracking-tight text-fd-muted-foreground sm:text-3xl"
        >
          Move Your Mouse
        </ElasticText>
      </div>
    </div>
  );
}
