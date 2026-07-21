"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three absolute layers on one card, matching SpotlightCard: radial glow,
 * optional 1px border ring (same gradient, mask-composite exclude), and
 * content at z-raised. Exploded along Z so the stack reads as three plates.
 */
const CSS = `
@keyframes sca-explode {
  from { opacity: 0; transform: translateZ(var(--tz0)); }
  to   { opacity: 1; transform: translateZ(var(--tz)); }
}
.sca-plate {
  position: absolute; inset: 0; margin: auto;
  opacity: 0; transform: translateZ(var(--tz));
  animation: sca-explode 900ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.sca-static .sca-plate { opacity: 1; animation: none; }
`;

const LEGEND = [
  {
    name: "Glow",
    desc: "radial at var(--x)/var(--y), opacity 0→100 on group-hover",
    swatch:
      "h-3 w-8 rounded-md border border-fd-border bg-[var(--card)] [background:radial-gradient(circle_at_30%_40%,rgba(0,0,0,0.28),transparent_65%),var(--card)] ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Border",
    desc: "same gradient, masked to 1px ring (mask-composite exclude)",
    swatch:
      "h-3 w-8 rounded-md border border-[var(--foreground)]/35 bg-transparent ring-1 ring-fd-border ring-inset",
  },
  {
    name: "Content",
    desc: "relative z-raised — sits above both glow layers",
    swatch:
      "h-3 w-8 rounded-md bg-[var(--muted)]/85 ring-1 ring-fd-border ring-inset",
  },
] as const;

export function SpotlightCardAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="glow · border ring · content">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-[200px] items-center justify-center [perspective:1000px] ${reduced ? "sca-static" : ""}`}
          >
            <div className="relative h-[130px] w-[200px] [transform:rotateX(55deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
              <div
                className="sca-plate rounded-xl border border-fd-border bg-[var(--card)] [background:radial-gradient(circle_70px_at_35%_40%,rgba(0,0,0,0.28),transparent_65%),var(--card)]"
                style={
                  {
                    "--tz": "0px",
                    "--tz0": "-24px",
                    "--d": "0ms",
                  } as CSSProperties
                }
              />
              <div
                className="sca-plate rounded-xl border border-[var(--foreground)]/35 bg-transparent"
                style={
                  {
                    "--tz": "36px",
                    "--tz0": "0px",
                    "--d": "160ms",
                  } as CSSProperties
                }
              />
              <div
                className="sca-plate flex items-center justify-center rounded-xl bg-[var(--muted)]/85"
                style={
                  {
                    "--tz": "72px",
                    "--tz0": "36px",
                    "--d": "320ms",
                  } as CSSProperties
                }
              >
                <span className="h-2 w-12 rounded-full bg-[var(--foreground)]/30" />
              </div>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span className={item.swatch} />
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
