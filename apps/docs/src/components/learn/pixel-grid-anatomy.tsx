"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes pga-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pga-el { animation: pga-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pga-static .pga-el { animation: none; opacity: 1; transform: none; }
`;

export function PixelGridAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="squareSize 4 · gridGap 6">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "pga-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="pga-el grid h-40 w-full place-content-center gap-1.5 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] p-6"
            style={
              {
                "--d": "0ms",
                gridTemplateColumns: "repeat(12, 0.5rem)",
              } as CSSProperties
            }
          >
            {Array.from({ length: 96 }, (_, i) => `pga-${i}`).map((id, i) => (
              <div
                key={id}
                className="size-2 rounded-[1px] bg-[var(--foreground)]"
                style={{ opacity: 0.08 + ((i * 7) % 5) * 0.06 }}
              />
            ))}
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Cell
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                squareSize=4 · gridGap=6
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Cap
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                maxOpacity=0.3
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Mode
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                interactive or auto flicker
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
