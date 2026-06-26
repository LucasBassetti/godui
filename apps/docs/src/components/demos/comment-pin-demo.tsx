"use client";

import { type Comment, CommentPin } from "@godui/components";
import { useState } from "react";

type Pin = {
  id: string;
  x: number;
  y: number;
  resolved?: boolean;
  comments: Comment[];
};

const INITIAL: Pin[] = [
  {
    id: "p1",
    x: 16,
    y: 20,
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
    y: 58,
    resolved: true,
    comments: [
      { id: "c3", author: "Priya Nair", body: "Fixed the contrast here." },
    ],
  },
];

export function CommentPinDemo() {
  const [pins, setPins] = useState<Pin[]>(INITIAL);
  const [openId, setOpenId] = useState<string | null>("p1");

  const reply = (pinId: string, body: string) =>
    setPins((prev) =>
      prev.map((p) =>
        p.id === pinId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: `c${Date.now()}`, author: "You", body, time: "now" },
              ],
            }
          : p,
      ),
    );

  return (
    <div className="relative mx-auto h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-card">
      <div className="absolute left-6 top-6 h-28 w-56 rounded-xl bg-muted" />
      <div className="absolute right-10 top-12 h-20 w-40 rounded-xl bg-muted" />
      <div className="absolute bottom-10 left-12 h-24 w-72 rounded-xl bg-muted" />
      <p className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        Click a pin to open its thread.
      </p>
      {pins.map((pin) => (
        <CommentPin
          key={pin.id}
          x={pin.x}
          y={pin.y}
          resolved={pin.resolved}
          comments={pin.comments}
          open={openId === pin.id}
          onOpenChange={(o) => setOpenId(o ? pin.id : null)}
          onReply={(body) => reply(pin.id, body)}
        />
      ))}
    </div>
  );
}
