"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Default BeamDraw geometry on a scaled-down 1000×400 canvas: four cubic
 * paths share the left origin (0,200) and fan to y = 40 / 150 / 250 / 360.
 */
const PATHS = [
  "M0 100 C 125 100, 175 30, 300 30 S 450 20, 500 20",
  "M0 100 C 125 100, 175 70, 300 70 S 450 75, 500 75",
  "M0 100 C 125 100, 175 130, 300 130 S 450 125, 500 125",
  "M0 100 C 125 100, 175 170, 300 170 S 450 180, 500 180",
] as const;

const CSS = `
@keyframes bda-draw {
  from { stroke-dashoffset: 1; opacity: 0.15; }
  to   { stroke-dashoffset: 0; opacity: 1; }
}
.bda-path { animation: bda-draw 900ms cubic-bezier(0.3,0.7,0.4,1) var(--d) both; }

@keyframes bda-node {
  from { opacity: 0; transform: scale(0.75); }
  to   { opacity: 1; transform: scale(1); }
}
.bda-node { animation: bda-node 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }

.bda-static .bda-path { animation: none; stroke-dashoffset: 0; opacity: 1; }
.bda-static .bda-node { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Origin",
    desc: "shared left endpoint at (0, 200) on the 1000×400 viewBox",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Fan paths",
    desc: "DEFAULT_PATHS — four cubics ending at y 40 / 150 / 250 / 360",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/50 ring-inset",
  },
  {
    name: "Ends",
    desc: "right-edge destinations; token bars stand in for node labels",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
] as const;

export function BeamDrawAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="4 fan paths · 1000×400">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "bda-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative w-full" style={{ aspectRatio: "5 / 2" }}>
            <svg
              aria-hidden="true"
              viewBox="0 0 500 200"
              fill="none"
              className="absolute inset-0 size-full overflow-visible"
            >
              {PATHS.map((d, i) => (
                <path
                  // biome-ignore lint/suspicious/noArrayIndexKey: positional static list
                  key={i}
                  className="bda-path"
                  d={d}
                  stroke="var(--foreground)"
                  strokeOpacity={0.55}
                  strokeWidth={2}
                  strokeLinecap="round"
                  pathLength={1}
                  style={
                    {
                      strokeDasharray: 1,
                      "--d": `${i * 90}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </svg>

            <div
              className="bda-node absolute top-1/2 left-0 flex size-10 -translate-y-1/2 items-center justify-center rounded-xl border border-fd-border bg-[var(--muted)] shadow-sm"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="size-2 rounded-full bg-[var(--foreground)]/40" />
            </div>

            {[20, 75, 125, 180].map((y, i) => (
              <div
                key={y}
                className="bda-node absolute right-0 flex h-8 w-16 -translate-y-1/2 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] shadow-sm"
                style={
                  {
                    top: `${(y / 200) * 100}%`,
                    "--d": `${180 + i * 70}ms`,
                  } as CSSProperties
                }
              >
                <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30" />
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
