"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes dbs-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dbs-el { animation: dbs-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.dbs-static .dbs-el { animation: none; opacity: 1; transform: none; }
`;

export function DecorativeBackgroundStack() {
  return (
    <ScrollScene label="Stacking" note="content clears the wash">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "dbs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="dbs-el relative h-36 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div
              className="absolute inset-0 z-base"
              style={{
                background:
                  "radial-gradient(125% 125% at 50% 10%, #fff 40%, #a1a1aa 100%)",
              }}
            />
            <div className="relative z-raised flex h-full flex-col justify-end gap-2 p-6">
              <div className="h-2.5 w-24 rounded-full bg-[var(--foreground)]/35" />
              <div className="h-2 w-40 rounded-full bg-[var(--foreground)]/18" />
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Layer
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                z-base decorative plane
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Copy
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                z-raised — never trapped in the gradient
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
