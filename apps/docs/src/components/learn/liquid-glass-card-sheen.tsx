"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Pointer sheen on a themed card surface — no forced dark panel.
 */
const CSS = `
@keyframes lgcs-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lgcs-track {
  0%, 100% { --sx: 28%; --sy: 32%; }
  33% { --sx: 72%; --sy: 28%; }
  66% { --sx: 55%; --sy: 68%; }
}
@keyframes lgcs-fade {
  0%, 12% { opacity: 0; }
  22%, 88% { opacity: 1; }
  100% { opacity: 0; }
}
.lgcs-el { animation: lgcs-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lgcs-panel { animation: lgcs-track 3.6s ease-in-out infinite; }
.lgcs-glow {
  opacity: 0;
  animation: lgcs-fade 3.6s ease-in-out infinite;
  background: radial-gradient(
    circle at var(--sx, 50%) var(--sy, 50%),
    color-mix(in oklab, var(--foreground) 40%, transparent) 0%,
    transparent 45%
  );
}
.lgcs-static .lgcs-el { animation: none; opacity: 1; transform: none; }
.lgcs-static .lgcs-panel { animation: none; }
.lgcs-static .lgcs-glow { animation: none; opacity: 1; --sx: 35%; --sy: 30%; }
`;

const LEGEND = [
  {
    name: "CSS vars",
    desc: "--lg-x / --lg-y as %",
    kind: "vars" as const,
  },
  {
    name: "Fade",
    desc: "transition-opacity duration-200",
    kind: "fade" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "fade") {
    return (
      <span className="relative h-4 w-7 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset">
        <span
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--foreground) 40%, transparent) 0%, transparent 45%)",
          }}
        />
      </span>
    );
  }
  return (
    <span className="relative h-4 w-7 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset">
      <span className="absolute inset-0 bg-[var(--muted)]/35" />
    </span>
  );
}

export function LiquidGlassCardSheen() {
  return (
    <ScrollScene label="Sheen" note="--lg-x · --lg-y · 200ms fade">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[400px] flex-col items-center gap-8 ${reduced ? "lgcs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="lgcs-el lgcs-panel relative h-36 w-56 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-sm"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div className="absolute inset-0 bg-[var(--muted)]/35" />
            <div className="lgcs-glow absolute inset-0 mix-blend-screen" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow:
                  "inset 0 1px 0 0 color-mix(in oklab, var(--foreground) 25%, transparent), inset 0 -1px 1px 0 color-mix(in oklab, var(--foreground) 12%, transparent)",
              }}
            />
            <div className="absolute inset-x-10 bottom-10 h-2 rounded-full bg-[var(--foreground)]/30" />
            <div className="absolute inset-x-14 bottom-14 h-1.5 rounded-full bg-[var(--foreground)]/15" />
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
