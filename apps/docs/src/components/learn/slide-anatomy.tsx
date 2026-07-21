"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Real track geometry at the `md` size: 288×48 track, 40px thumb, 4px pad.
 * The thumb drives everything — the fill's right edge always sits at
 * `x + thumb`, so as the thumb moves the trailing fill grows with it, and
 * the label fades out over the first 60% of the travel.
 */
const TRACK_W = 288;
const TRACK_H = 48;
const THUMB = 40;
const PAD = 4;
const TRAVEL = 100; // demo travel distance (real maxX at md is 240)
const FILL_W = TRAVEL + THUMB; // widest the fill ever gets in this demo

const CSS = `
@keyframes sa-thumb {
  0%, 8%    { transform: translateX(0px); }
  50%, 58%  { transform: translateX(${TRAVEL}px); }
  100%      { transform: translateX(0px); }
}
@keyframes sa-fill {
  0%, 8%    { transform: scaleX(${(THUMB / FILL_W).toFixed(3)}); }
  50%, 58%  { transform: scaleX(1); }
  100%      { transform: scaleX(${(THUMB / FILL_W).toFixed(3)}); }
}
@keyframes sa-label {
  0%, 8%    { opacity: 1; }
  50%, 58%  { opacity: 0.3; }
  100%      { opacity: 1; }
}
.sa-thumb { animation: sa-thumb 4s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.sa-fill  { animation: sa-fill 4s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.sa-label { animation: sa-label 4s cubic-bezier(0.3, 0.7, 0.4, 1.2) infinite; }
.sa-static .sa-thumb { animation: none; transform: translateX(${TRAVEL}px); }
.sa-static .sa-fill  { animation: none; transform: scaleX(1); }
.sa-static .sa-label { animation: none; opacity: 0.3; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Track",
    desc: "rounded-full border, bg-muted",
    swatch:
      "h-3 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Fill",
    desc: "trails thumb, width = x + thumb",
    swatch:
      "h-2 w-8 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Thumb",
    desc: "draggable, x is a motion value",
    swatch:
      "size-3 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Label",
    desc: "fades over first 60% of travel",
    swatch:
      "h-1.5 w-8 rounded-full bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset",
  },
];

export function SlideAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="288×48 track · 40px thumb · 4px pad">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "sa-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative flex items-center rounded-full bg-[var(--muted)]"
            style={{ width: TRACK_W, height: TRACK_H }}
            aria-hidden="true"
          >
            {/* Fill — pinned width, scaled from the left so it visually grows with x. */}
            <div
              className="sa-fill absolute origin-left rounded-full bg-[var(--foreground)]/20"
              style={{
                top: PAD,
                bottom: PAD,
                left: PAD,
                width: FILL_W,
              }}
            />
            {/* Label token — fades out as the thumb advances. */}
            <span className="sa-label pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/25" />
            </span>
            {/* Thumb */}
            <div
              className="sa-thumb relative z-10 flex shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] shadow-sm"
              style={{
                width: THUMB,
                height: THUMB,
                margin: PAD,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--background)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-4">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
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
