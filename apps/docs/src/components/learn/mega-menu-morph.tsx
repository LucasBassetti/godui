"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The signature mega-menu flow: when the hot trigger changes, one shared
 * highlight slides along the trigger row *and* the open panel morphs its
 * footprint around the new content (narrow one-column ↔ wide two-column)
 * while the links cross-fade. The real component measures
 * `offsetWidth`/`offsetHeight` and animates those — this scene mirrors that
 * with width/height keyframes so the diagram reads the same way (scale would
 * distort the links and hide the point of the section).
 */
const NARROW_W = 148;
const WIDE_W = 280;
const NARROW_H = 112;
const WIDE_H = 132;

const CSS = `
@keyframes mm-pill {
  0%, 12%   { transform: translateX(0); }
  38%, 62%  { transform: translateX(88px); }
  88%, 100% { transform: translateX(0); }
}
@keyframes mm-panel {
  0%, 12%   { width: ${NARROW_W}px; height: ${NARROW_H}px; }
  38%, 62%  { width: ${WIDE_W}px; height: ${WIDE_H}px; }
  88%, 100% { width: ${NARROW_W}px; height: ${NARROW_H}px; }
}
@keyframes mm-a {
  0%, 18%   { opacity: 1; }
  30%, 70%  { opacity: 0; }
  82%, 100% { opacity: 1; }
}
@keyframes mm-b {
  0%, 18%   { opacity: 0; }
  30%, 70%  { opacity: 1; }
  82%, 100% { opacity: 0; }
}
.mm-pill  { animation: mm-pill 4.2s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
.mm-panel { animation: mm-panel 4.2s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
.mm-a     { animation: mm-a 4.2s ease infinite; }
.mm-b     { animation: mm-b 4.2s ease infinite; }
.mm-static .mm-pill  { animation: none; transform: translateX(88px); }
.mm-static .mm-panel { animation: none; width: ${WIDE_W}px; height: ${WIDE_H}px; }
.mm-static .mm-a     { animation: none; opacity: 0; }
.mm-static .mm-b     { animation: none; opacity: 1; }
`;

function LinkRow({ w }: { w: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-6 shrink-0 rounded-md bg-[var(--muted)]" />
      <span className={`h-2 ${w} rounded-full bg-[var(--foreground)]/25`} />
    </div>
  );
}

export function MegaMenuMorph() {
  return (
    <ScrollScene
      label="Panel flow"
      note="highlight slides · panel morphs · content cross-fades"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "mm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col items-start gap-2">
            {/* Trigger row — shared pill slides between two panel triggers. */}
            <div className="relative inline-flex items-center gap-1 rounded-xl border border-fd-border bg-[var(--muted)]/40 p-1">
              <span
                aria-hidden="true"
                className="mm-pill pointer-events-none absolute top-1 left-1 h-9 w-20 rounded-lg bg-[var(--foreground)]/10 ring-1 ring-fd-border ring-inset"
              />
              {(["w-12", "w-14", "w-10"] as const).map((w, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed trigger row
                  key={i}
                  className="relative z-10 flex h-9 w-20 items-center justify-center"
                >
                  <span
                    className={`h-2 ${w} rounded-full bg-[var(--foreground)]/30`}
                  />
                </div>
              ))}
            </div>

            {/* Open panel — footprint morphs around the active content. */}
            <div
              className="mm-panel relative overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-lg"
              style={
                {
                  width: NARROW_W,
                  height: NARROW_H,
                } as CSSProperties
              }
            >
              <div className="mm-a absolute inset-0 flex flex-col gap-2.5 p-3">
                <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/20" />
                <LinkRow w="w-16" />
                <LinkRow w="w-14" />
              </div>
              <div className="mm-b absolute inset-0 flex gap-4 p-3">
                {[0, 1].map((col) => (
                  <div key={col} className="flex flex-1 flex-col gap-2.5">
                    <span className="h-1.5 w-8 rounded-full bg-[var(--foreground)]/20" />
                    <LinkRow w="w-12" />
                    <LinkRow w="w-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            measures content → animates width/height · 0.3s [0.22,1,0.36,1]
          </p>
        </div>
      )}
    </ScrollScene>
  );
}
