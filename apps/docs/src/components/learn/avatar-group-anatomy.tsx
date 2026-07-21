"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The overlap isn't absolute positioning — it's negative `marginLeft` on
 * every avatar but the first, so the stack is still a normal flex row (tab
 * order and DOM order match visual order). `zIndex: i` puts later avatars
 * on top, and the `+N` chip is just one more item at the end of that same
 * row with the same negative margin.
 */
const COUNT = 5;
const OVERLAP = 12; // md size: overlap[size] in the source

const CSS = `
@keyframes aga-avatar { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
.aga-avatar { opacity: 0; animation: aga-avatar 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.aga-static .aga-avatar { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Avatar",
    desc: "marginLeft: -12px (except the first), zIndex: i",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "+N chip",
    desc: "same row, same negative margin, one extra item",
    swatch: "bg-[var(--foreground)]/30",
  },
];

export function AvatarGroupAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one flex row · negative margin overlap">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-center ${reduced ? "aga-static" : ""}`}
          >
            {Array.from({ length: COUNT }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed avatar row
                key={i}
                className="aga-avatar relative size-11 rounded-full bg-[var(--muted)] shadow-sm ring-2 ring-background"
                style={
                  {
                    marginLeft: i === 0 ? 0 : `-${OVERLAP}px`,
                    zIndex: i,
                    "--d": `${i * 70}ms`,
                  } as CSSProperties
                }
              />
            ))}
            <span
              className="aga-avatar relative flex size-11 items-center justify-center rounded-full bg-[var(--foreground)]/30 ring-2 ring-background"
              style={
                {
                  marginLeft: `-${OVERLAP}px`,
                  zIndex: COUNT,
                  "--d": `${COUNT * 70}ms`,
                } as CSSProperties
              }
            >
              <span className="h-1.5 w-4 rounded-full bg-[var(--background)]/70" />
            </span>
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
