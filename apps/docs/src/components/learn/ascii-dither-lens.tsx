"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The interactive focus-lens: the field renders faded, and a round window shows
 * a full-opacity copy of the same glyphs. The window is pure `transform`
 * translate; the inner copy counter-translates by the same amount so the sharp
 * glyphs stay registered over the faded ones as the lens roams.
 */
const RAMP = " .:-=+*#%@";
const N = 15;
const STAGE = 264;
const LENS = 116;
const OFF = (STAGE - LENS) / 2;

const FIELD = Array.from({ length: N }, (_, y) =>
  Array.from({ length: N }, (_, x) => {
    const luma = 0.5 + 0.5 * Math.sin(x * 0.85) * Math.cos(y * 0.7);
    return RAMP[Math.round((1 - luma) * (RAMP.length - 1))] ?? " ";
  }).join(""),
);

const CSS = `
@keyframes adl-lens  { 0%{transform:translate(-58px,-38px);} 25%{transform:translate(48px,-48px);} 50%{transform:translate(58px,44px);} 75%{transform:translate(-44px,52px);} 100%{transform:translate(-58px,-38px);} }
@keyframes adl-inner { 0%{transform:translate(58px,38px);} 25%{transform:translate(-48px,48px);} 50%{transform:translate(-58px,-44px);} 75%{transform:translate(44px,-52px);} 100%{transform:translate(58px,38px);} }
.adl-lens  { animation: adl-lens 9s ease-in-out infinite; }
.adl-inner { animation: adl-inner 9s ease-in-out infinite; }
`;

function Field({ faded }: { faded?: boolean }) {
  return (
    <div
      className={`grid font-mono text-[13px] leading-[17px] ${faded ? "text-[var(--foreground)]/25" : "text-[var(--foreground)]"}`}
      style={{
        width: STAGE,
        height: STAGE,
        gridTemplateRows: `repeat(${N}, 1fr)`,
      }}
    >
      {FIELD.map((row, y) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative grid
          key={y}
          className="flex items-center justify-around whitespace-pre"
        >
          {row}
        </div>
      ))}
    </div>
  );
}

const LEGEND = [
  { kind: "faded", name: "Faded field", desc: "cells outside the lens" },
  { kind: "lens", name: "Focus lens", desc: "follows the pointer" },
  { kind: "sharp", name: "Sharp glyph", desc: "full detail under the lens" },
] as const;

function Swatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "faded")
    return (
      <span className="flex size-4 shrink-0 items-center justify-center font-mono font-semibold text-[13px] text-[var(--foreground)]/25">
        #
      </span>
    );
  if (kind === "lens")
    return (
      <span className="size-4 shrink-0 rounded-full border-2 border-[var(--foreground)]/45 border-dashed" />
    );
  return (
    <span className="flex size-4 shrink-0 items-center justify-center font-mono font-semibold text-[13px] text-[var(--foreground)]">
      #
    </span>
  );
}

export function AsciiDitherLens() {
  return (
    <ScrollScene label="The focus-lens" note="a roaming magnifier of detail">
      {({ cycle, reduced }) => {
        const play = cycle > 0 && !reduced;
        return (
          <div key={cycle} className="flex flex-col items-center gap-7">
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
            <style dangerouslySetInnerHTML={{ __html: CSS }} />
            <div
              className="relative overflow-hidden rounded-xl"
              style={{ width: STAGE, height: STAGE }}
            >
              <div className="absolute inset-0">
                <Field faded />
              </div>
              <div
                className={`absolute overflow-hidden rounded-full border-2 border-[var(--foreground)]/45 border-dashed ${play ? "adl-lens" : ""}`}
                style={{ width: LENS, height: LENS, left: OFF, top: OFF }}
              >
                <div
                  className={`absolute ${play ? "adl-inner" : ""}`}
                  style={{ left: -OFF, top: -OFF }}
                >
                  <Field />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {LEGEND.map((l) => (
                <div key={l.name} className="flex items-center gap-2">
                  <Swatch kind={l.kind} />
                  <span className="text-[13px] text-[var(--foreground)]">
                    <span className="font-medium">{l.name}</span>
                    <span className="text-fd-muted-foreground">
                      {" "}
                      — {l.desc}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </ScrollScene>
  );
}
