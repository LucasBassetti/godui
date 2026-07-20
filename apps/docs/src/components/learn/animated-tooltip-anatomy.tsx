"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three pieces, one `<span>` wrapper: the trigger stays in the DOM at all
 * times, the panel mounts only while `open`, and a rotated 2px square fakes
 * the caret. `side="top"` (the default) stacks them panel → caret → trigger,
 * top to bottom.
 */
const CSS = `
@keyframes ata-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.ata-piece { opacity: 0; animation: ata-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ata-static .ata-piece { opacity: 1; animation: none; transform: none; }
`;

function Bar({ w, tone }: { w: string; tone: string }) {
  return <span className={`h-2 rounded-full ${w} ${tone}`} />;
}

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "trigger",
    desc: "always mounted — hover/focus flips `open`",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "panel",
    desc: "role=tooltip, only in the DOM while open",
    swatch: "bg-[var(--foreground)]",
  },
  {
    name: "caret",
    desc: "2px square rotated 45°, same fill as the panel",
    swatch: "bg-[var(--foreground)]",
  },
];

export function AnimatedTooltipAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one wrapper · panel + caret + trigger">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "ata-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex flex-col items-center">
            {/* panel */}
            <div
              className="ata-piece flex flex-col items-center gap-1.5 rounded-lg bg-[var(--foreground)] px-4 py-2.5"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <Bar w="w-16" tone="bg-[var(--background)]/70" />
              <Bar w="w-10" tone="bg-[var(--background)]/40" />
            </div>
            {/* caret */}
            <span
              className="ata-piece -mt-1.5 size-2.5 rotate-45 bg-[var(--foreground)]"
              style={{ "--d": "110ms" } as CSSProperties}
            />
            {/* gap to trigger, mirrors the panel's calc(100%+0.625rem) offset */}
            <div className="h-3" />
            {/* trigger */}
            <div
              className="ata-piece flex size-12 items-center justify-center rounded-full border border-border bg-[var(--muted)]"
              style={{ "--d": "180ms" } as CSSProperties}
            >
              <span className="size-4 rounded-full bg-[var(--foreground)]/30" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
