"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Parent-owned pointer chase — themed tokens only.
 */
const CSS = `
@keyframes lglp-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lglp-chase {
  0%, 100% { transform: translate(24%, 28%); }
  40% { transform: translate(68%, 42%); }
  70% { transform: translate(48%, 62%); }
}
.lglp-el { animation: lglp-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lglp-lens {
  animation: lglp-chase 3.8s cubic-bezier(0.3,0.7,0.4,1) infinite;
}
.lglp-static .lglp-el { animation: none; opacity: 1; transform: none; }
.lglp-static .lglp-lens { animation: none; transform: translate(40%, 35%); }
`;

const LEGEND = [
  {
    name: "Parent events",
    desc: "pointermove / enter / leave",
    kind: "parent" as const,
  },
  {
    name: "Centering",
    desc: "translate(calc(var(--lg-px) - 50%), …)",
    kind: "lens" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "lens") {
    return (
      <span
        className="size-4 rounded-full border border-fd-border bg-[var(--muted)]/70 shadow-sm ring-1 ring-fd-border ring-inset backdrop-blur-[2px]"
        style={{
          boxShadow:
            "inset 0 2px 2px color-mix(in oklab, var(--foreground) 18%, transparent), inset 0 -4px 8px color-mix(in oklab, var(--foreground) 10%, transparent)",
        }}
      />
    );
  }
  return (
    <span className="h-4 w-7 rounded-2xl border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function LiquidGlassLensParent() {
  return (
    <ScrollScene label="Parent pointer" note="listeners on offsetParent">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-8 ${reduced ? "lglp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="lglp-el relative h-44 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div className="absolute inset-6 space-y-3">
              <div className="h-2.5 w-32 rounded-full bg-[var(--foreground)]/25" />
              <div className="h-2 w-full rounded-full bg-[var(--foreground)]/12" />
              <div className="h-2 w-[80%] rounded-full bg-[var(--foreground)]/10" />
              <div className="h-2 w-[60%] rounded-full bg-[var(--foreground)]/10" />
            </div>
            <div
              className="lglp-lens absolute top-0 left-0 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-fd-border bg-[var(--muted)]/70 shadow-sm backdrop-blur-[2px]"
              style={{
                boxShadow:
                  "inset 0 2px 2px color-mix(in oklab, var(--foreground) 18%, transparent), inset 0 -4px 8px color-mix(in oklab, var(--foreground) 10%, transparent)",
              }}
            />
            <span className="absolute right-3 bottom-3 font-mono text-[10px] text-fd-muted-foreground">
              relative parent
            </span>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="font-mono text-[12px] text-fd-muted-foreground">
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
