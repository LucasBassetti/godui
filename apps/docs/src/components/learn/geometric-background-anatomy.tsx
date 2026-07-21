"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes gea-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gea-el { animation: gea-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gea-static .gea-el { animation: none; opacity: 1; transform: none; }
`;

export function GeometricBackgroundAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="dual-axis line recipe">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gea-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="gea-el h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-white"
            style={
              {
                "--d": "0ms",
                backgroundImage:
                  "linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              } as CSSProperties
            }
          />
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                X lines
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                linear-gradient to right · 1px stroke
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Y lines
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                linear-gradient to bottom · same size
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
