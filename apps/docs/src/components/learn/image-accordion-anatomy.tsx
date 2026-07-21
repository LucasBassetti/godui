"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One panel, two states, side by side: idle (desaturated image + compact
 * vertical label) and active (full-color image + sliding caption). Every
 * property that changes lives on the panel itself — no wrapper state.
 */
const CSS = `
@keyframes iaa-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.iaa-col { opacity: 0; animation: iaa-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both; }
.iaa-static .iaa-col { opacity: 1; animation: none; transform: none; }
`;

function Panel({ active }: { active: boolean }) {
  return (
    <div className="relative h-44 w-28 overflow-hidden rounded-2xl border border-white/10">
      {/* Image layer — filter only, no width/flex-grow in this diagram. */}
      <div
        className={`absolute inset-0 [transition:filter_700ms_ease] ${
          active
            ? "bg-[var(--foreground)]/45 saturate-100 brightness-100"
            : "bg-[var(--foreground)]/25 saturate-[0.4] brightness-75"
        }`}
      />
      {/* Scrim — always present, for caption legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Idle: compact vertical label */}
      <span
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 [writing-mode:vertical-rl] rotate-180 [transition:opacity_300ms_ease] ${
          active ? "opacity-0" : "opacity-80"
        }`}
      >
        <span className="block h-1.5 w-8 rounded-full bg-white/80" />
      </span>

      {/* Active: caption block, underline sweeps in on a slight delay */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 [transition:opacity_400ms_ease,transform_500ms_ease] ${
          active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span
          className={`block h-px w-6 origin-left bg-white/70 [transition:transform_500ms_ease_120ms] ${
            active ? "scale-x-100" : "scale-x-0"
          }`}
        />
        <span className="block h-2 w-16 rounded-full bg-white" />
        <span className="block h-1.5 w-12 rounded-full bg-white/60" />
      </div>
    </div>
  );
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Image",
    desc: "saturate + brightness, 550ms ease",
    swatch: "bg-[var(--foreground)]/35",
  },
  {
    name: "Scrim",
    desc: "static gradient, keeps text legible",
    swatch: "bg-black/60",
  },
  {
    name: "Label ↔ caption",
    desc: "opacity + translateY swap, 400/500ms",
    swatch: "bg-white/80",
  },
];

export function ImageAccordionAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one panel, idle vs. active">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex items-end justify-center gap-10 ${reduced ? "iaa-static" : ""}`}
          >
            <div
              className="iaa-col flex flex-col items-center gap-3"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <Panel active={false} />
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                idle
              </p>
            </div>
            <div
              className="iaa-col flex flex-col items-center gap-3"
              style={{ "--d": "140ms" } as CSSProperties}
            >
              <Panel active />
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                active
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
