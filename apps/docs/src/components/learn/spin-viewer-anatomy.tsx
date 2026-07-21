"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * There's no 3D anywhere in `SpinViewer` — it's an ordered `frames[]` array
 * and an `index` into it. Rotating the object is just swapping `<img
 * src={frames[index]} />`, so this scene uses CSS `steps()` instead of an
 * easing curve: the dial and the filmstrip highlight jump between discrete
 * positions, never tween through the ones in between.
 *
 * Geometry is locked: 8 frames, 8px dots, 16px gaps → step = 24px. Highlight
 * travels `(8 - 1) * 24` with `steps(7)` so it lands on every dot center.
 */
const FRAMES = 8;
const DOT = 8;
const GAP = 16;
const STEP = DOT + GAP; // 24
const TRAVEL = (FRAMES - 1) * STEP; // 168
const TRACK_W = FRAMES * DOT + (FRAMES - 1) * GAP;

const CSS = `
@keyframes sva-spin  { to { transform: rotate(360deg); } }
@keyframes sva-track { to { transform: translateX(${TRAVEL}px); } }
.sva-spin  { animation: sva-spin 4.8s steps(${FRAMES}) infinite; }
.sva-track { animation: sva-track 4.8s steps(${FRAMES - 1}) infinite; }
.sva-static .sva-spin  { animation: none; transform: rotate(135deg); }
.sva-static .sva-track { animation: none; transform: translateX(${3 * STEP}px); }
`;

const TICKS = Array.from({ length: FRAMES }, (_, i) => i);

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "frames[]",
    desc: "ordered image URLs, preloaded once on mount",
    swatch:
      "h-3 w-8 rounded-md border-2 border-dashed border-[var(--foreground)]/50 bg-transparent ring-1 ring-fd-border ring-inset",
  },
  {
    name: "index",
    desc: "React state — which frame is current",
    swatch:
      "size-2 rounded-full bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset",
  },
  {
    name: "img src",
    desc: "frames[index], swapped — never interpolated",
    swatch:
      "size-2.5 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset",
  },
];

export function SpinViewerAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="an array and an index, nothing 3D">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 ${reduced ? "sva-static" : ""}`}
          >
            {/* Short dial — stays inside the viewport, doesn't jab at the strip. */}
            <div className="grid size-28 place-items-center rounded-xl border border-fd-border bg-[var(--card)]">
              <div className="relative size-16">
                <div className="absolute inset-0 rounded-full border border-[var(--foreground)]/15" />
                <div className="sva-spin absolute inset-x-0 top-1/2 mx-auto h-7 w-1 origin-bottom -translate-y-full rounded-full bg-[var(--foreground)]/70" />
                <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/50" />
              </div>
            </div>

            <div
              className="relative"
              style={{ width: TRACK_W, height: DOT } as CSSProperties}
            >
              <div
                className="absolute inset-0 flex"
                style={{ gap: GAP } as CSSProperties}
              >
                {TICKS.map((i) => (
                  <span
                    key={i}
                    className="size-2 shrink-0 rounded-full bg-[var(--muted)]"
                  />
                ))}
              </div>
              {/* Same size as dots, left-aligned to first dot — steps land on centers. */}
              <span className="sva-track absolute top-0 left-0 size-2 rounded-full bg-[var(--foreground)]" />
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              frames[index] — 8 of 48
            </p>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
                <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[11px] text-fd-muted-foreground">
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
