"use client";

import { StickyScroll, type StickyScrollItem } from "@godui/components";
import { DemoCenter } from "@/components/demos/_kit";

const ITEMS: StickyScrollItem[] = [
  {
    title: "Collaborate in real time",
    description:
      "Cursors, comments, and presence keep the whole team on the same page.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 font-semibold text-2xl text-foreground">
        Collaborate
      </div>
    ),
  },
  {
    title: "Ship with confidence",
    description: "Preview every change and roll out when it feels right.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/30 to-transparent font-semibold text-2xl text-foreground">
        Ship
      </div>
    ),
  },
  {
    title: "Scale calmly",
    description: "Infrastructure that grows with you, never against you.",
    content: (
      <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/25 font-semibold text-2xl text-foreground">
        Scale
      </div>
    ),
  },
];

export function StickyScrollDemo() {
  // Component-owned framed scroller — centered (no Example fullWidth).
  return (
    <DemoCenter max="none" className="max-w-5xl">
      <StickyScroll items={ITEMS} className="w-full" />
    </DemoCenter>
  );
}
