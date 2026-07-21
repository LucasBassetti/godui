"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Every entry is one flex row: a sticky node + label on the rail, and a
 * content card that fades up on its own. The rail itself is a single
 * absolutely-positioned line sized to the track's measured height — not one
 * segment per entry.
 */
const ROWS = 3;

const CSS = `
@keyframes stl-row { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.stl-row { opacity: 0; animation: stl-row 520ms cubic-bezier(0.3,0.7,0.4,1.1) var(--d) both; }
.stl-static .stl-row { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Rail",
    desc: "one line, height = measured track height",
    swatch:
      "h-4 w-0.5 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Node",
    desc: "sticky dot, stays put while its entry is in view",
    swatch:
      "size-3 rounded-full bg-[var(--card)] ring-2 ring-fd-border ring-inset",
  },
  {
    name: "Card",
    desc: "content, fades + slides up once on enter",
    swatch:
      "h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
];

export function ScrollTimelineAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one rail · a node + card per entry">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative flex w-full flex-col gap-6 ${reduced ? "stl-static" : ""}`}
          >
            <div className="absolute top-1 bottom-1 left-3 w-px bg-[var(--muted)]" />
            {Array.from({ length: ROWS }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
                key={i}
                className="stl-row flex items-start gap-4"
                style={{ "--d": `${i * 130}ms` } as CSSProperties}
              >
                <span className="relative z-base mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--card)] ring-2 ring-fd-border">
                  <span className="size-2 rounded-full bg-[var(--foreground)]/50" />
                </span>
                <div className="flex-1 rounded-xl border border-fd-border bg-[var(--card)] p-3">
                  <span className="block h-2 w-16 rounded-full bg-[var(--foreground)]/40" />
                  <span className="mt-2 block h-1.5 w-28 rounded-full bg-[var(--foreground)]/20" />
                </div>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
