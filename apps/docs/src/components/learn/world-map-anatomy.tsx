"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One SVG, three layers sharing a coordinate space: a static grid of land
 * dots (`currentColor`, generated once by `dotted-map`), a pin at every arc
 * endpoint, and an arc — a plain quadratic Bézier — between any two pins.
 * Color is intentional on the arc; it's the one colored element in the real
 * component.
 */
const DOTS = 8 * 5;

const CSS = `
@keyframes wma-dot { from { opacity: 0; } to { opacity: 1; } }
@keyframes wma-pin { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }
@keyframes wma-arc { from { opacity: 0; } to { opacity: 1; } }
.wma-dot { opacity: 0; animation: wma-dot 400ms linear var(--d) both; }
.wma-pin { opacity: 0; animation: wma-pin 380ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.wma-arc { opacity: 0; animation: wma-arc 500ms linear 520ms both; }
.wma-static .wma-dot,
.wma-static .wma-pin,
.wma-static .wma-arc { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Dots",
    desc: "static SVG grid, drawn once with currentColor",
    swatch: "bg-[var(--muted-foreground)]/40",
  },
  {
    name: "Pin",
    desc: "one per arc endpoint, deduped by coordinate",
    swatch: "bg-[var(--foreground)]/60",
  },
  {
    name: "Arc",
    desc: "quadratic Bézier bow between two pins",
    swatch: "bg-[var(--primary)]",
  },
];

export function WorldMapAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="dots · pins · one arc">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-[150px] w-full max-w-[320px] ${reduced ? "wma-static" : ""}`}
          >
            <svg
              viewBox="0 0 300 150"
              className="absolute inset-0 size-full"
              aria-hidden="true"
            >
              <title>World map anatomy</title>
              {Array.from({ length: DOTS }).map((_, i) => {
                const col = i % 8;
                const row = Math.floor(i / 8);
                return (
                  <circle
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed dot grid
                    key={i}
                    className="wma-dot"
                    cx={20 + col * 36 + (row % 2) * 18}
                    cy={20 + row * 28}
                    r={2.4}
                    fill="var(--muted-foreground)"
                    fillOpacity={0.4}
                    style={{ "--d": `${i * 6}ms` } as CSSProperties}
                  />
                );
              })}

              <path
                className="wma-arc"
                d="M 34 122 Q 150 34 266 96"
                fill="none"
                stroke="var(--primary)"
                strokeWidth={2.5}
                strokeLinecap="round"
              />

              <circle
                className="wma-pin"
                cx={34}
                cy={122}
                r={5}
                fill="var(--foreground)"
                style={{ "--d": "440ms" } as CSSProperties}
              />
              <circle
                className="wma-pin"
                cx={266}
                cy={96}
                r={5}
                fill="var(--foreground)"
                style={{ "--d": "480ms" } as CSSProperties}
              />
            </svg>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={`h-1.5 w-8 rounded-full ${item.swatch}`} />
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
