"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Looping scramble → resolve across abstract mono slots. Unresolved cells
 * flicker opacity/filter in primary; resolved settle to muted bars. No
 * readable letters — ░ glyphs and thin bars only.
 */

const SLOT_COUNT = 7;

const CSS = `
@keyframes tsc-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tsc-panel {
  opacity: 0;
  animation: tsc-in 520ms cubic-bezier(0.3, 0.7, 0.4, 1.2) both;
}
.tsc-static .tsc-panel { opacity: 1; animation: none; transform: none; }

@keyframes tsc-flicker {
  0%, 12%   { opacity: 0.35; filter: blur(0.6px); color: var(--primary); }
  18%       { opacity: 1;    filter: blur(0);    color: var(--primary); }
  28%       { opacity: 0.45; filter: blur(0.4px); color: var(--primary); }
  38%       { opacity: 0.9;  filter: blur(0);    color: var(--primary); }
  48%, 58%  { opacity: 1;    filter: blur(0);    color: var(--foreground); }
  72%, 100% { opacity: 1;    filter: blur(0);    color: var(--foreground); }
}
.tsc-slot {
  animation: tsc-flicker 2.8s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
  animation-delay: var(--sd);
}
.tsc-static .tsc-slot {
  animation: none;
  opacity: 1;
  filter: none;
  color: var(--foreground);
}
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "unresolved" | "resolved";
}[] = [
  {
    name: "Unresolved",
    desc: "random pool glyph + text-primary, 120ms color",
    kind: "unresolved",
  },
  {
    name: "Resolved",
    desc: "locked `to` — inherits foreground",
    kind: "resolved",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "unresolved") {
    return (
      <span className="inline-flex w-[1.1ch] justify-center font-mono text-sm text-primary">
        ░
      </span>
    );
  }
  return (
    <span className="inline-flex w-[1.1ch] justify-center font-mono text-sm text-[var(--foreground)]">
      ░
    </span>
  );
}

export function TextScrambleCycle() {
  return (
    <ScrollScene label="Cycle" note="scramble → resolve, staggered">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-4 ${reduced ? "tsc-static" : ""}`}
          >
            <div className="tsc-panel flex h-[100px] w-full max-w-[360px] items-center justify-center rounded-xl border border-fd-border bg-[var(--card)]">
              <div
                className="flex items-center gap-1 font-mono text-2xl tracking-[0.2em] tabular-nums"
                aria-hidden="true"
              >
                {Array.from({ length: SLOT_COUNT }, (_, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed slot positions
                    key={i}
                    className="tsc-slot inline-block w-[1.1ch] text-center"
                    style={{ "--sd": `${i * 140}ms` } as CSSProperties}
                  >
                    ░
                  </span>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] text-fd-muted-foreground">
              spread stagger · pool flicker
            </p>
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
