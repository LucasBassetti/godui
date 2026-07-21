"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The overlap isn't absolute positioning or manual negative margin — it's
 * Tailwind's `-space-x-2` on a plain flex row, so every avatar but the
 * first pulls 8px into its neighbor and later avatars paint on top purely
 * from DOM order. A status indicator sits at each avatar's bottom-right
 * corner, and the `+N` chip is just one more flex child sharing the same
 * `-space-x-2` and `ring-2 ring-background` treatment.
 */
const COUNT = 4;

const CSS = `
@keyframes pfa-avatar { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: none; } }
.pfa-avatar { opacity: 0; animation: pfa-avatar 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pfa-static .pfa-avatar { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Avatar",
    desc: 'flex row, "-space-x-2" — DOM order, no z-index',
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Status dot",
    desc: "ring-2 ring-background, bottom-right corner",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "+N chip",
    desc: "same row, same -space-x-2, opens on click",
    swatch: "bg-[var(--foreground)]/30",
  },
];

export function PresenceFacepileAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="flex row · -space-x-2 overlap">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${
            reduced ? "pfa-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex items-center -space-x-2">
            {Array.from({ length: COUNT }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed avatar row
                key={i}
                className="pfa-avatar relative inline-block size-11 shrink-0"
                style={{ "--d": `${i * 80}ms` } as CSSProperties}
              >
                <span className="flex size-full items-center justify-center rounded-full bg-[var(--muted)] ring-2 ring-background" />
                <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[var(--foreground)]/50 ring-2 ring-background" />
              </span>
            ))}
            <span
              className="pfa-avatar relative flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]/30 ring-2 ring-background"
              style={{ "--d": `${COUNT * 80}ms` } as CSSProperties}
            >
              <span className="h-1.5 w-4 rounded-full bg-[var(--background)]/70" />
            </span>
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
