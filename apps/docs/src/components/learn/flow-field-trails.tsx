"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes fft-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fft-el { animation: fft-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.fft-static .fft-el { animation: none; opacity: 1; transform: none; }
@keyframes fft-fade {
  0% { opacity: 1; }
  100% { opacity: 0.15; }
}
.fft-trail { animation: fft-fade 1.8s linear infinite; }
.fft-static .fft-trail { animation: none; opacity: 0.4; }
`;

export function FlowFieldTrails() {
  return (
    <ScrollScene label="Trails" note="full-frame fade wipe">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "fft-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="fft-el relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div className="relative h-16 w-48">
              {[0.15, 0.35, 0.55, 0.75, 1].map((o, i) => (
                <div
                  key={o}
                  className="fft-trail absolute inset-y-0 w-8 rounded-full bg-[var(--foreground)]"
                  style={{
                    left: `${i * 18}%`,
                    opacity: o,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <p className="max-w-[34ch] text-center font-mono text-[12px] text-fd-muted-foreground">
            ctx.fillStyle = rgba(bg, fade) · default fade 0.06
          </p>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3 w-8 rounded-md bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Wipe
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                full-canvas translucent rect each frame
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-4 w-2 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Silk
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                lower fade → longer trails
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
