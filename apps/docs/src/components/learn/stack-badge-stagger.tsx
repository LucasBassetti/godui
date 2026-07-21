"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Two independent timelines share one chip. `whileInView` fires once — a
 * `delay: index * 0.04` stagger on a `{ stiffness: 320, damping: 32, mass:
 * 0.9 }` spring — and never replays. The hover lift (`y: -3` on `{
 * stiffness: 520, damping: 32 }`) and glow (`opacity`, 240ms) are live,
 * pointer-driven state; looped here as a wave sweeping the row so the same
 * transform plays without a cursor.
 */
const COUNT = 5;
const WAVE_S = 3.2;

const CSS = `
@keyframes sbst-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sbst-wave {
  0%, 100% { transform: translateY(0); }
  8% { transform: translateY(-3px); }
  16% { transform: translateY(0); }
}
@keyframes sbst-glow {
  0%, 100% { opacity: 0; }
  8%, 12% { opacity: 1; }
  16% { opacity: 0; }
}
.sbst-chip {
  opacity: 0;
  animation: sbst-in 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both,
    sbst-wave ${WAVE_S}s cubic-bezier(0.3,0.7,0.4,1) var(--wd) infinite;
}
.sbst-glow { animation: sbst-glow ${WAVE_S}s cubic-bezier(0.3,0.7,0.4,1) var(--wd) infinite; }
.sbst-static .sbst-chip { opacity: 1; animation: none; transform: none; }
.sbst-static .sbst-glow { animation: none; opacity: 0; }
`;

function chipStyle(index: number): CSSProperties {
  return {
    "--d": `${index * 40}ms`,
    "--wd": `${(index * WAVE_S) / COUNT}s`,
  } as CSSProperties;
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "stagger" | "glow";
}[] = [
  {
    name: "Stagger in",
    desc: "delay index × 40ms · spring 320/32/0.9",
    kind: "stagger",
  },
  {
    name: "Hover glow",
    desc: "y −3px snappy 520/32 · glow 240ms",
    kind: "glow",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "glow") {
    return (
      <span className="relative inline-flex h-3.5 w-8 items-center gap-1 rounded-full border border-transparent bg-[var(--muted)] px-1.5 shadow-[0_4px_10px_-6px_var(--foreground)] ring-1 ring-fd-border ring-inset">
        <span className="size-1.5 shrink-0 rounded-[3px] bg-[var(--foreground)]/50" />
        <span className="h-1 w-3 rounded-full bg-[var(--foreground)]/25" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-3.5 w-8 items-center gap-1 rounded-full border border-transparent bg-[var(--muted)] px-1.5 ring-1 ring-fd-border ring-inset">
      <span className="size-1.5 shrink-0 rounded-[3px] bg-[var(--foreground)]/50" />
      <span className="h-1 w-3 rounded-full bg-[var(--foreground)]/25" />
    </span>
  );
}

export function StackBadgeStagger() {
  return (
    <ScrollScene label="The motion" note="enter once · hover loops forever">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex flex-wrap items-center justify-center gap-2.5 ${reduced ? "sbst-static" : ""}`}
          >
            {Array.from({ length: COUNT }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed chip row
                key={i}
                className="sbst-chip relative inline-flex items-center gap-2 rounded-full border border-transparent bg-[var(--muted)] px-3 py-2"
                style={chipStyle(i)}
              >
                <span
                  aria-hidden
                  className="sbst-glow pointer-events-none absolute inset-0 rounded-full shadow-[0_10px_24px_-14px_var(--foreground)]"
                />
                <span className="relative size-[18px] shrink-0 rounded-[5px] bg-[var(--foreground)]/50" />
                <span className="relative h-2 w-10 rounded-full bg-[var(--foreground)]/25" />
              </span>
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
