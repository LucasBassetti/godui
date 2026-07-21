"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three rows, one border, `divide-y` between them — the whole list is a
 * single `rounded-xl border` div, not per-item cards. Row 2 is open: its
 * `AnimatePresence` panel is mounted below the trigger, and the chevron on
 * that row alone carries `group-data-[open=true]:rotate-180`.
 */
const CSS = `
@keyframes aa-row { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.aa-row { opacity: 0; animation: aa-row 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.aa-static .aa-row { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Trigger",
    desc: "button, aria-expanded + aria-controls",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Chevron",
    desc: "group-data-[open=true]:rotate-180, 250ms ease",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Panel",
    desc: "role=region, mounted only while open",
    swatch: "bg-[var(--foreground)]/30",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 text-[var(--foreground)]/50 [transition:transform_250ms_ease] ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function AccordionAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one border · three rows · one open">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[400px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`w-full divide-y divide-border overflow-hidden rounded-xl border border-border ${
              reduced ? "aa-static" : ""
            }`}
          >
            {[false, true, false].map((open, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed three-row layout
                key={i}
                className="aa-row flex flex-col"
                style={{ "--d": `${i * 90}ms` } as CSSProperties}
              >
                <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <span
                    className="h-2 rounded-full bg-[var(--muted)]"
                    style={{ width: `${34 + i * 8}%` }}
                  />
                  <Chevron open={open} />
                </div>
                {open ? (
                  <div className="px-4 pb-3.5">
                    <span className="block h-2 w-[70%] rounded-full bg-[var(--foreground)]/30" />
                    <span className="mt-1.5 block h-2 w-[48%] rounded-full bg-[var(--foreground)]/20" />
                  </div>
                ) : null}
              </div>
            ))}
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
