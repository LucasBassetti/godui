"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three rows, two motion values. Row 1 and row 3 both read `translateX`
 * (scrollYProgress mapped to [0, 1000]); row 2 reads `translateXReverse`
 * ([0, -1000]) and is laid out `flex-row` instead of `flex-row-reverse` —
 * that's the entire "alternating direction" trick, no per-row springs.
 */
const ROWS: { key: string; label: string; dir: 1 | -1; delay: number }[] = [
  { key: "row1", label: "translateX", dir: 1, delay: 0 },
  { key: "row2", label: "translateXReverse", dir: -1, delay: 140 },
  { key: "row3", label: "translateX", dir: 1, delay: 280 },
];

const CSS = `
@keyframes hpa-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.hpa-row { opacity: 0; animation: hpa-in 640ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.hpa-static .hpa-row { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "translateX",
    desc: "rows 1 & 3 — scrollYProgress [0,1] → [0, 1000]",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "translateXReverse",
    desc: "row 2 — scrollYProgress [0,1] → [0, -1000]",
    swatch: "bg-[var(--muted)]",
  },
];

export function HeroParallaxAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="two motion values, three rows">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col gap-4 ${reduced ? "hpa-static" : ""}`}
          >
            {ROWS.map((row) => (
              <div
                key={row.key}
                className="hpa-row flex items-center gap-3"
                style={
                  {
                    "--d": `${row.delay}ms`,
                    flexDirection: row.dir === 1 ? "row-reverse" : "row",
                  } as CSSProperties
                }
              >
                <span className="shrink-0 text-[var(--foreground)]/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {row.dir === 1 ? (
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    ) : (
                      <path d="M19 12H5M11 6l-6 6 6 6" />
                    )}
                  </svg>
                </span>
                {Array.from({ length: 4 }).map((_, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length card row
                    key={i}
                    className="h-10 flex-1 rounded-lg border border-border bg-[var(--muted)]"
                  />
                ))}
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-3 w-5 rounded-lg ${item.swatch} ring-1 ring-fd-border ring-inset`}
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
