"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Slow connect → hold → disconnect cycle through the real goo filter.
 * Stepped holds make each phase readable: apart, approaching, fused,
 * separating. Same metaball recipe as the component (blur + color-matrix)
 * on two stacked rounded rects.
 */
const DURATION = "9.5s";

const CSS = `
@keyframes gsf-move {
  /* apart — hold */
  0%, 14%     { transform: translateY(0); }
  /* approach */
  28%         { transform: translateY(22px); }
  /* fused — hold */
  36%, 58%    { transform: translateY(40px); }
  /* separate */
  72%         { transform: translateY(22px); }
  /* apart — hold */
  86%, 100%   { transform: translateY(0); }
}
@keyframes gsf-s1 {
  0%, 14%     { opacity: 1; transform: scale(1.02); }
  18%, 100%   { opacity: 0.28; transform: scale(1); }
}
@keyframes gsf-s2 {
  0%, 14%     { opacity: 0.28; transform: scale(1); }
  18%, 34%    { opacity: 1; transform: scale(1.02); }
  38%, 100%   { opacity: 0.28; transform: scale(1); }
}
@keyframes gsf-s3 {
  0%, 34%     { opacity: 0.28; transform: scale(1); }
  38%, 58%    { opacity: 1; transform: scale(1.02); }
  62%, 100%   { opacity: 0.28; transform: scale(1); }
}
@keyframes gsf-s4 {
  0%, 58%     { opacity: 0.28; transform: scale(1); }
  62%, 82%    { opacity: 1; transform: scale(1.02); }
  86%, 100%   { opacity: 0.28; transform: scale(1); }
}
.gsf-a { animation: gsf-move ${DURATION} cubic-bezier(0.45,0.05,0.55,0.95) infinite; }
.gsf-s1 { animation: gsf-s1 ${DURATION} linear infinite; }
.gsf-s2 { animation: gsf-s2 ${DURATION} linear infinite; }
.gsf-s3 { animation: gsf-s3 ${DURATION} linear infinite; }
.gsf-s4 { animation: gsf-s4 ${DURATION} linear infinite; }
.gsf-static .gsf-a { animation: none; transform: translateY(40px); }
.gsf-static .gsf-s1,
.gsf-static .gsf-s2,
.gsf-static .gsf-s4 { animation: none; opacity: 0.28; transform: none; }
.gsf-static .gsf-s3 { animation: none; opacity: 1; transform: none; }
`;

const FILTER_ID = "gooey-stack-learn-filter";

const STEPS: { cls: string; name: string; desc: string }[] = [
  { cls: "gsf-s1", name: "1 · Apart", desc: "gap open, no overlap" },
  { cls: "gsf-s2", name: "2 · Approach", desc: "halos start to kiss" },
  { cls: "gsf-s3", name: "3 · Fused", desc: "color-matrix seals the bridge" },
  { cls: "gsf-s4", name: "4 · Separate", desc: "bridge thins, then snaps" },
];

function Pair({ filtered }: { filtered?: boolean }) {
  // Filtered pair is native SVG (rects inside the filtered <g>): Safari
  // composites a transform-animated HTML child onto its own layer, which
  // escapes an HTML `filter: url()`, so the silhouettes never neck together
  // there. SVG shapes stay inside the filter and fuse on every engine.
  if (filtered) {
    return (
      <svg
        aria-hidden="true"
        className="pointer-events-none mx-auto overflow-visible"
        width={96}
        height={128}
        viewBox="0 0 96 128"
      >
        <defs>
          <filter
            id={FILTER_ID}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 80 -40"
              result="goo"
            />
          </filter>
        </defs>
        <g
          filter={`url(#${FILTER_ID})`}
          fillOpacity={0.55}
          style={{ fill: "var(--foreground)" }}
        >
          {/* Anchor — fixed at the bottom. */}
          <rect x={0} y={80} width={96} height={48} rx={14} />
          {/* Upper card — starts apart, crawls down into the anchor. */}
          <rect className="gsf-a" x={0} y={0} width={96} height={48} rx={14} />
        </g>
      </svg>
    );
  }
  return (
    <div className="relative mx-auto h-[128px] w-24">
      {/* Anchor — fixed at the bottom. */}
      <div className="absolute inset-x-0 bottom-0 h-12 rounded-[14px] bg-[var(--foreground)]/55" />
      {/* Upper card — starts apart, crawls down into the anchor. */}
      <div className="gsf-a absolute inset-x-0 top-0">
        <div className="h-12 rounded-[14px] bg-[var(--foreground)]/55" />
      </div>
    </div>
  );
}

export function GooeyStackFilter() {
  return (
    <ScrollScene label="The filter" note="slow connect → hold → disconnect">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[520px] flex-col items-center gap-8 ${reduced ? "gsf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-[148px] w-full items-center justify-center">
                <Pair />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                raw silhouettes
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-[148px] w-full items-center justify-center">
                <Pair filtered />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                after goo filter
              </p>
            </div>
          </div>

          <ol className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.name}
                className={`${step.cls} flex flex-col gap-1 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-3 py-2.5`}
                style={{ transformOrigin: "center" } as CSSProperties}
              >
                <span className="font-medium text-[12px] text-fd-foreground">
                  {step.name}
                </span>
                <span className="text-[11px] text-fd-muted-foreground">
                  {step.desc}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </ScrollScene>
  );
}
