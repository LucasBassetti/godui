"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One portalled overlay, three layers: a click-to-close backdrop, a
 * search-driven panel, and a flat list of rows the panel filters and walks.
 * A heading row is muted and unfocusable; item rows carry an icon, a label,
 * and an optional shortcut; whichever row is "active" gets a soft fill
 * behind it. Rows stagger in on open exactly like the real filtered list
 * repaints — cheapest first, active state last.
 */
const CSS = `
@keyframes cpa-row { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.cpa-row { opacity: 0; animation: cpa-row 360ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.cpa-static .cpa-row { opacity: 1; animation: none; transform: none; }
`;

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--muted-foreground)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "backdrop",
    desc: "click-through scrim, closes on click",
    swatch: "bg-[var(--foreground)]/10",
  },
  {
    name: "panel",
    desc: "role=dialog, max-h-[60vh]",
    swatch: "bg-[var(--card)] ring-1",
  },
  {
    name: "search",
    desc: "autofocused, filters as you type",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "item",
    desc: "icon · label · shortcut",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "active",
    desc: "highlight fill behind the hot row",
    swatch: "bg-[var(--foreground)]/12",
  },
];

export function CommandPaletteAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="backdrop → panel → search → rows">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative w-full rounded-xl border border-fd-border border-dashed bg-[var(--foreground)]/[0.04] p-6 ${reduced ? "cpa-static" : ""}`}
          >
            <div
              className="cpa-row mx-auto w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              {/* search */}
              <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-3">
                <SearchIcon />
                <span className="h-2 w-28 rounded-full bg-[var(--foreground)]/20" />
              </div>

              <div className="p-1.5">
                {/* group heading */}
                <div
                  className="cpa-row px-2.5 pt-1.5 pb-1"
                  style={{ "--d": "90ms" } as CSSProperties}
                >
                  <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/15" />
                </div>
                {/* active item */}
                <div
                  className="cpa-row relative flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
                  style={{ "--d": "160ms" } as CSSProperties}
                >
                  <span className="absolute inset-0 rounded-lg bg-[var(--foreground)]/[0.07]" />
                  <span className="relative size-3.5 shrink-0 rounded-[5px] bg-[var(--foreground)]/30" />
                  <span className="relative h-2 w-20 rounded-full bg-[var(--foreground)]/35" />
                  <span className="relative ml-auto h-4 w-6 rounded-[5px] border border-border" />
                </div>
                {/* item */}
                <div
                  className="cpa-row flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
                  style={{ "--d": "230ms" } as CSSProperties}
                >
                  <span className="size-3.5 shrink-0 rounded-[5px] bg-[var(--foreground)]/20" />
                  <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/25" />
                </div>
                {/* item */}
                <div
                  className="cpa-row flex items-center gap-2.5 rounded-lg px-2.5 py-2.5"
                  style={{ "--d": "300ms" } as CSSProperties}
                >
                  <span className="size-3.5 shrink-0 rounded-[5px] bg-[var(--foreground)]/20" />
                  <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
                </div>
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-5">
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
