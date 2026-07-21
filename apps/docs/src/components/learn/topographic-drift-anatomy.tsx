"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Sample lattice before any isolines — each dot is a noise corner on the
 * ~18px grid. Opacity stands in for field amplitude.
 */
const CSS = `
@keyframes tda-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tda-el { animation: tda-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.tda-static .tda-el { animation: none; opacity: 1; transform: none; }
`;

const SAMPLE_POINTS = Array.from({ length: 6 }, (_, y) =>
  Array.from({ length: 10 }, (_, x) => ({
    id: `tda-${x}-${y}`,
    x,
    y,
  })),
).flat();

const GUIDES = {
  h: [30, 50, 70, 90, 110],
  v: [30, 50, 70, 90, 110, 130, 150, 170, 190],
} as const;

export function TopographicDriftAnatomy() {
  return (
    <ScrollScene label="Sample grid" note="cell ≈ 18px · noiseScale 0.004">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "tda-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="tda-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 200 120"
              className="absolute inset-0 size-full p-4"
            >
              {GUIDES.h.map((y) => (
                <line
                  key={`h-${y}`}
                  x1={10}
                  y1={y}
                  x2={190}
                  y2={y}
                  stroke="var(--foreground)"
                  strokeOpacity={0.06}
                />
              ))}
              {GUIDES.v.map((x) => (
                <line
                  key={`v-${x}`}
                  x1={x}
                  y1={10}
                  x2={x}
                  y2={110}
                  stroke="var(--foreground)"
                  strokeOpacity={0.06}
                />
              ))}
              {SAMPLE_POINTS.map(({ id, x, y }) => (
                <circle
                  key={id}
                  cx={10 + x * 20}
                  cy={10 + y * 20}
                  r={2}
                  className="fill-[var(--foreground)]"
                  opacity={0.2 + ((x * 3 + y * 5) % 7) * 0.1}
                />
              ))}
            </svg>
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            Each corner is{" "}
            <span className="font-mono text-[12px]">
              valueNoise(i·cell·scale, j·cell·scale + z)
            </span>
            . Contour count is separate —{" "}
            <span className="font-mono text-[12px]">lineCount</span> levels get
            stroked later.
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Grid
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                cell ≈ 18px sample spacing
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Field
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                noiseScale = 0.004
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Levels
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                lineCount default 9
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
