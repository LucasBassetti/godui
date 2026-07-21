"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `PhoneFrame` never hardcodes a radius or a notch size — every dimension is
 * a ratio of the `width` prop (`shellR: 0.17`, `padR: 0.035`, `screenR:
 * 0.13` for iPhone), computed once and applied as inline `px` styles. That's
 * why the frame looks identical scaled to 140px or 400px, instead of a fixed
 * rem radius going chunky or hairline at the extremes.
 */
const W = 96;
const GEO = { shellR: 0.17, padR: 0.035, screenR: 0.13 };
const shellR = W * GEO.shellR;
const pad = W * GEO.padR;
const screenR = W * GEO.screenR;
const notchW = W * 0.3;
const notchH = W * 0.085;

const CSS = `
@keyframes asa-panel { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.asa-panel { opacity: 0; animation: asa-panel 460ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.asa-static .asa-panel { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "shell" | "screen" | "notch";
}[] = [
  {
    name: "Shell",
    desc: "radius = width × 0.17, holds the padding",
    kind: "shell",
  },
  {
    name: "Screen",
    desc: "radius = width × 0.13, inset by width × 0.035",
    kind: "screen",
  },
  {
    name: "Notch",
    desc: "width × 0.3, top-centered on the screen",
    kind: "notch",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "notch") {
    return (
      <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "shell") {
    return (
      <span className="h-4 w-3 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-5 rounded-md bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset" />
  );
}

export function AppShowcaseAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="every radius is a ratio of width">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[460px] flex-col items-center gap-9 ${
            reduced ? "asa-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 items-end justify-items-center gap-3 sm:gap-6">
            {/* Shell alone */}
            <div
              className="asa-panel bg-[var(--muted)]"
              style={
                {
                  width: `${W}px`,
                  aspectRatio: "433 / 882",
                  borderRadius: `${shellR}px`,
                  "--d": "0ms",
                } as CSSProperties
              }
            />

            {/* Screen alone, with notch */}
            <div
              className="asa-panel relative bg-[var(--foreground)]/25"
              style={
                {
                  width: `${W - pad * 2}px`,
                  aspectRatio: "433 / 882",
                  borderRadius: `${screenR}px`,
                  "--d": "110ms",
                } as CSSProperties
              }
            >
              <span
                className="absolute left-1/2 top-[3%] -translate-x-1/2 rounded-full bg-[var(--foreground)]/60"
                style={{ width: `${notchW}px`, height: `${notchH}px` }}
              />
            </div>

            {/* Assembled */}
            <div
              className="asa-panel relative bg-[var(--muted)]"
              style={
                {
                  width: `${W}px`,
                  aspectRatio: "433 / 882",
                  borderRadius: `${shellR}px`,
                  padding: `${pad}px`,
                  "--d": "220ms",
                } as CSSProperties
              }
            >
              <div
                className="relative size-full bg-[var(--foreground)]/25"
                style={{ borderRadius: `${screenR}px` }}
              >
                <span
                  className="absolute left-1/2 top-[3%] -translate-x-1/2 rounded-full bg-[var(--foreground)]/60"
                  style={{ width: `${notchW}px`, height: `${notchH}px` }}
                />
              </div>
              <span className="absolute -left-px top-[22%] h-[7%] w-[2px] rounded-l bg-[var(--foreground)]/40" />
              <span className="absolute -right-px top-[26%] h-[10%] w-[2px] rounded-r bg-[var(--foreground)]/40" />
            </div>
          </div>

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
