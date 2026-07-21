"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy of ElasticText: children are split into per-character segments,
 * each driving `font-variation-settings: 'wght' var(--et-wght)`. Diagrammed
 * as vertical weight bars — taller = heavier — with no readable copy on the
 * shapes.
 */

const CHARS = 8;
/** Rest → peak → rest silhouette matching an AUTO_SPREAD=2.5 spotlight. */
const HEIGHTS = [0.28, 0.42, 0.68, 1, 0.68, 0.42, 0.28, 0.28];

const CSS = `
@keyframes eta-in {
  from { opacity: 0; transform: translateY(8px) scaleY(0.4); }
  to   { opacity: 1; transform: translateY(0) scaleY(1); }
}
.eta-bar {
  transform-origin: bottom center;
  opacity: 0;
  animation: eta-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.eta-static .eta-bar { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Segment",
    desc: "one character · data-elastic-segment",
    swatch: "bg-[var(--foreground)]/35",
  },
  {
    name: "Weight axis",
    desc: "'wght' via --et-wght · min ↔ max",
    swatch: "bg-[var(--foreground)]",
  },
];

export function ElasticTextAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="characters → segments → wght bars">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-28 items-end justify-center gap-2 ${reduced ? "eta-static" : ""}`}
            aria-hidden="true"
          >
            {Array.from({ length: CHARS }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length segment row
                key={i}
                className="eta-bar w-3 rounded-sm bg-[var(--foreground)]/70 sm:w-3.5"
                style={
                  {
                    height: `${Math.round(HEIGHTS[i] * 96)}px`,
                    "--d": `${i * 55}ms`,
                    opacity: 0.35 + HEIGHTS[i] * 0.55,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"[font-variation-settings:'wght'_var(--et-wght)]"}
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
