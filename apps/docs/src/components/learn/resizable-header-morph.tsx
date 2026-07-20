"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The signature move: as `scrollY` crosses `scrollThreshold` the nav flips from a
 * wide rounded bar to a compact floating pill. Here a scroll thumb travels down a
 * rail past a threshold tick, and the bar collapses the instant it passes — the
 * real component drives this from `useMotionValueEvent(scrollY, "change", …)`.
 * The size change is faked with transform only (scaleX/scaleY/translateY), the
 * same way framer's `layout` prop FLIPs it — never animated width/height.
 */
const CSS = `
@keyframes rhm-scroll {
  0%, 14%  { transform: translateY(0); }
  46%, 66% { transform: translateY(60px); }
  100%     { transform: translateY(0); }
}
@keyframes rhm-bar {
  0%, 20%  { transform: translateY(0) scaleX(1) scaleY(1); }
  46%, 66% { transform: translateY(-4px) scaleX(0.66) scaleY(0.82); }
  92%, 100%{ transform: translateY(0) scaleX(1) scaleY(1); }
}
.rhm-scroll { animation: rhm-scroll 4.4s cubic-bezier(0.4,0,0.2,1) infinite; }
.rhm-bar    { animation: rhm-bar 4.4s cubic-bezier(0.34,1.4,0.64,1) infinite; transform-origin: top center; }
.rhm-static .rhm-scroll { animation: none; transform: translateY(60px); }
.rhm-static .rhm-bar    { animation: none; transform: scaleX(0.66) scaleY(0.82); transform-origin: top center; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Expanded",
    desc: "max-w-5xl · rounded-2xl · scrollY ≤ threshold",
    swatch: "bg-[var(--card)]",
  },
  {
    name: "Collapsed",
    desc: "max-w-2xl · rounded-full pill · past threshold",
    swatch: "bg-[var(--foreground)]/25",
  },
];

export function ResizableHeaderMorph() {
  return (
    <ScrollScene label="Scroll morph" note="wide bar → floating pill">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex w-full items-start gap-6 ${reduced ? "rhm-static" : ""}`}
          >
            {/* Scroll rail: a thumb travels down past the threshold tick. */}
            <div className="relative mt-1 h-[88px] w-1.5 shrink-0 rounded-full bg-[var(--foreground)]/10">
              <div className="absolute inset-x-[-5px] top-[18px] h-px bg-[var(--foreground)]/40" />
              <div className="rhm-scroll absolute inset-x-0 top-0 h-6 rounded-full bg-[var(--foreground)]/40" />
            </div>

            {/* Header surface — logo, nav bars, CTA — scaled by transform. */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="rhm-bar flex items-center justify-between gap-4 rounded-full border border-border bg-[var(--card)] px-4 py-3 shadow-sm">
                <span className="size-5 shrink-0 rounded-full bg-[var(--foreground)]/45" />
                <div className="flex items-center gap-3">
                  <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
                  <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
                  <span className="h-2 w-10 rounded-full bg-[var(--foreground)]/30" />
                </div>
                <span className="h-6 w-16 shrink-0 rounded-full bg-[var(--foreground)]/25" />
              </div>
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
