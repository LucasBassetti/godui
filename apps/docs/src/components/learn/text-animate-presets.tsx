"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Presets share the same container stagger; only the item variants change.
 * blurInUp combines opacity + blur(10px) + y:20; slideUp is opacity + y only.
 * Abstract token bars — compositor-only (opacity / transform / filter).
 */
const BARS = 4;
const WIDTHS = [44, 32, 52, 36];
const STAGGER_MS = 90;

const CSS = `
@keyframes tap-blur {
  from { opacity: 0; filter: blur(10px); transform: translateY(16px); }
  to   { opacity: 1; filter: blur(0px);  transform: translateY(0); }
}
@keyframes tap-slide {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tap-blur {
  opacity: 0;
  animation: tap-blur 560ms cubic-bezier(0.22, 1, 0.36, 1) var(--d) both;
}
.tap-slide {
  opacity: 0;
  animation: tap-slide 560ms cubic-bezier(0.22, 1, 0.36, 1) var(--d) both;
}
.tap-static .tap-blur,
.tap-static .tap-slide {
  opacity: 1;
  animation: none;
  filter: none;
  transform: none;
}
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "blur" | "slide";
}[] = [
  {
    name: "blurInUp",
    desc: "opacity + blur(10px) + y:20 → rest",
    kind: "blur",
  },
  {
    name: "slideUp",
    desc: "opacity + y:20 → rest · no filter",
    kind: "slide",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "blur") {
    return (
      <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 blur-[2px] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
  );
}

function BarRow({ className }: { className: string }) {
  return (
    <div
      className="flex h-16 w-full flex-wrap items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-4"
      aria-hidden="true"
    >
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length preset row
          key={i}
          className={`${className} h-2 rounded-full bg-[var(--foreground)]/30`}
          style={
            {
              width: `${WIDTHS[i]}px`,
              "--d": `${i * STAGGER_MS}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function TextAnimatePresets() {
  return (
    <ScrollScene label="Presets" note="blurInUp vs slideUp · same stagger">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`grid w-full grid-cols-2 gap-6 ${reduced ? "tap-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <BarRow className="tap-blur" />
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                blurInUp
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <BarRow className="tap-slide" />
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                slideUp
              </p>
            </div>
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
