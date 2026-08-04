"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The column wave: each flap starts its flip a little after the one to its left
 * (`startDelay = index × stagger`), so the board resolves left-to-right rather
 * than snapping all at once. Here each column drops its covering top leaf on a
 * staggered delay, uncovering the settled glyph beneath.
 */
const COLS = 7;
const STAGGER = 90; // ms — mirrors the `stagger` prop (0.06s default)

const CSS = `
@keyframes sfw-fall { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
@keyframes sfw-mark { from { opacity: 0; } to { opacity: 1; } }
.sfw-fall { animation: sfw-fall 340ms cubic-bezier(0.3,0.7,0.4,1) var(--d) both; }
.sfw-mark { opacity: 0; animation: sfw-mark 220ms linear var(--d) forwards; }
.sfw-static .sfw-fall { animation: none; transform: rotateX(-90deg); }
.sfw-static .sfw-mark { animation: none; opacity: 1; }
`;

function Flap({ delay }: { delay: number }) {
  return (
    <div
      className="relative h-16 w-9 [perspective:340px]"
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {/* Settled flap underneath: a foreground surface with the glyph stand-in. */}
      <div className="absolute inset-0 overflow-hidden rounded-md bg-[var(--foreground)]">
        <div className="sfw-mark absolute inset-0 flex items-center justify-center">
          <span className="h-1.5 w-4 rounded-full bg-[var(--background)]/50" />
        </div>
      </div>
      {/* Covering top leaf that hinges away on this column's delay. */}
      <div className="sfw-fall absolute inset-x-0 top-0 h-1/2 origin-bottom overflow-hidden rounded-t-md border-[var(--background)]/20 border-b bg-[var(--foreground)] [backface-visibility:hidden]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--background)]/30" />
    </div>
  );
}

const LEGEND: { name: string; desc: string; kind: "wave" | "flap" }[] = [
  { name: "Stagger", desc: "column n starts n × 0.06s later", kind: "wave" },
  {
    name: "Settled flap",
    desc: "the value revealed beneath the leaf",
    kind: "flap",
  },
];

function Swatch({ kind }: { kind: "wave" | "flap" }) {
  if (kind === "flap") {
    return (
      <span className="block h-4 w-6 rounded-[3px] bg-[var(--foreground)]/80" />
    );
  }
  return (
    <span className="flex h-4 items-end gap-1">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-1.5 rounded-[1px] bg-[var(--foreground)]/50"
          style={{ height: `${6 + i * 3}px` }}
        />
      ))}
    </span>
  );
}

export function SplitFlapWave() {
  return (
    <ScrollScene
      label="The wave"
      note="each column starts index × stagger later"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "sfw-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex gap-1.5">
            {Array.from({ length: COLS }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional slots
              <Flap key={i} delay={i * STAGGER} />
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <Swatch kind={item.kind} />
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
