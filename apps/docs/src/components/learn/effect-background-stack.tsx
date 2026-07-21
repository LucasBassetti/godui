"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes ebs-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ebs-el { animation: ebs-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ebs-static .ebs-el { animation: none; opacity: 1; transform: none; }
`;

export function EffectBackgroundStack() {
  return (
    <ScrollScene label="Stacking" note="z-base under raised content">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "ebs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="ebs-el relative h-36 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div
              className="absolute inset-0 z-base"
              style={{
                backgroundColor: "#e8e8ec",
                backgroundImage:
                  "radial-gradient(ellipse at 30% 20%, rgba(0,0,0,0.1), transparent 50%), linear-gradient(180deg, #f4f4f5, #e4e4e7)",
              }}
            />
            <div className="relative z-raised flex h-full items-center justify-center">
              <div className="h-2.5 w-32 rounded-full bg-[var(--foreground)]/35" />
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span
                className="h-3 w-8 rounded-lg ring-1 ring-fd-border ring-inset"
                style={{
                  backgroundColor: "#e8e8ec",
                  backgroundImage:
                    "radial-gradient(ellipse at 30% 20%, rgba(0,0,0,0.1), transparent 50%), linear-gradient(180deg, #f4f4f5, #e4e4e7)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Effect
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                absolute inset-0 z-base
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-2 w-8 rounded-full bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">UI</dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                relative z-raised
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
