"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The root owns one number — `activeIndex` — and hands it down through
 * context. Each `Card` reads its own position, compares it to `activeIndex`,
 * and decides two things on its own: whether *it* is expanded, and — if
 * not — how far it is from the one that is (`distance =
 * |index - activeIndex|`). That distance is the only input to
 * `collapsedWidth`, so the funnel isn't hand-placed — it falls out of five
 * cards each asking the same question.
 */
const CSS = `
@keyframes pca-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.pca-el { opacity: 0; animation: pca-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pca-static .pca-el { opacity: 1; animation: none; transform: none; }
`;

// distance = |index - activeIndex|, activeIndex = 2 of 5 cards.
const ROWS: { width: string; expanded: boolean; delay: number }[] = [
  { width: "83%", expanded: false, delay: 0 },
  { width: "90%", expanded: false, delay: 60 },
  { width: "100%", expanded: true, delay: 120 },
  { width: "90%", expanded: false, delay: 180 },
  { width: "83%", expanded: false, delay: 240 },
];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Root",
    desc: "owns activeIndex, the only state",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Card",
    desc: "compares its index, measures its own layout",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Collapsed",
    desc: "pill, width from distance to active",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Expanded",
    desc: "full width, distance 0",
    swatch: "bg-[var(--card)]",
  },
];

export function ProgressiveCardRevealAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one activeIndex, five cards react">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-8 ${reduced ? "pca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col items-center gap-2">
            {ROWS.map((row, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row set
                key={i}
                className="pca-el flex justify-center"
                style={
                  { width: "100%", "--d": `${row.delay}ms` } as CSSProperties
                }
              >
                <div
                  className={`flex items-center border border-border ${
                    row.expanded
                      ? "h-12 rounded-2xl bg-[var(--card)] px-4 shadow-sm"
                      : "h-8 rounded-full bg-[var(--foreground)]/[0.06] px-4"
                  }`}
                  style={{ width: row.width }}
                >
                  <span
                    className={`h-1.5 rounded-full bg-[var(--foreground)]/35 ${row.expanded ? "w-16" : "w-10"}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
