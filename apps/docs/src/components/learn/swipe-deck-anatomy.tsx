"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three ranks, one formula. Every card behind the front one is placed with
 * `scale: 1 - rank * 0.05`, `y: rank * 16`, `opacity: rank > 2 ? 0 : 1` — on
 * the same `{ stiffness: 320, damping: 32, mass: 0.9 }` spring the front
 * card's drag release also uses for its snap-back.
 */
const RANKS = [0, 1, 2, 3];

const CSS = `
@keyframes swda-in { from { opacity: 0; transform: translateY(28px) scale(0.9); } to { opacity: var(--o); transform: translateY(var(--y)) scale(var(--s)); } }
.swda-card { opacity: 0; animation: swda-in 560ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.swda-static .swda-card { animation: none; opacity: var(--o); transform: translateY(var(--y)) scale(var(--s)); }
`;

function cardStyle(rank: number): CSSProperties {
  const scale = 1 - rank * 0.05;
  const y = rank * 16;
  const opacity = rank > 2 ? 0 : 1;
  return {
    "--s": scale,
    "--y": `${y}px`,
    "--o": opacity,
    "--d": `${(RANKS.length - 1 - rank) * 70}ms`,
    zIndex: 40 - rank,
  } as CSSProperties;
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "front" | "behind";
}[] = [
  {
    name: "Front card",
    desc: "rank 0 — the only one that's draggable",
    kind: "front",
  },
  {
    name: "Behind ranks",
    desc: "scale 1 − rank×0.05, y rank×16 · spring 320/32/0.9",
    kind: "behind",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "front") {
    return (
      <span className="h-4 w-5 rounded-2xl border border-[var(--foreground)]/60 bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-4 w-5 rounded-2xl border border-fd-border bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

export function SwipeDeckAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one stack · rank formula, not layout">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[360px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-40 w-28 ${reduced ? "swda-static" : ""}`}
          >
            {RANKS.map((rank) => (
              <div
                key={rank}
                className={`swda-card absolute inset-0 rounded-2xl border ${
                  rank === 0
                    ? "border-[var(--foreground)]/60 bg-[var(--card)]"
                    : "border-fd-border bg-[var(--muted)]"
                }`}
                style={cardStyle(rank)}
              />
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
