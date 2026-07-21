"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Visualizes the real mapping: scrollYProgress [0.1, 0.8] → pathLength [0, 1].
 * Below 0.1 the path stays empty; above 0.8 it's fully drawn. The scrubber
 * loops through that window so the dead zones at each end read clearly.
 *
 * The scrubber rides a full-width rail so `translateX(%)` is relative to the
 * track — animating the dot itself would only move it by its own width.
 */
const PATH = "M20 70 C 120 70, 160 28, 260 28 S 340 40, 380 40";

const CSS = `
@keyframes bds-scrub {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
.bds-scrub { animation: bds-scrub 3.2s linear infinite; }

@keyframes bds-draw {
  0%, 12.5%     { stroke-dashoffset: 1; }
  87.5%, 100%   { stroke-dashoffset: 0; }
}
.bds-path { animation: bds-draw 3.2s linear infinite; }

@keyframes bds-window {
  from { opacity: 0; transform: scaleX(0.6); }
  to   { opacity: 1; transform: scaleX(1); }
}
.bds-window { animation: bds-window 500ms cubic-bezier(0.3,0.7,0.4,1) 80ms both; transform-origin: left center; }

.bds-static .bds-scrub { animation: none; transform: translateX(50%); }
.bds-static .bds-path { animation: none; stroke-dashoffset: 0; }
.bds-static .bds-window { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Dead zone",
    desc: "scrollYProgress < 0.1 → pathLength stays 0",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Active window",
    desc: "useTransform([0.1, 0.8], [0, 1])",
    swatch: "bg-[var(--foreground)]/35",
  },
  {
    name: "pathLength",
    desc: "SVG stroke fill fraction — 0 empty, 1 complete",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/50 ring-inset",
  },
] as const;

export function BeamDrawScroll() {
  return (
    <ScrollScene label="Scroll map" note="[0.1, 0.8] → [0, 1]">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "bds-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col gap-6">
            <svg
              aria-hidden="true"
              viewBox="0 0 400 100"
              fill="none"
              className="w-full overflow-visible"
            >
              <path
                d={PATH}
                stroke="var(--foreground)"
                strokeOpacity={0.12}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              <path
                className="bds-path"
                d={PATH}
                stroke="var(--foreground)"
                strokeOpacity={0.7}
                strokeWidth={2.5}
                strokeLinecap="round"
                pathLength={1}
                style={{ strokeDasharray: 1 }}
              />
            </svg>

            {/* Progress track: muted ends = dead zones, mid band = active map.
                Rail is full-width so scrub translateX(%) spans the track. */}
            <div className="relative h-3 w-full rounded-full bg-[var(--muted)]">
              <div className="bds-window absolute inset-y-0 left-[10%] w-[70%] rounded-full bg-[var(--foreground)]/30" />
              <div className="bds-scrub absolute inset-y-0 left-0 w-full">
                <div className="absolute top-1/2 left-0 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fd-border bg-[var(--card)] shadow-sm" />
              </div>
            </div>

            <div className="relative h-4 w-full font-mono text-[11px] text-fd-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute left-[10%] -translate-x-1/2">0.1</span>
              <span className="absolute left-[80%] -translate-x-1/2">0.8</span>
              <span className="absolute right-0">1</span>
            </div>
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
