"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes lma-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lma-el { animation: lma-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lma-static .lma-el { animation: none; opacity: 1; transform: none; }
@keyframes lma-a {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(14px, -6px); }
}
@keyframes lma-b {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-12px, 8px); }
}
.lma-a { animation: lma-a 2.8s ease-in-out infinite; }
.lma-b { animation: lma-b 2.8s ease-in-out infinite; }
.lma-static .lma-a, .lma-static .lma-b { animation: none; }
`;

export function LiquidMetaballsAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="SVG circles · goo filter">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "lma-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="lma-el relative flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div
              className="lma-a absolute size-16 rounded-full bg-[var(--foreground)]/70"
              style={{ marginRight: "2rem" }}
            />
            <div
              className="lma-b absolute size-14 rounded-full bg-[var(--foreground)]/60"
              style={{ marginLeft: "2.5rem" }}
            />
          </div>
          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Blobs
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                blobCount=7 · radius ~8–16% of min side
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Paint
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                setAttribute cx/cy — no React re-render
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Wrap
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                toroidal edges
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
