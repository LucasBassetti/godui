"use client";

import { LiquidImage } from "@godui/components";

/**
 * Closing panel — real `LiquidImage` tiles so the reader can hover and feel
 * the displacement lerp + velocity boost the article described.
 */
export function LiquidImageResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover to ripple
        </span>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-6 md:p-10">
        <div className="grid w-full max-w-md grid-cols-2 gap-4 sm:grid-cols-3">
          <LiquidImage
            src="https://picsum.photos/id/1018/640/640"
            alt="Mountain landscape"
            className="aspect-square w-full shadow-lg"
          />
          <LiquidImage
            src="https://picsum.photos/id/1015/640/640"
            alt="River valley"
            className="aspect-square w-full shadow-lg"
          />
          <LiquidImage
            src="https://picsum.photos/id/1039/640/640"
            alt="Waterfall"
            className="col-span-2 aspect-square w-full shadow-lg sm:col-span-1"
          />
        </div>
      </div>
    </div>
  );
}
