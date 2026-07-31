"use client";

import { AuroraText } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * Closing "here's the finished thing" panel — the real AuroraText so the
 * reader can watch the clipped gradient drift, then scroll away and feel
 * the idle pause the article just explained.
 */
export function AuroraTextResult() {
  const demo = (
    <>
      <h2 className="text-center font-bold text-4xl tracking-tight md:text-5xl">
        Ship <AuroraText>beautiful</AuroraText> UI
      </h2>
    </>
  );

  if (useBareScene())
    return (
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-6 w-full">
        {demo}
      </div>
    );

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — watch the aurora drift
        </span>
      </div>
      <div className="flex min-h-[240px] flex-wrap items-center justify-center gap-6 p-10">
        {demo}
      </div>
    </div>
  );
}
