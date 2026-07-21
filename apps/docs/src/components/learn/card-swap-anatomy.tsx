"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Every card gets a `rank` (0 = front) derived from its position in an
 * `order` array, never from its own index. `rankOf[i]` looks up where item
 * `i` currently sits, and that single number drives four properties at once:
 * `x = rank * offsetX`, `y = -rank * offsetY`, `scale = 1 - rank * scaleStep`,
 * `rotateZ = rank * -2.5`. Four cards, one formula, no per-card special
 * casing.
 */
const RANKS = [0, 1, 2, 3];
const OFFSET_X = 22;
const OFFSET_Y = 28;
const SCALE_STEP = 0.06;

const CSS = `
@keyframes csa-in { from { opacity: 0; } to { opacity: 1; } }
.csa-plate { opacity: 0; animation: csa-in 520ms ease var(--d) both; }
.csa-static .csa-plate { opacity: 1; animation: none; }
`;

function plateStyle(rank: number): CSSProperties {
  return {
    transform: `translate(${rank * OFFSET_X}px, ${-rank * OFFSET_Y}px) scale(${1 - rank * SCALE_STEP}) rotate(${rank * -2.5}deg)`,
    zIndex: RANKS.length - rank,
    "--d": `${rank * 110}ms`,
  } as CSSProperties;
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "rank 0 (front)",
    desc: "x 0 · y 0 · scale 1 · rotate 0°",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "rank 1–3 (back)",
    desc: "each step: +22px x, −28px y, −0.06 scale, −2.5°",
    swatch: "bg-[var(--muted)]",
  },
];

export function CardSwapAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one rank, four properties">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-32 w-44 ${reduced ? "csa-static" : ""}`}
          >
            {RANKS.map((rank) => (
              <div
                key={rank}
                className="csa-plate absolute inset-0 rounded-2xl border border-fd-border bg-[var(--card)] shadow-md"
                style={plateStyle(rank)}
              />
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
