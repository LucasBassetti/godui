"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes bgp-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bgp-el { animation: bgp-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.bgp-static .bgp-el { animation: none; opacity: 1; transform: none; }
@keyframes bgp-tilt {
  from { opacity: 0; transform: rotateX(0deg) translateY(12px); }
  to { opacity: 1; transform: rotateX(72deg) translateY(0); }
}
.bgp-floor {
  transform-origin: center bottom;
  animation: bgp-tilt 900ms cubic-bezier(0.3,0.7,0.4,1.1) both;
}
.bgp-static .bgp-floor { animation: none; opacity: 1; transform: rotateX(72deg); }
`;

export function BlueprintGridPerspective() {
  return (
    <ScrollScene label="Perspective" note="rotateX 72° · perspective 600px">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "bgp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="bgp-el relative flex h-44 w-full items-end justify-center overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms", perspective: "600px" } as CSSProperties}
          >
            <div
              className="bgp-floor h-40 w-[120%] opacity-80"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
                WebkitMaskImage:
                  "linear-gradient(to top, black 20%, transparent 95%)",
                maskImage:
                  "linear-gradient(to top, black 20%, transparent 95%)",
              }}
            />
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-8 rounded-sm ring-1 ring-fd-border ring-inset [transform:rotateX(72deg)]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                  backgroundSize: "6px 6px",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Tilt
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                rotateX(72deg) on the grid layer
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-8 rounded-sm ring-1 ring-fd-border ring-inset"
                style={{
                  backgroundImage:
                    "linear-gradient(to top, var(--foreground)/35 20%, transparent 95%)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Fade
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                bottom mask — floor dissolves upward
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-8 rounded-2xl border border-dashed border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Note
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                perspective variant skips spotlight
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
