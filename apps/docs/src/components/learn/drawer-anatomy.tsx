"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * A portalled sheet, not a modal card: a click-to-close backdrop behind a
 * panel pinned to one edge (`inset-x-0 bottom-0` for the default bottom
 * side), with a drag handle pill at the top standing in for the grab target
 * and a title + content stack below it. `side="right"` swaps the same three
 * pieces onto the opposite edge with no handle.
 */
const CSS = `
@keyframes dwa-row { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.dwa-row { opacity: 0; animation: dwa-row 360ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.dwa-static .dwa-row { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "backdrop",
    desc: "click-through scrim, closes on click",
    swatch: "bg-[var(--foreground)]/10",
  },
  {
    name: "panel",
    desc: "role=dialog, pinned to one edge",
    swatch: "bg-[var(--card)] ring-1",
  },
  {
    name: "handle",
    desc: "bottom only — drag target",
    swatch: "bg-[var(--muted-foreground)]/40",
  },
];

export function DrawerAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="backdrop → panel → handle → content">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-64 w-full overflow-hidden rounded-xl border border-fd-border border-dashed bg-[var(--foreground)]/[0.04] ${reduced ? "dwa-static" : ""}`}
          >
            {/* viewport content, dimmed by the backdrop */}
            <div
              className="dwa-row absolute inset-3 flex items-start gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/15" />
            </div>

            {/* sheet, pinned to the bottom edge */}
            <div
              className="dwa-row absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border bg-card p-4 shadow-2xl"
              style={{ "--d": "70ms" } as CSSProperties}
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--muted-foreground)]/40" />
              <div className="h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-[var(--foreground)]/12" />
                <div className="h-2 w-4/5 rounded-full bg-[var(--foreground)]/12" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
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
