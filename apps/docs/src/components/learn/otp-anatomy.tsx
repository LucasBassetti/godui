"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The trick behind OTP Input: the cells you see aren't inputs. There's exactly
 * one real `<input>` — sized to zero, fully transparent — layered over the row.
 * Every keystroke and paste lands there; the cells are pure display driven by
 * `value[i]`. Clicking anywhere in the row focuses that one field.
 */
const CELLS = 6;

const CSS = `
@keyframes oa-cell {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
@keyframes oa-ghost {
  0%, 40%   { opacity: 0; }
  70%, 100% { opacity: 1; }
}
.oa-cell  { opacity: 0; animation: oa-cell 420ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.oa-ghost { opacity: 0; animation: oa-ghost 1400ms ease both; }
.oa-static .oa-cell  { opacity: 1; animation: none; transform: none; }
.oa-static .oa-ghost { opacity: 1; animation: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "cells" | "input";
}[] = [
  {
    name: "Display cells",
    desc: "what you see — driven by value[i]",
    kind: "cells",
  },
  {
    name: "Hidden input",
    desc: "one size-0 field catches every key",
    kind: "input",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "cells") {
    return (
      <span className="size-3 rounded-md border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3 rounded-md border-2 border-[var(--foreground)]/40 border-dashed bg-[var(--foreground)]/[0.06] ring-1 ring-fd-border ring-inset" />
  );
}

export function OtpAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="cells you see · one input you don't">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div key={cycle} className={`relative ${reduced ? "oa-static" : ""}`}>
            <div className="flex items-center gap-2">
              {Array.from({ length: CELLS }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length cell grid
                  key={i}
                  className="oa-cell flex size-12 items-center justify-center rounded-lg border border-border bg-[var(--card)]"
                  style={{ "--d": `${i * 70}ms` } as CSSProperties}
                />
              ))}
            </div>
            {/* Ghost input — the invisible real field, drawn dashed so you can
                see the thing that's actually receiving the keystrokes. */}
            <div className="oa-ghost pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border-2 border-[var(--foreground)]/40 border-dashed bg-[var(--foreground)]/[0.06]" />
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
