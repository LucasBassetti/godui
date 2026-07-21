"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The lockup is one row inside an `<a>`: an icon slot, then a `flex-col` of
 * two text lines — a small caption on top, a bold store name below.
 * Proportions scale off a single `height` prop (`iconSize: height × 0.52`,
 * `topSize: height × 0.17`, `nameSize: height × 0.3`) — nothing here is a
 * fixed pixel value. Shapes stand in for the real store logos.
 */
const SHELLS: { theme: string; shell: string }[] = [
  { theme: "dark", shell: "bg-black text-white ring-1 ring-white/20" },
  { theme: "light", shell: "bg-white text-black ring-1 ring-black/15" },
];

const CSS = `
@keyframes stba-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.stba-shell { opacity: 0; animation: stba-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.stba-static .stba-shell { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Icon slot",
    desc: "iconSize = height × 0.52",
    swatch: "bg-[var(--foreground)]/45",
  },
  {
    name: "Two-line label",
    desc: "caption (0.17h) + name (0.3h), stacked",
    swatch: "bg-[var(--foreground)]/25",
  },
];

export function StoreBadgeAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one lockup · icon + two text lines">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-center justify-center gap-4 ${reduced ? "stba-static" : ""}`}
          >
            {SHELLS.map((s, i) => (
              <span
                key={s.theme}
                className={`stba-shell inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 ${s.shell}`}
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <span className="size-[22px] shrink-0 rounded-[6px] bg-current opacity-45" />
                <span className="flex flex-col items-start gap-1">
                  <span className="h-[6px] w-11 rounded-full bg-current opacity-40" />
                  <span className="h-[9px] w-16 rounded-full bg-current opacity-80" />
                </span>
              </span>
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
