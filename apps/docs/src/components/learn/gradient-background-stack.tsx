"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes gbs-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gbs-el { animation: gbs-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gbs-static .gbs-el { animation: none; opacity: 1; transform: none; }
`;

export function GradientBackgroundStack() {
  return (
    <ScrollScene label="Stacking" note="absolute inset-0 z-base">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gbs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="gbs-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div
              className="absolute inset-0 z-base"
              style={{
                backgroundColor: "#020617",
                backgroundImage:
                  "radial-gradient(circle 100px at 50% 30%, #444, transparent)",
              }}
            />
            <div className="relative z-raised flex h-full flex-col items-center justify-center gap-2 p-6">
              <div className="h-2.5 w-28 rounded-full bg-[var(--foreground)]/40" />
              <div className="h-2 w-40 rounded-full bg-[var(--foreground)]/20" />
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-8 rounded-lg ring-1 ring-fd-border ring-inset"
                style={{
                  backgroundColor: "#020617",
                  backgroundImage:
                    "radial-gradient(circle 100px at 50% 30%, #444, transparent)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Background
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                absolute inset-0 z-base aria-hidden
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="flex flex-col gap-0.5">
                <span className="h-1 w-8 rounded-full bg-[var(--foreground)]/40" />
                <span className="h-0.5 w-6 rounded-full bg-[var(--foreground)]/20" />
              </span>
              <dt className="font-medium text-[13px] text-fd-foreground">
                Content
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                relative z-raised (or higher)
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
