"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One root, one panel. `DropdownMenu` maps a flat `items` array into four row
 * kinds — `label`, `item` (icon · text · shortcut), `separator`, and a `submenu`
 * row carrying a chevron. The panel is a single `absolute` element positioned
 * off the trigger; the rows are just its children. This scene enumerates the
 * four kinds as they reveal.
 */
const Chevron = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="ml-auto size-4 text-[var(--foreground)]/40"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CSS = `
@keyframes dma-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
.dma-row { opacity: 0; animation: dma-in 380ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.dma-static .dma-row { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "label",
    desc: "muted, non-interactive heading",
    swatch: "bg-[var(--foreground)]/15",
  },
  {
    name: "item",
    desc: "icon · text · shortcut",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "separator",
    desc: "a hairline <hr> between groups",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "submenu",
    desc: "an item with a chevron + nested list",
    swatch: "bg-[var(--muted)]",
  },
];

export function DropdownMenuAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one array, four row kinds">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex flex-col items-end gap-2 ${reduced ? "dma-static" : ""}`}
          >
            {/* Trigger — the menu hangs off its edge (align="end"). */}
            <div className="flex h-9 w-32 items-center justify-end rounded-full border border-border bg-[var(--muted)] px-3">
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
            </div>

            <div className="w-60 rounded-xl border border-border bg-[var(--background)] p-1 shadow-lg">
              {/* label */}
              <div
                className="dma-row px-2.5 pt-2 pb-1"
                style={{ "--d": "60ms" } as CSSProperties}
              >
                <span className="block h-1.5 w-24 rounded-full bg-[var(--foreground)]/20" />
              </div>
              {/* item — icon · text · shortcut */}
              <div
                className="dma-row flex h-9 items-center gap-2.5 rounded-lg px-2.5"
                style={{ "--d": "120ms" } as CSSProperties}
              >
                <span className="size-4 shrink-0 rounded bg-[var(--foreground)]/25" />
                <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/35" />
                <span className="ml-auto h-2 w-6 rounded-full bg-[var(--foreground)]/20" />
              </div>
              {/* item */}
              <div
                className="dma-row flex h-9 items-center gap-2.5 rounded-lg px-2.5"
                style={{ "--d": "175ms" } as CSSProperties}
              >
                <span className="size-4 shrink-0 rounded bg-[var(--foreground)]/25" />
                <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/35" />
              </div>
              {/* separator */}
              <hr
                className="dma-row my-1 border-border border-t-0 border-b"
                style={{ "--d": "230ms" } as CSSProperties}
              />
              {/* submenu row — chevron trailing */}
              <div
                className="dma-row flex h-9 items-center gap-2.5 rounded-lg px-2.5"
                style={{ "--d": "285ms" } as CSSProperties}
              >
                <span className="size-4 shrink-0 rounded bg-[var(--foreground)]/25" />
                <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/35" />
                {Chevron}
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-4 gap-3 border-fd-border border-t pt-5">
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
