"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes eba-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.eba-el { animation: eba-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.eba-static .eba-el { animation: none; opacity: 1; transform: none; }
`;

export function EffectBackgroundAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="stacked radials + linear wash">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "eba-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="eba-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={
              {
                "--d": "0ms",
                backgroundColor: "#e8e8ec",
                backgroundImage:
                  "radial-gradient(ellipse 40% 30% at 20% 30%, rgba(0,0,0,0.12), transparent), radial-gradient(ellipse 35% 28% at 80% 20%, rgba(0,0,0,0.1), transparent), radial-gradient(ellipse 45% 35% at 60% 80%, rgba(0,0,0,0.08), transparent), linear-gradient(180deg, #f4f4f5, #e4e4e7)",
              } as CSSProperties
            }
          />
          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-black/12 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Blobs
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                multiple radial ellipses, soft stops
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[#ececee] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Wash
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                linear-gradient vertical tint
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[#e8e8ec] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Base
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                backgroundColor under the stack
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
