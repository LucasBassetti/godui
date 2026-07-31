"use client";

import { ImageCompare } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * ImageCompare. Drag the handle, or focus it and use the arrow keys.
 */
const SRC = "https://picsum.photos/id/1015/800/600";

export function ImageCompareResult() {
  const demo = (
    <>
      <div className="aspect-[4/3] w-full max-w-md">
        <ImageCompare
          beforeLabel="Color"
          afterLabel="B&W"
          before={<img src={SRC} alt="Color" />}
          after={<img src={SRC} alt="Black and white" className="grayscale" />}
        />
      </div>
    </>
  );

  if (useBareScene())
    return (
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden p-6 sm:p-6 w-full">
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
          the real component — drag the handle, or focus + arrow keys
        </span>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden p-6 sm:p-10">
        {demo}
      </div>
    </div>
  );
}
