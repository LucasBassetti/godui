"use client";

import { type Reaction, Reactions } from "@godui/components";
import { useState } from "react";

export function ReactionsDemo() {
  const [reactions, setReactions] = useState<Reaction[]>([
    {
      emoji: "👍",
      count: 4,
      reacted: true,
      users: ["You", "Ana", "Marco", "Priya"],
    },
    { emoji: "🎉", count: 2, users: ["Jules", "Sam"] },
    { emoji: "🚀", count: 1, users: ["Lee"] },
  ]);

  const toggle = (emoji: string) =>
    setReactions((prev) =>
      prev
        .map((r) =>
          r.emoji === emoji
            ? {
                ...r,
                reacted: !r.reacted,
                count: r.count + (r.reacted ? -1 : 1),
              }
            : r,
        )
        .filter((r) => r.count > 0),
    );

  const add = (emoji: string) =>
    setReactions((prev) => {
      if (prev.some((r) => r.emoji === emoji)) return prev;
      return [...prev, { emoji, count: 1, reacted: true, users: ["You"] }];
    });

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="size-8 shrink-0 rounded-full bg-primary/15" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-foreground">
            <span className="font-medium">Ana Reyes</span> shipped the new
            onboarding flow — feels so much smoother now. 🎈
          </p>
          <div className="mt-2">
            <Reactions reactions={reactions} onToggle={toggle} onAdd={add} />
          </div>
        </div>
      </div>
    </div>
  );
}
