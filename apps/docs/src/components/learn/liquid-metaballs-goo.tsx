"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes lmg-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lmg-el { animation: lmg-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lmg-static .lmg-el { animation: none; opacity: 1; transform: none; }
@keyframes lmg-a {
  0%, 15% { transform: translate(0, 0); }
  40%, 60% { transform: translate(20px, 0); }
  85%, 100% { transform: translate(0, 0); }
}
@keyframes lmg-b {
  0%, 15% { transform: translate(0, 0); }
  40%, 60% { transform: translate(-20px, 0); }
  85%, 100% { transform: translate(0, 0); }
}
.lmg-a { animation: lmg-a 3s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.lmg-b { animation: lmg-b 3s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.lmg-static .lmg-a { animation: none; transform: translate(20px, 0); }
.lmg-static .lmg-b { animation: none; transform: translate(-20px, 0); }
`;

export function LiquidMetaballsGoo() {
  return (
    <ScrollScene label="Goo filter" note="blur + contrast matrix">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "lmg-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute size-0"
          >
            <defs>
              <filter id="lmg-goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="8"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                  result="goo"
                />
              </filter>
            </defs>
          </svg>
          <div className="grid w-full grid-cols-2 gap-5">
            <div
              className="lmg-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative flex h-28 w-full items-center justify-center">
                <div className="lmg-a absolute size-12 rounded-full bg-[var(--foreground)]/75" />
                <div className="lmg-b absolute size-12 rounded-full bg-[var(--foreground)]/75" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                raw
              </span>
            </div>
            <div
              className="lmg-el flex flex-col items-center gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div
                className="relative flex h-28 w-full items-center justify-center"
                style={{ filter: "url(#lmg-goo)" }}
              >
                <div className="lmg-a absolute size-12 rounded-full bg-[var(--foreground)]/75" />
                <div className="lmg-b absolute size-12 rounded-full bg-[var(--foreground)]/75" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                gooeyness=16
              </span>
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Blur
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                {"feGaussianBlur stdDeviation={gooeyness}"}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Punch
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                alpha ×20 − 9
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
