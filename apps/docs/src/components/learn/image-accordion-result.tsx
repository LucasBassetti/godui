"use client";

import { ImageAccordion } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * ImageAccordion. Hover or tab across the panels; each grows on `flex-grow`
 * while its image saturates and the caption slides up.
 */
const PANELS = [
  {
    image: "https://picsum.photos/id/1018/900/1200",
    title: "Mountains",
    description: "Alpine ridges at first light.",
  },
  {
    image: "https://picsum.photos/id/1015/900/1200",
    title: "Rivers",
    description: "Glacial water carving the valley.",
  },
  {
    image: "https://picsum.photos/id/1039/900/1200",
    title: "Waterfalls",
    description: "A 60-metre drop into the basin.",
  },
  {
    image: "https://picsum.photos/id/1043/900/1200",
    title: "Forests",
    description: "Old growth as far as you can see.",
  },
];

export function ImageAccordionResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover or tab across the panels
        </span>
      </div>
      <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden p-6 sm:p-10">
        <ImageAccordion
          panels={PANELS}
          className="w-full max-w-2xl"
          height="22rem"
        />
      </div>
    </div>
  );
}
