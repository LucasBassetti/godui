"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes bga-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bga-el { animation: bga-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.bga-static .bga-el { animation: none; opacity: 1; transform: none; }
`;

export function BlueprintGridAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="lines · dots · cellSize 32">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "bga-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="grid w-full grid-cols-2 gap-4">
            <div
              className="bga-el h-32 rounded-xl border border-fd-border"
              style={
                {
                  "--d": "0ms",
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                } as CSSProperties
              }
            />
            <div
              className="bga-el h-32 rounded-xl border border-fd-border"
              style={
                {
                  "--d": "100ms",
                  backgroundImage:
                    "radial-gradient(var(--border) 1px, transparent 1.5px)",
                  backgroundSize: "16px 16px",
                } as CSSProperties
              }
            />
          </div>
          <div className="flex w-full justify-around font-mono text-[11px] text-fd-muted-foreground">
            <span>lines</span>
            <span>dots</span>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3.5 w-5 rounded-md border border-fd-border ring-1 ring-fd-border ring-inset [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:6px_6px]"
                aria-hidden="true"
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Lines
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                dual linear-gradient 1px strokes
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3.5 w-5 rounded-md border border-fd-border ring-1 ring-fd-border ring-inset [background-image:radial-gradient(var(--border)_1px,transparent_1.5px)] [background-size:5px_5px]"
                aria-hidden="true"
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Dots
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                radial-gradient 1px dots
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
