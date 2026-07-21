"use client";

import { type Comment, CommentPin } from "@godui/components";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — two real `CommentPin`s over a
 * mock canvas. Click a pin to open its thread; the resolved pin stays
 * shrunk and desaturated until you click it.
 */
type Pin = {
  id: string;
  x: number;
  y: number;
  resolved?: boolean;
  comments: Comment[];
};

const PINS: Pin[] = [
  {
    id: "p1",
    x: 22,
    y: 24,
    comments: [
      {
        id: "c1",
        author: "Ana Reyes",
        body: "Can we tighten this spacing?",
        time: "2m",
      },
      {
        id: "c2",
        author: "Marco Bell",
        body: "Agreed — bumping to 8px.",
        time: "1m",
      },
    ],
  },
  {
    id: "p2",
    x: 68,
    y: 62,
    resolved: true,
    comments: [
      { id: "c3", author: "Priya Nair", body: "Fixed the contrast here." },
    ],
  },
];

export function CommentPinResult() {
  const [openId, setOpenId] = useState<string | null>("p1");

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — click a pin
        </span>
      </div>
      <div className="relative h-[280px] p-6">
        <div className="relative h-full w-full overflow-hidden rounded-xl bg-[var(--muted)]/40">
          {PINS.map((pin) => (
            <CommentPin
              key={pin.id}
              x={pin.x}
              y={pin.y}
              resolved={pin.resolved}
              comments={pin.comments}
              open={openId === pin.id}
              onOpenChange={(open) => setOpenId(open ? pin.id : null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
