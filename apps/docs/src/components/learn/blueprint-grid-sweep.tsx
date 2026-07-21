"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes bgs-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bgs-el { animation: bgs-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.bgs-static .bgs-el { animation: none; opacity: 1; transform: none; }
@keyframes bgs-sweep {
  0% { transform: translate(-50%, -50%) rotate(25deg); opacity: 0; }
  15%, 85% { opacity: 1; }
  100% { transform: translate(150%, 150%) rotate(25deg); opacity: 0; }
}
@keyframes bgs-spot {
  0%, 100% { --sx: 30%; --sy: 35%; }
  50% { --sx: 65%; --sy: 55%; }
}
.bgs-band {
  animation: bgs-sweep 3.2s linear infinite;
  width: 55%;
  height: 140%;
  filter: blur(14px);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
}
.bgs-spot {
  animation: bgs-spot 3.2s ease-in-out infinite;
  background: radial-gradient(circle 80px at var(--sx, 50%) var(--sy, 50%), rgba(0,0,0,0.2), transparent 70%);
}
.bgs-static .bgs-band { animation: none; opacity: 0; }
.bgs-static .bgs-spot { animation: none; --sx: 40%; --sy: 40%; }
`;

export function BlueprintGridSweep() {
  return (
    <ScrollScene label="Sweep + spotlight" note="8s diagonal band · --bx/--by">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "bgs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="bgs-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border"
            style={
              {
                "--d": "0ms",
                backgroundImage:
                  "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              } as CSSProperties
            }
          >
            <div className="bgs-spot absolute inset-0" />
            <div className="bgs-band absolute top-0 left-0 origin-center" />
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-5 origin-center rotate-[25deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] blur-[1px] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Sweep
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                animate-blueprint-sweep · motion-reduce:hidden
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="size-4 rounded-full ring-1 ring-fd-border ring-inset"
                style={{
                  background:
                    "radial-gradient(circle, rgba(0,0,0,0.25) 0%, transparent 70%)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Spotlight
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                --bx/--by/--bo on offsetParent · 300ms fade
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
