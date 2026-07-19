"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The commit line: `threshold` defaults to 0.9 of `maxX`. Drag past it and
 * release, and `confirm()` springs the thumb the rest of the way to
 * `maxX` (500/40). Fall short and `settleBack()` springs it home to 0. Same
 * `md`-size geometry as `SlideAnatomy` — 288×48 track, 40px thumb, 4px pad,
 * so `maxX` is a real 240.
 */
const TRACK_W = 288;
const TRACK_H = 48;
const THUMB = 40;
const PAD = 4;
const MAX_X = 240; // real maxX at md: 288 - 40 - 4*2
const THRESHOLD_X = MAX_X * 0.9; // 216
const FILL_W = MAX_X + THUMB; // widest the fill ever gets

const px = (n: number) => `${n}px`;
const fillScale = (x: number) => ((x + THUMB) / FILL_W).toFixed(3);

const CSS = `
@keyframes st-thumb {
  0%, 4%    { transform: translateX(0px); }
  24%       { transform: translateX(${px(168)}); }
  30%       { transform: translateX(${px(168)}); }
  46%       { transform: translateX(0px); }
  54%       { transform: translateX(0px); }
  70%       { transform: translateX(${px(225)}); }
  74%, 86%  { transform: translateX(${px(MAX_X)}); }
  96%, 100% { transform: translateX(0px); }
}
@keyframes st-fill {
  0%, 4%    { transform: scaleX(${fillScale(0)}); }
  24%, 30%  { transform: scaleX(${fillScale(168)}); }
  46%, 54%  { transform: scaleX(${fillScale(0)}); }
  70%       { transform: scaleX(${fillScale(225)}); }
  74%, 86%  { transform: scaleX(1); }
  96%, 100% { transform: scaleX(${fillScale(0)}); }
}
@keyframes st-label-idle {
  0%, 4%    { opacity: 1; }
  6%, 94%   { opacity: 0; }
  96%, 100% { opacity: 1; }
}
@keyframes st-label-confirmed {
  0%, 72%   { opacity: 0; }
  74%, 86%  { opacity: 1; }
  88%, 100% { opacity: 0; }
}
@keyframes st-icon-arrow {
  0%, 72%   { opacity: 1; }
  74%, 100% { opacity: 0; }
}
@keyframes st-icon-check {
  0%, 72%   { opacity: 0; }
  74%, 100% { opacity: 1; }
}
.st-thumb          { animation: st-thumb 5.6s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.st-fill           { animation: st-fill 5.6s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.st-label-idle     { animation: st-label-idle 5.6s linear infinite; }
.st-label-confirmed{ animation: st-label-confirmed 5.6s linear infinite; }
.st-icon-arrow     { animation: st-icon-arrow 5.6s linear infinite; }
.st-icon-check     { animation: st-icon-check 5.6s linear infinite; }
.st-static .st-thumb           { animation: none; transform: translateX(${px(MAX_X)}); }
.st-static .st-fill            { animation: none; transform: scaleX(1); }
.st-static .st-label-idle      { animation: none; opacity: 0; }
.st-static .st-label-confirmed { animation: none; opacity: 1; }
.st-static .st-icon-arrow      { animation: none; opacity: 0; }
.st-static .st-icon-check      { animation: none; opacity: 1; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Falls short",
    desc: "released below 216px → spring(500,40) back to 0",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Past the line",
    desc: "released past 216px → confirm() springs to maxX",
    swatch: "bg-[var(--foreground)]",
  },
  {
    name: "Threshold",
    desc: "maxX × 0.9 = 216px",
    swatch: "bg-[var(--foreground)]/40",
  },
];

export function SlideThreshold() {
  return (
    <ScrollScene label="The threshold" note="maxX × 0.9 = 216px">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "st-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative flex items-center rounded-full bg-[var(--muted)]"
            style={{ width: TRACK_W, height: TRACK_H }}
            aria-hidden="true"
          >
            {/* Fill — trails the thumb, width = x + thumb. */}
            <div
              className="st-fill absolute origin-left rounded-full bg-[var(--foreground)]/20"
              style={{ top: PAD, bottom: PAD, left: PAD, width: FILL_W }}
            />

            {/* Threshold marker — the commit line at 90% of maxX. */}
            <div
              className="absolute bg-[var(--foreground)]/40"
              style={{
                top: PAD,
                bottom: PAD,
                left: PAD + THRESHOLD_X,
                width: 2,
              }}
            />

            {/* Label tokens — idle vs confirmed, cross-fading like the real component. */}
            <span className="st-label-idle pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/25" />
            </span>
            <span className="st-label-confirmed pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/60" />
            </span>

            {/* Thumb */}
            <div
              className="st-thumb relative z-10 flex shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] shadow-sm"
              style={{ width: THUMB, height: THUMB, margin: PAD }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--background)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="st-icon-arrow absolute size-5"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--background)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="st-icon-check absolute size-5"
                aria-hidden="true"
              >
                <path d="M5 12.5 10 17.5 19 7" />
              </svg>
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
