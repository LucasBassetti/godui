"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The structural trick behind Dock: there is exactly one pointer signal. `Dock`
 * holds a single `mouseX` MotionValue, updated on every `mousemove`; each
 * `DockItem` subscribes to that one bus and derives its own distance from it.
 * No per-item listeners, no shared state to keep in sync — one source, N
 * readers.
 */
const CELLS = 6;

const CSS = `
@keyframes da-rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
@keyframes da-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes da-grow { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
.da-item { opacity: 0; animation: da-rise 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.da-line { opacity: 0; transform-origin: top; animation: da-grow 360ms ease var(--d) both; }
.da-bus  { opacity: 0; animation: da-fade 420ms ease 120ms both; }
.da-ptr  { opacity: 0; animation: da-fade 400ms ease 520ms both; }
.da-static .da-item,
.da-static .da-line,
.da-static .da-bus,
.da-static .da-ptr { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Pointer signal",
    desc: "one mouseX MotionValue, set on every mousemove",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Dock items",
    desc: "each reads its own distance off that one value",
    swatch: "bg-[var(--muted)]",
  },
];

export function DockAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one signal · many listeners">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-[324px] flex-col items-center ${reduced ? "da-static" : ""}`}
          >
            {/* Pointer marker riding the shared signal bus. */}
            <div className="da-ptr mb-1 text-[var(--foreground)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51z" />
              </svg>
            </div>

            {/* The single signal bus every item subscribes to. */}
            <div className="da-bus h-1 w-full rounded-full bg-[var(--foreground)]/30" />

            {/* Drop lines + resting items. */}
            <div className="flex w-full items-start justify-between">
              {Array.from({ length: CELLS }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length item row
                  key={i}
                  className="flex flex-col items-center gap-2"
                >
                  <span
                    className="da-line h-6 w-px bg-[var(--foreground)]/25"
                    style={{ "--d": `${180 + i * 60}ms` } as CSSProperties}
                  />
                  <span
                    className="da-item size-11 rounded-xl border border-border bg-[var(--muted)] shadow-sm"
                    style={{ "--d": `${260 + i * 60}ms` } as CSSProperties}
                  />
                </div>
              ))}
            </div>
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
