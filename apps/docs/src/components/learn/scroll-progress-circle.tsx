"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Circle variant: `strokeDashoffset = circumference * (1 − progress)`,
 * revealed past `showAfter` via AnimatePresence spring enter/exit, and a
 * click scrolls the container (or window) back to top.
 */

const SIZE = 56;
const R = (SIZE - 6) / 2;
const CIRC = 2 * Math.PI * R;

const CSS = `
@keyframes spc-enter {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes spc-fill {
  from { stroke-dashoffset: ${CIRC}; }
  to   { stroke-dashoffset: ${CIRC * 0.25}; }
}
.spc-btn  { animation: spc-enter 600ms cubic-bezier(0.3,0.7,0.4,1.2) 400ms both; }
.spc-arc  { animation: spc-fill 2.2s cubic-bezier(0.3,0.7,0.4,1) 700ms both; }
.spc-static .spc-btn { animation: none; opacity: 1; transform: none; }
.spc-static .spc-arc { animation: none; stroke-dashoffset: ${CIRC * 0.25}; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "bar" | "track" | "pin";
}[] = [
  {
    name: "Ring",
    desc: "strokeDashoffset from progress",
    kind: "bar",
  },
  {
    name: "showAfter",
    desc: "visible when raw progress > threshold",
    kind: "track",
  },
  {
    name: "Enter",
    desc: "AnimatePresence spring 520/32",
    kind: "pin",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "bar") {
    return (
      <span className="h-1 w-8 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "track") {
    return (
      <span className="h-1 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3 rounded-full border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function ScrollProgressCircle() {
  return (
    <ScrollScene
      label="Circle variant"
      note="dashoffset · showAfter · back-to-top"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "spc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-36 w-full items-end justify-end rounded-xl border border-fd-border bg-[var(--card)] p-5">
            <div className="absolute inset-x-5 top-5 flex flex-col gap-2">
              <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/25" />
              <span className="h-2 w-full rounded-full bg-[var(--muted)]" />
              <span className="h-2 w-[70%] rounded-full bg-[var(--muted)]" />
            </div>

            <div
              className="spc-btn relative grid place-items-center rounded-full border border-fd-border bg-[var(--card)] shadow-md"
              style={{ width: SIZE, height: SIZE } as CSSProperties}
            >
              <svg
                aria-hidden="true"
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 -rotate-90"
              >
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeOpacity={0.15}
                  strokeWidth={3}
                />
                <circle
                  className="spc-arc"
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="var(--foreground)"
                  strokeOpacity={0.7}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC}
                />
              </svg>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--foreground)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 opacity-60"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
