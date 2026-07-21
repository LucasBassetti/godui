"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The real arc animates `pathLength` 0 → 1 with a per-arc stagger
 * (`delay: 0.4 + i * 0.3`). That's a paint-driven SVG property, so the
 * compositor-safe stand-in here is the same curve split into five chords,
 * each one only ever animating `opacity` — a travelling reveal along the
 * same path instead of a literal stroke draw. Color is intentional: the arc
 * is the one subject this component draws in color.
 */
const CHORDS = [
  "M 30 130 L 78 93.2",
  "M 78 93.2 L 126 70.8",
  "M 126 70.8 L 174 62.8",
  "M 174 62.8 L 222 69.2",
  "M 222 69.2 L 270 90",
];

const CSS = `
@keyframes wmd-seg {
  0%, 4%    { opacity: 0; }
  16%       { opacity: 1; }
  62%       { opacity: 1; }
  78%, 100% { opacity: 0; }
}
.wmd-seg { opacity: 0; animation: wmd-seg 3.2s cubic-bezier(0.3,0.7,0.4,1) infinite; animation-delay: var(--d); }
.wmd-static .wmd-seg { opacity: 1; animation: none; }
`;

export function WorldMapDraw() {
  return (
    <ScrollScene label="The draw-in" note="pathLength 0→1, staggered per arc">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-[130px] w-full max-w-[300px] ${reduced ? "wmd-static" : ""}`}
          >
            <svg
              viewBox="0 0 300 150"
              className="absolute inset-0 size-full"
              aria-hidden="true"
            >
              <title>World map arc draw-in</title>
              <path
                d="M 30 130 L 78 93.2 L 126 70.8 L 174 62.8 L 222 69.2 L 270 90"
                fill="none"
                stroke="var(--muted-foreground)"
                strokeOpacity={0.25}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {CHORDS.map((d, i) => (
                <path
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed chord list
                  key={i}
                  className="wmd-seg"
                  d={d}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  style={{ "--d": `${i * 260}ms` } as CSSProperties}
                />
              ))}
              <circle cx={30} cy={130} r={4.5} fill="var(--foreground)" />
              <circle cx={270} cy={90} r={4.5} fill="var(--foreground)" />
            </svg>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {
              "pathLength: { duration, delay: 0.4 + i * 0.3, ease: [0.22,1,0.36,1] }"
            }
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted-foreground)]/25 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Track
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                the full arc, always faintly visible
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--primary)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Reveal
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                travels start pin → end pin, then loops
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
