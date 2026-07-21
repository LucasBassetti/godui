"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes gbo-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gbo-el { animation: gbo-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gbo-static .gbo-el { animation: none; opacity: 1; transform: none; }
`;

export function GradientBackgroundOwnership() {
  return (
    <ScrollScene label="Ownership" note="BACKGROUND_KEYS drop the bake">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gbo-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="grid w-full grid-cols-2 gap-4">
            <div
              className="gbo-el flex flex-col gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div
                className="h-28 rounded-xl border border-fd-border"
                style={{
                  backgroundColor: "#020617",
                  backgroundImage:
                    "radial-gradient(circle 80px at 50% 40%, #3e3e3e, transparent)",
                }}
              />
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                baked default
              </span>
            </div>
            <div
              className="gbo-el flex flex-col gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div
                className="h-28 rounded-xl border border-fd-border"
                style={{
                  backgroundImage: "linear-gradient(135deg, #0f172a, #312e81)",
                }}
              />
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                caller style wins
              </span>
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Probe
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                {"BACKGROUND_KEYS.some(k => k in style)"}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Merge
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                {"ownsBackground ? style : { ...base, ...style }"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
