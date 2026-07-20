"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * There are only two pieces, and they're the same element: a trigger card and
 * a content panel share one Framer Motion `layoutId`. Framer measures both
 * boxes and interpolates every frame between them — no separate "morph"
 * animation, just one identity rendered twice. The two states stagger in here
 * to read left-to-right; the real component never shows both at once.
 */
const CSS = `
@keyframes mda-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.mda-el { opacity: 0; animation: mda-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.mda-static .mda-el { opacity: 1; animation: none; transform: none; }
`;

function Bar({
  w,
  tone = "bg-[var(--foreground)]/30",
}: {
  w: string;
  tone?: string;
}) {
  return <span className={`h-2 rounded-full ${w} ${tone}`} />;
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Trigger",
    desc: "layoutId on a small card",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "layoutId",
    desc: "same id, measured on both ends",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Content",
    desc: "layoutId on the modal panel",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "Close",
    desc: "fades in, not part of the morph",
    swatch: "bg-[var(--foreground)]/25",
  },
];

export function MorphingDialogAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one layoutId, two measured boxes">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[520px] flex-col items-center gap-8 ${reduced ? "mda-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full items-center justify-center gap-4">
            {/* Trigger card */}
            <div
              className="mda-el flex w-28 shrink-0 flex-col gap-2 rounded-xl border border-border bg-[var(--card)] p-2.5 shadow-sm"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="h-10 w-full rounded-lg bg-[var(--muted)]" />
              <Bar w="w-full" />
              <Bar w="w-2/3" tone="bg-[var(--foreground)]/20" />
            </div>

            {/* layoutId connector */}
            <div
              className="mda-el flex flex-col items-center gap-1 text-[var(--foreground)]/50"
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

            {/* Content panel */}
            <div
              className="mda-el relative flex w-44 shrink-0 flex-col gap-2.5 rounded-2xl border border-border bg-[var(--card)] p-3 shadow-lg"
              style={{ "--d": "260ms" } as CSSProperties}
            >
              <span className="mda-el absolute top-2 right-2 size-4 rounded-full bg-[var(--foreground)]/20" />
              <div className="h-16 w-full rounded-xl bg-[var(--muted)]" />
              <Bar w="w-4/5" />
              <Bar w="w-full" tone="bg-[var(--foreground)]/20" />
              <Bar w="w-3/5" tone="bg-[var(--foreground)]/20" />
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
