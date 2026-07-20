"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three pieces stack to make Mega Menu: a trigger row of plain buttons/links,
 * one shared highlight pill that materializes only under the hot trigger, and
 * — for triggers that carry `sections` — a panel of link columns that opens
 * below it. The middle trigger is "hot" here, so its pill is lit and its
 * panel is open; the flanking triggers stay flat.
 */
const CSS = `
@keyframes mma-trigger {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes mma-pill {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: none; }
}
@keyframes mma-panel {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes mma-link {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: none; }
}
.mma-trigger { opacity: 0; animation: mma-trigger 380ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.mma-pill    { opacity: 0; animation: mma-pill 320ms cubic-bezier(0.34,1.4,0.5,1) 260ms both; }
.mma-panel   { opacity: 0; animation: mma-panel 320ms cubic-bezier(0.22,1,0.36,1) 340ms both; }
.mma-link    { opacity: 0; animation: mma-link 320ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.mma-static .mma-trigger,
.mma-static .mma-pill,
.mma-static .mma-panel,
.mma-static .mma-link { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Triggers",
    desc: "plain buttons/links — one per top-level item",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Highlight pill",
    desc: "one layoutId span, rendered only under the hot trigger",
    swatch: "bg-[var(--foreground)]/12",
  },
  {
    name: "Panel",
    desc: "opens below a trigger that carries sections",
    swatch: "bg-[var(--card)]",
  },
];

export function MegaMenuAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="trigger row · pill · panel">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex flex-col items-start ${reduced ? "mma-static" : ""}`}
          >
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => {
                const hot = i === 1;
                return (
                  <div
                    key={i}
                    className="mma-trigger relative flex h-9 w-24 items-center justify-center rounded-lg"
                    style={{ "--d": `${i * 70}ms` } as CSSProperties}
                  >
                    {hot && (
                      <span className="mma-pill absolute inset-0 rounded-lg bg-[var(--foreground)]/12" />
                    )}
                    <span
                      className={`relative h-2 rounded-full ${
                        hot
                          ? "w-12 bg-[var(--foreground)]/55"
                          : "w-10 bg-[var(--foreground)]/25"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mma-panel ml-[100px] mt-2 flex gap-6 rounded-2xl border border-fd-border bg-[var(--card)] p-4 shadow-lg">
              {[0, 1].map((col) => (
                <div key={col} className="flex w-32 flex-col gap-2.5">
                  <span
                    className="mma-link h-1.5 w-14 rounded-full bg-[var(--foreground)]/20"
                    style={{ "--d": `${420 + col * 60}ms` } as CSSProperties}
                  />
                  {[0, 1].map((row) => (
                    <div
                      key={row}
                      className="mma-link flex items-center gap-2"
                      style={
                        {
                          "--d": `${480 + col * 60 + row * 50}ms`,
                        } as CSSProperties
                      }
                    >
                      <span className="size-6 shrink-0 rounded-md bg-[var(--muted)]" />
                      <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/25" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
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
