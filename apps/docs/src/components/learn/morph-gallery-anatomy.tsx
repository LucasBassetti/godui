"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three pieces, and the middle one is really one identity rendered twice: a
 * grid tile carries `layoutId={uid-i}` on its `motion.img`; the detail view
 * carries the *same* `layoutId` on its own `motion.img`. Framer measures both
 * boxes and bridges them — there's no separate "open" animation, just one
 * element whose box moves. Nav (prev / next / close) is unrelated markup that
 * fades in on its own once the dialog mounts.
 */
const CSS = `
@keyframes mga-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.mga-el { opacity: 0; animation: mga-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.mga-static .mga-el { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Tile",
    desc: "grid button, layoutId starts here",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "layoutId",
    desc: "one id, measured on both ends",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Detail",
    desc: 'role="dialog", same image element',
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Nav",
    desc: "prev / next / close, fade in on their own",
    swatch: "bg-[var(--foreground)]/25",
  },
];

export function MorphGalleryAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one layoutId, two measured boxes">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[560px] flex-col items-center gap-8 ${reduced ? "mga-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full items-center justify-center gap-4">
            {/* Grid tiles */}
            <div
              className="mga-el grid shrink-0 grid-cols-2 gap-1.5"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="size-11 rounded-md bg-[var(--muted)]" />
              <div className="size-11 rounded-md bg-[var(--foreground)]/40 ring-2 ring-[var(--foreground)]/60" />
              <div className="size-11 rounded-md bg-[var(--muted)]" />
              <div className="size-11 rounded-md bg-[var(--muted)]" />
            </div>

            {/* layoutId connector */}
            <div
              className="mga-el flex flex-col items-center gap-1 text-[var(--foreground)]/50"
              style={{ "--d": "140ms" } as CSSProperties}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="14"
                viewBox="0 0 28 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="3 3"
                aria-hidden="true"
              >
                <path d="M1 7h26M20 1l6 6-6 6" />
              </svg>
            </div>

            {/* Detail view */}
            <div
              className="mga-el relative h-32 w-52 shrink-0 rounded-2xl border border-border bg-[var(--muted)] shadow-lg"
              style={{ "--d": "260ms" } as CSSProperties}
            >
              <span className="mga-el absolute -top-2 -right-2 size-7 rounded-full bg-[var(--card)] shadow-sm ring-1 ring-[var(--foreground)]/10" />
              <span className="mga-el absolute top-1/2 -left-3 size-7 -translate-y-1/2 rounded-full bg-[var(--card)] shadow-sm ring-1 ring-[var(--foreground)]/10" />
              <span className="mga-el absolute top-1/2 -right-3 size-7 -translate-y-1/2 rounded-full bg-[var(--card)] shadow-sm ring-1 ring-[var(--foreground)]/10" />
              <div className="mga-el absolute inset-x-3 bottom-3 flex flex-col gap-1">
                <span className="h-1.5 w-16 rounded-full bg-[var(--foreground)]/30" />
                <span className="h-1 w-10 rounded-full bg-[var(--foreground)]/20" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-4">
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
