"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Each action is `whileHover={{ y: -2, scale: 1.08 }}` and
 * `whileTap={{ scale: 0.94 }}`, both on the same 520/32 spring as the shell
 * — so a hovered button lifts off the row while its neighbors stay put,
 * `layout` reflowing anyone that needs to make room. Looped on the second
 * action here: idle → lift → press → settle.
 */
const CSS = `
@keyframes ftm-lift {
  0%, 16%, 100% { transform: translateY(0) scale(1); }
  42%           { transform: translateY(-2px) scale(1.08); }
  58%           { transform: translateY(0) scale(0.94); }
  74%           { transform: translateY(0) scale(1); }
}
.ftm-hovered { animation: ftm-lift 3s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.ftm-static .ftm-hovered { animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "idle" | "hover" | "press";
}[] = [
  {
    name: "idle",
    desc: "resting scale, no transform",
    kind: "idle",
  },
  {
    name: "hover",
    desc: "y: -2, scale: 1.08",
    kind: "hover",
  },
  {
    name: "press",
    desc: "whileTap scale: 0.94",
    kind: "press",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "hover") {
    return (
      <span className="size-3.5 translate-y-[-1px] scale-110 rounded-lg bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "press") {
    return (
      <span className="size-3.5 scale-95 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3.5 rounded-lg bg-[var(--foreground)]/12 ring-1 ring-fd-border ring-inset" />
  );
}

export function FloatingToolbarMagnetic() {
  return (
    <ScrollScene label="Per-action spring" note="hover lifts · tap dips">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "ftm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="inline-flex items-end gap-1 rounded-xl border border-border bg-[var(--muted)]/90 p-1 shadow-lg backdrop-blur-md"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length action row
                key={i}
                className={`size-9 rounded-lg bg-[var(--foreground)]/12 ${i === 1 ? "ftm-hovered" : ""}`}
                style={
                  i === 1
                    ? ({ transformOrigin: "center bottom" } as CSSProperties)
                    : undefined
                }
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            whileHover={"{"} y: -2, scale: 1.08 {"}"} · whileTap={"{"} scale:
            0.94 {"}"}
          </p>

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
