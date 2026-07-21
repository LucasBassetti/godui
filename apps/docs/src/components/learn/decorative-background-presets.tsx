"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes dbp-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dbp-el { animation: dbp-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.dbp-static .dbp-el { animation: none; opacity: 1; transform: none; }
`;

export function DecorativeBackgroundPresets() {
  return (
    <ScrollScene label="Presets" note="swap the style object">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "dbp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="grid w-full grid-cols-3 gap-3">
            {(
              [
                "radial-gradient(125% 125% at 50% 10%, #fff 40%, #a1a1aa 100%)",
                "radial-gradient(125% 125% at 50% 90%, #fff 40%, #a1a1aa 100%)",
                "radial-gradient(ellipse at 100% 0%, #d4d4d8 0%, transparent 55%), #fafafa",
              ] as const
            ).map((bg, i) => (
              <div
                key={bg}
                className="dbp-el h-24 rounded-xl border border-fd-border"
                style={
                  { "--d": `${i * 80}ms`, background: bg } as CSSProperties
                }
              />
            ))}
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-5 rounded-xl border border-fd-border ring-1 ring-fd-border ring-inset"
                style={{
                  background:
                    "radial-gradient(125% 125% at 50% 10%, #fff 40%, #a1a1aa 100%)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Top
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                default top radial
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-5 rounded-xl border border-fd-border ring-1 ring-fd-border ring-inset"
                style={{
                  background:
                    "radial-gradient(125% 125% at 50% 90%, #fff 40%, #a1a1aa 100%)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Bottom
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                flip the at-position
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-5 rounded-xl border border-fd-border ring-1 ring-fd-border ring-inset"
                style={{
                  background:
                    "radial-gradient(ellipse at 100% 0%, #d4d4d8 0%, transparent 55%), #fafafa",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Corner
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                ellipse bloom + base fill
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
