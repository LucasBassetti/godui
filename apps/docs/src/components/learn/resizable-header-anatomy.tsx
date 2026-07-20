"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Structurally the header is one `motion.nav` — logo on the left, a link row
 * with room for a hover pill and an active underline, a CTA and a mobile
 * toggle on the right — all riding the same `layout` animation when its
 * container class flips between the expanded and collapsed shape.
 */
const CSS = `
@keyframes rha-bar {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes rha-piece {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.rha-bar   { opacity: 0; animation: rha-bar 420ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.rha-piece { opacity: 0; animation: rha-piece 380ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.rha-static .rha-bar,
.rha-static .rha-piece { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Logo",
    desc: "brand mark, shrink-0 on the left",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Links",
    desc: "nav row — carries the hover pill + active underline",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "CTA",
    desc: "shrink-0 action slot on the right",
    swatch: "bg-[var(--foreground)]/25",
  },
];

export function ResizableHeaderAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one nav · logo, links, CTA">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`rha-bar flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-[var(--card)] px-4 py-3 shadow-sm ${
              reduced ? "rha-static" : ""
            }`}
          >
            <span
              className="rha-piece size-6 shrink-0 rounded-full bg-[var(--foreground)]/45"
              style={{ "--d": "80ms" } as CSSProperties}
            />
            <div className="flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="rha-piece h-2 w-12 rounded-full bg-[var(--foreground)]/28"
                  style={{ "--d": `${160 + i * 60}ms` } as CSSProperties}
                />
              ))}
            </div>
            <span
              className="rha-piece h-7 w-20 shrink-0 rounded-full bg-[var(--foreground)]/25"
              style={{ "--d": "380ms" } as CSSProperties}
            />
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
