"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Two lifecycle beats from the real component:
 * 1. `isView` gates `annotate()` behind `useInView({ once, margin: "-10%" })`
 * 2. ResizeObserver hide → show redraws the sketch when the span (or body) resizes
 */
const CSS = `
@keyframes hl-life-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.hl-life-panel { opacity: 0; animation: hl-life-in 460ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.hl-life-static .hl-life-panel { opacity: 1; animation: none; transform: none; }

@keyframes hl-life-pulse {
  0%, 35%   { opacity: 0.25; transform: scaleX(0.55); }
  50%, 70%  { opacity: 1; transform: scaleX(1); }
  85%, 100% { opacity: 0.25; transform: scaleX(0.55); }
}
.hl-life-gate {
  transform-origin: center;
  animation: hl-life-pulse 3.2s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.hl-life-static .hl-life-gate { animation: none; opacity: 1; transform: none; }

@keyframes hl-life-resize {
  0%, 20%   { transform: scaleX(0.72); }
  45%, 55%  { transform: scaleX(1); }
  80%, 100% { transform: scaleX(0.72); }
}
@keyframes hl-life-redraw {
  0%, 22%   { opacity: 1; transform: scaleX(1); }
  30%, 38%  { opacity: 0; transform: scaleX(0.2); }
  48%, 70%  { opacity: 1; transform: scaleX(1); }
  78%, 86%  { opacity: 0; transform: scaleX(0.2); }
  96%, 100% { opacity: 1; transform: scaleX(1); }
}
.hl-life-box {
  transform-origin: center;
  animation: hl-life-resize 3.6s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.hl-life-mark {
  transform-origin: left center;
  animation: hl-life-redraw 3.6s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.hl-life-static .hl-life-box { animation: none; transform: none; }
.hl-life-static .hl-life-mark { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "gate" | "resize";
}[] = [
  {
    name: "In-view gate",
    desc: "useInView once, margin −10% — annotate only when shouldShow",
    kind: "gate",
  },
  {
    name: "Resize redraw",
    desc: "ResizeObserver: hide() then show() on the same annotation",
    kind: "resize",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "resize") {
    return (
      <span className="h-3 w-6 rounded-lg border border-dashed border-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-6 rounded-sm bg-black/20 ring-1 ring-fd-border ring-inset" />
  );
}

export function HighlighterLifecycle() {
  return (
    <ScrollScene label="Lifecycle" note="in-view gate + resize redraw">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col gap-10 ${reduced ? "hl-life-static" : ""}`}
          >
            {/* In-view gate */}
            <div
              className="hl-life-panel flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative flex h-28 w-full max-w-[300px] flex-col overflow-hidden rounded-xl border border-fd-border bg-[var(--muted)]/40">
                {/* viewport chrome */}
                <div className="flex h-5 items-center gap-1 border-b border-fd-border px-2">
                  <span className="size-1.5 rounded-full bg-[var(--foreground)]/25" />
                  <span className="size-1.5 rounded-full bg-[var(--foreground)]/25" />
                  <span className="size-1.5 rounded-full bg-[var(--foreground)]/25" />
                </div>
                <div className="relative flex flex-1 items-center justify-center">
                  {/* −10% margin band */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-[10%] bottom-[10%] border-y border-dashed border-[var(--foreground)]/25"
                  />
                  <div className="relative flex h-9 w-36 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)]">
                    <span
                      aria-hidden="true"
                      className="hl-life-gate absolute inset-x-2 inset-y-2 rounded-sm bg-black/20"
                    />
                    <span className="relative h-2 w-12 rounded-full bg-[var(--foreground)]/35" />
                  </div>
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                isView · margin −10% · once
              </p>
            </div>

            {/* Resize redraw */}
            <div
              className="hl-life-panel flex flex-col items-center gap-3"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <div className="flex h-16 w-full max-w-[300px] items-center justify-center rounded-xl border border-fd-border bg-[var(--card)] px-4">
                <div className="hl-life-box relative flex h-10 w-full max-w-[220px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-[var(--foreground)]/30">
                  <span
                    aria-hidden="true"
                    className="hl-life-mark absolute inset-x-2 inset-y-2 rounded-sm bg-black/15"
                  />
                  <span className="relative h-2 w-10 rounded-full bg-[var(--foreground)]/35" />
                </div>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                ResizeObserver · hide → show
              </p>
            </div>
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
