"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The stack is three plain absolutely-positioned cards, not a list with
 * gaps. Collapsed, each toast at `index` sits at `y = dir * index * PEEK`
 * (`PEEK = 16`) with `scale = 1 - index * SCALE_STEP` (`SCALE_STEP = 0.05`),
 * anchored to the bottom edge — so only a sliver of each card behind the
 * front one peeks out above it. Anything past `MAX_VISIBLE = 3` sits at
 * `opacity: 0`, ready to be promoted the instant the front toast dismisses.
 */
const CSS = `
@keyframes ta-card { from { opacity: 0; transform: translateY(10px) scale(var(--s)); } to { opacity: 1; transform: translateY(var(--ty)) scale(var(--s)); } }
.ta-card { opacity: 0; animation: ta-card 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ta-static .ta-card { opacity: 1; animation: none; transform: translateY(var(--ty)) scale(var(--s)); }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Front",
    desc: "index 0 · y 0 · scale 1",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "Peek 1",
    desc: "index 1 · y −16 · scale 0.95",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Peek 2",
    desc: "index 2 · y −32 · scale 0.90",
    swatch: "bg-[var(--foreground)]/15",
  },
];

export function ToastAnatomy() {
  return (
    <ScrollScene
      label="Anatomy"
      note="PEEK 16 · SCALE_STEP 0.05 · MAX_VISIBLE 3"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "ta-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[168px] w-72 items-end justify-center">
            <div
              className="ta-card absolute inset-x-2 bottom-0 h-[76px] origin-bottom rounded-xl border border-border bg-[var(--foreground)]/10"
              style={
                { "--ty": "-32px", "--s": "0.9", "--d": "0ms" } as CSSProperties
              }
            />
            <div
              className="ta-card absolute inset-x-1 bottom-0 h-[76px] origin-bottom rounded-xl border border-border bg-[var(--foreground)]/15"
              style={
                {
                  "--ty": "-16px",
                  "--s": "0.95",
                  "--d": "90ms",
                } as CSSProperties
              }
            />
            <div
              className="ta-card absolute inset-x-0 bottom-0 flex h-[76px] w-full origin-bottom flex-col gap-1.5 rounded-xl border border-border bg-[var(--card)] p-3 shadow-lg"
              style={
                { "--ty": "0px", "--s": "1", "--d": "180ms" } as CSSProperties
              }
            >
              <span className="h-2 w-2/5 rounded-full bg-[var(--foreground)]/35" />
              <span className="h-2 w-3/5 rounded-full bg-[var(--foreground)]/20" />
              <span className="mt-auto h-4 w-14 self-end rounded-md bg-[var(--muted)]" />
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
