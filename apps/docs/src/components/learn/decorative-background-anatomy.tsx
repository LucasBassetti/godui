"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes dba-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dba-el { animation: dba-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.dba-static .dba-el { animation: none; opacity: 1; transform: none; }
`;

export function DecorativeBackgroundAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="radial wash from the top">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "dba-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="dba-el h-40 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={
              {
                "--d": "0ms",
                background:
                  "radial-gradient(125% 125% at 50% 10%, #fff 40%, #a1a1aa 100%)",
              } as CSSProperties
            }
          >
            <div className="relative z-raised flex h-full items-center justify-center">
              <div className="h-2.5 w-28 rounded-full bg-[var(--foreground)]/30" />
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Wash
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                radial-gradient 125% at 50% 10%
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Shell
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                absolute inset-0 z-base · same ownership
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
