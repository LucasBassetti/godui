"use client";

import { StickyScroll, type StickyScrollItem } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * `StickyScroll`. The component is its own scroll container (`h-[30rem]
 * overflow-y-auto`), so it needs no special framing here — scroll inside it
 * to walk the panel through each item.
 */
const ITEMS: StickyScrollItem[] = [
  {
    title: "Collaborate in real time",
    description:
      "Cursors, comments, and presence keep the whole team on the same page.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-semibold text-foreground">
        Collaborate
      </div>
    ),
  },
  {
    title: "Ship with confidence",
    description: "Preview every change and roll out when it feels right.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/30 to-transparent text-2xl font-semibold text-foreground">
        Ship
      </div>
    ),
  },
  {
    title: "Scale calmly",
    description: "Infrastructure that grows with you, never against you.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/25 text-2xl font-semibold text-foreground">
        Scale
      </div>
    ),
  },
];

export function StickyScrollResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — scroll inside this panel
        </span>
      </div>
      <div className="flex justify-center p-6 md:p-10">
        <StickyScroll items={ITEMS} />
      </div>
    </div>
  );
}
