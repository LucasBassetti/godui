"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes gem-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gem-el { animation: gem-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gem-static .gem-el { animation: none; opacity: 1; transform: none; }
`;

export function GeometricBackgroundMask() {
  return (
    <ScrollScene label="Mask" note="fade the lattice out">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gem-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="gem-el h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={
              {
                "--d": "0ms",
                backgroundImage:
                  "linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 30%, transparent 95%)",
                maskImage:
                  "linear-gradient(to bottom, black 30%, transparent 95%)",
              } as CSSProperties
            }
          />
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Mask
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                CSS maskImage fades density
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Presets
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                dashes, circuits, crosses — still one div
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
