"use client";

import { AvatarGroup } from "@godui/components";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * AvatarGroup. Hover the row to see it fan out, then hover one avatar to
 * see it lift on top of the spread.
 */
const PEOPLE = [
  { src: "https://i.pravatar.cc/80?img=1", alt: "Ada" },
  { src: "https://i.pravatar.cc/80?img=2", alt: "Carl" },
  { src: "https://i.pravatar.cc/80?img=3", alt: "Eve" },
  { src: "https://i.pravatar.cc/80?img=4", alt: "Gus" },
  { src: "https://i.pravatar.cc/80?img=5", alt: "Ivy" },
  { src: "https://i.pravatar.cc/80?img=6", alt: "Jo" },
];

export function AvatarGroupResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover the row, then one avatar
        </span>
      </div>
      <div className="flex min-h-[220px] items-center justify-center p-10">
        <AvatarGroup avatars={PEOPLE} max={4} />
      </div>
    </div>
  );
}
