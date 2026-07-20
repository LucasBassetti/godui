"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `onMouseEnter` flips one `expanded` boolean. Every card re-targets its `y`
 * from the collapsed peek offset to a real cumulative offset measured by a
 * `ResizeObserver` per card (`offsets[i] = Σ height + GAP` for the cards
 * above it), and scale relaxes back to 1 — all on the same spring the cards
 * entered on. The per-card auto-dismiss timers are paused for as long as
 * `expanded` stays true, then resume the instant the pointer leaves.
 */
const CSS = `
@keyframes te-y   { 0%, 22% { transform: translateY(var(--c)); } 50%, 78% { transform: translateY(var(--e)); } 100% { transform: translateY(var(--c)); } }
@keyframes te-fill{ 0%, 22% { transform: scaleX(1); } 50%, 78% { transform: scaleX(0); } 100% { transform: scaleX(1); } }
.te-y    { animation: te-y 4.4s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.te-fill { animation: te-fill 4.4s linear infinite; transform-origin: left; }
.te-static .te-y    { animation: none; transform: translateY(var(--e)); }
.te-static .te-fill { animation: none; transform: scaleX(0); transform-origin: left; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Collapsed",
    desc: "y = dir × index × PEEK, timers run",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Expanded",
    desc: "hover → real offsets, timers pause",
    swatch: "bg-[var(--card)]",
  },
];

export function ToastExpand() {
  return (
    <ScrollScene label="Expand on hover" note="pauses auto-dismiss">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-8 ${reduced ? "te-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[196px] w-72 items-end justify-center">
            <div
              className="te-y absolute inset-x-2 bottom-0 h-[68px] rounded-xl border border-border bg-[var(--foreground)]/10"
              style={{ "--c": "-32px", "--e": "-164px" } as CSSProperties}
            />
            <div
              className="te-y absolute inset-x-1 bottom-0 h-[68px] rounded-xl border border-border bg-[var(--foreground)]/15"
              style={{ "--c": "-16px", "--e": "-82px" } as CSSProperties}
            />
            <div
              className="te-y absolute inset-x-0 bottom-0 flex h-[68px] w-full flex-col gap-2 rounded-xl border border-border bg-[var(--card)] p-3 shadow-lg"
              style={{ "--c": "0px", "--e": "0px" } as CSSProperties}
            >
              <span className="h-2 w-2/5 rounded-full bg-[var(--foreground)]/35" />
              <div className="mt-auto h-1 w-full overflow-hidden rounded-full bg-[var(--foreground)]/10">
                <div className="te-fill h-full w-full rounded-full bg-[var(--foreground)]/40" />
              </div>
            </div>
          </div>

          <dl className="grid w-full max-w-[380px] grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
