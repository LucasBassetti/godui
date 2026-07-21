"use client";

import { SwipeDeck } from "@godui/components";

const CARDS: { name: string; role: string; img: string }[] = [
  { name: "Aria Wells", role: "Product Designer", img: "1027" },
  { name: "Mateo Cruz", role: "Staff Engineer", img: "1005" },
  { name: "Noah Kim", role: "Founder", img: "1012" },
];

function ProfileCard({
  name,
  role,
  img,
}: {
  name: string;
  role: string;
  img: string;
}) {
  return (
    <div className="relative size-full overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
      <img
        src={`https://picsum.photos/id/${img}/600/800`}
        alt={name}
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
        <h3 className="text-lg font-semibold text-white">{name}</h3>
        <p className="text-sm text-white/75">{role}</p>
      </div>
    </div>
  );
}

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * SwipeDeck. Drag the front card, use the buttons, or the arrow keys.
 */
export function SwipeDeckResult() {
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag, buttons, or ← / →
        </span>
      </div>
      <div className="flex min-h-[420px] items-center justify-center p-10">
        <SwipeDeck loop actions={{ left: "Pass", right: "Connect" }}>
          {CARDS.map((c) => (
            <ProfileCard key={c.name} {...c} />
          ))}
        </SwipeDeck>
      </div>
    </div>
  );
}
