"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes lmc-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lmc-el { animation: lmc-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lmc-static .lmc-el { animation: none; opacity: 1; transform: none; }
@keyframes lmc-merge {
  0%, 100% { transform: translate(0, 0) scale(0.4); opacity: 0.3; }
  45%, 55% { transform: translate(18px, 0) scale(1); opacity: 1; }
}
.lmc-c { animation: lmc-merge 2.8s ease-in-out infinite; }
.lmc-static .lmc-c { animation: none; transform: translate(18px, 0) scale(1); opacity: 1; }
`;

export function LiquidMetaballsCursor() {
  return (
    <ScrollScene label="Cursor blob" note="r grows on pointer">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "lmc-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="lmc-el relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms", filter: "url(#lmg-goo2)" } as CSSProperties}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute size-0"
            >
              <defs>
                <filter id="lmg-goo2">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="7"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                  />
                </filter>
              </defs>
            </svg>
            <div className="absolute size-14 rounded-full bg-[var(--foreground)]/70" />
            <div className="lmc-c absolute size-12 rounded-full bg-[var(--foreground)]/65" />
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Active
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                r = min(w,h)×0.1 while pointer in
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Idle
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                r = 0 — no leftover disc
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
