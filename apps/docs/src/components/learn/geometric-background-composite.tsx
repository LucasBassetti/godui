"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes gec-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gec-el { animation: gec-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gec-static .gec-el { animation: none; opacity: 1; transform: none; }
`;

export function GeometricBackgroundComposite() {
  return (
    <ScrollScene label="Composite" note="grid + radial wash">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gec-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="gec-el h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-white"
            style={
              {
                "--d": "0ms",
                backgroundImage:
                  "radial-gradient(circle at 100% 40%, rgba(0,0,0,0.08), transparent 45%), linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)",
                backgroundSize: "auto, 24px 24px, 24px 24px",
              } as CSSProperties
            }
          />
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-8 rounded-md ring-1 ring-fd-border ring-inset"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #e5e5e5 1px, transparent 1px), linear-gradient(to bottom, #e5e5e5 1px, transparent 1px)",
                  backgroundSize: "6px 6px",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Grid
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                96×64 default cell in the bake
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-8 rounded-md ring-1 ring-fd-border ring-inset"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 100% 40%, rgba(0,0,0,0.08), transparent 45%)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Glow
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                radial parked off the right edge
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
