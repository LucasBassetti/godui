"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes gba-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gba-el { animation: gba-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gba-static .gba-el { animation: none; opacity: 1; transform: none; }
`;

export function GradientBackgroundAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="base fill · radial glow">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gba-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="gba-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={
              { "--d": "0ms", backgroundColor: "#020617" } as CSSProperties
            }
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle 120px at 50% 40%, #3e3e3e, transparent)",
              }}
            />
            <div className="absolute inset-x-1/4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-white/20" />
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Base
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                backgroundColor #020617
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Glow
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                radial-gradient circle at 50% 200px
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
