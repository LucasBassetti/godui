"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The corona's scale and spin live on separate wrappers so the rotate
 * keyframe never clobbers the inline amplitude scale — same split as the
 * real component.
 */
const CSS = `
@keyframes voas-spin {
  to { transform: rotate(360deg); }
}
@keyframes voas-scale {
  0%, 100% { transform: scale(0.92); }
  50%      { transform: scale(1.18); }
}
@keyframes voas-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.voas-stage { animation: voas-in 400ms ease both; }
.voas-scale { animation: voas-scale 2.4s ease-in-out infinite; }
.voas-spin  { animation: voas-spin 8s linear infinite; }
.voas-static .voas-scale,
.voas-static .voas-spin { animation: none; }
.voas-static .voas-scale { transform: scale(1.05); }
`;

const LEGEND = [
  {
    name: "Wrapper",
    desc: "inline scale(--amp)",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Inner",
    desc: "animate-voice-orb-spin",
    swatch: "bg-[var(--muted)]",
  },
] as const;

export function VoiceOrbAmpSplit() {
  return (
    <ScrollScene label="Amp split" note="scale on wrapper · rotate on child">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-8 ${reduced ? "voas-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          {cycle > 0 ? (
            <div className="voas-stage flex items-center gap-10">
              {/* Wrong: single layer — spin fights scale */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative size-24 rounded-full border border-dashed border-fd-border bg-[var(--muted)]/40"
                  style={
                    {
                      transform: "scale(1.1) rotate(25deg)",
                    } as CSSProperties
                  }
                >
                  <span className="absolute inset-2 rounded-full bg-[var(--foreground)]/15" />
                </div>
                <span className="font-mono text-[11px] text-fd-muted-foreground">
                  single layer
                </span>
              </div>

              {/* Right: split */}
              <div className="flex flex-col items-center gap-3">
                <div className="voas-scale relative size-24">
                  <div className="voas-spin absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--foreground)_0%,transparent_40%,var(--foreground)_70%,transparent_100%)] opacity-40 blur-md" />
                  <div className="absolute inset-[18%] rounded-full border border-border bg-[var(--card)]" />
                </div>
                <span className="font-mono text-[11px] text-fd-muted-foreground">
                  wrapper + child
                </span>
              </div>
            </div>
          ) : (
            <div className="h-28" />
          )}

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
                />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
