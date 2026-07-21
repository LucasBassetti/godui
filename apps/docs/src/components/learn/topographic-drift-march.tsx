"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Left: one cell with a 4-bit corner mask and the interpolated edge segment.
 * Right: stacked isolines with mid-level alpha emphasis.
 */
const CSS = `
@keyframes tdm-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tdm-el { animation: tdm-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.tdm-static .tdm-el { animation: none; opacity: 1; transform: none; }

@keyframes tdm-draw {
  from { stroke-dashoffset: 48; opacity: 0.2; }
  to { stroke-dashoffset: 0; opacity: 1; }
}
.tdm-line {
  stroke-dasharray: 48;
  animation: tdm-draw 1.2s cubic-bezier(0.3,0.7,0.4,1) var(--d) both;
}
.tdm-static .tdm-line { animation: none; stroke-dashoffset: 0; opacity: 1; }
`;

export function TopographicDriftMarch() {
  return (
    <ScrollScene label="Marching squares" note="4-bit mask · 16 edge cases">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "tdm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-3">
            {/* Single cell bitmask */}
            <div
              className="tdm-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
                <svg aria-hidden="true" viewBox="0 0 80 80" className="size-28">
                  {/* cell */}
                  <rect
                    x="16"
                    y="16"
                    width="48"
                    height="48"
                    fill="none"
                    stroke="var(--foreground)"
                    strokeOpacity={0.2}
                  />
                  {/* corners: tl above, tr above, br below, bl below → case ~12-ish horizontal */}
                  <circle cx="16" cy="16" r="3.5" fill="var(--foreground)" />
                  <circle cx="64" cy="16" r="3.5" fill="var(--foreground)" />
                  <circle
                    cx="64"
                    cy="64"
                    r="3.5"
                    fill="var(--foreground)"
                    fillOpacity={0.2}
                  />
                  <circle
                    cx="16"
                    cy="64"
                    r="3.5"
                    fill="var(--foreground)"
                    fillOpacity={0.2}
                  />
                  {/* interpolated segment across mid */}
                  <line
                    className="tdm-line"
                    style={{ "--d": "80ms" } as CSSProperties}
                    x1="16"
                    y1="40"
                    x2="64"
                    y2="40"
                    stroke="var(--foreground)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                one cell · bitmask
              </span>
            </div>

            {/* Stacked levels */}
            <div
              className="tdm-el flex flex-col items-center gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div className="relative h-36 w-full overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] p-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 160 100"
                  className="size-full"
                >
                  <path
                    className="tdm-line fill-none stroke-[var(--foreground)]"
                    style={{ "--d": "0ms" } as CSSProperties}
                    strokeWidth="1.4"
                    d="M8 72 C28 48, 48 36, 78 42 S118 70, 152 28"
                    opacity={0.75}
                  />
                  <path
                    className="tdm-line fill-none stroke-[var(--foreground)]"
                    style={{ "--d": "100ms" } as CSSProperties}
                    strokeWidth="1.1"
                    d="M8 82 C32 62, 52 50, 82 56 S122 82, 152 40"
                    opacity={0.4}
                  />
                  <path
                    className="tdm-line fill-none stroke-[var(--foreground)]"
                    style={{ "--d": "200ms" } as CSSProperties}
                    strokeWidth="0.9"
                    d="M8 58 C30 40, 50 28, 80 34 S120 58, 152 20"
                    opacity={0.28}
                  />
                </svg>
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                levels · mid alpha peak
              </span>
            </div>
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            Filled corners are above the level. The segment is the isoline —
            interpolated where the field crosses{" "}
            <span className="font-mono text-[12px]">level</span> on each edge.
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Cases
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                16 configs · skip 0 and 15
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Alpha
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                0.1 + 0.25×(1−|0.5−level|×2)
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
