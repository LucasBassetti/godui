"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three grayscale plates at different displace scales — the teaching point is
 * the offset (strength × (1±d)), not channel hue. Legend names R/G/B.
 */
const CSS = `
@keyframes lgcd-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lgcd-split {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(var(--ox), var(--oy)); }
}
.lgcd-el { animation: lgcd-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lgcd-ch { animation: lgcd-split 2.4s ease-in-out infinite; }
.lgcd-static .lgcd-el { animation: none; opacity: 1; transform: none; }
.lgcd-static .lgcd-ch { animation: none; transform: translate(var(--ox), var(--oy)); }
`;

const CHANNELS = [
  {
    name: "R",
    desc: "strength × (1 + d)",
    delay: "80ms",
    ox: "10px",
    oy: "-4px",
    fill: 0.12,
  },
  {
    name: "G",
    desc: "strength",
    delay: "140ms",
    ox: "0px",
    oy: "0px",
    fill: 0.2,
  },
  {
    name: "B",
    desc: "strength × (1 − d)",
    delay: "200ms",
    ox: "-10px",
    oy: "4px",
    fill: 0.1,
  },
] as const;

function LegendSwatch({
  fill,
  ox,
  oy,
}: {
  fill: number;
  ox: string;
  oy: string;
}) {
  return (
    <span
      className="h-4 w-5 rounded-2xl border border-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset"
      style={{
        backgroundColor: `color-mix(in oklab, var(--foreground) ${fill * 100}%, transparent)`,
        transform: `translate(${ox}, ${oy})`,
      }}
    />
  );
}

export function LiquidGlassCardDispersion() {
  return (
    <ScrollScene label="Dispersion" note="three scales · then screen-blend">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-8 ${reduced ? "lgcd-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-36 w-full items-center justify-center">
            <div
              className="lgcd-el absolute h-24 w-36 rounded-2xl border border-fd-border bg-[var(--card)]"
              style={{ "--d": "0ms" } as CSSProperties}
            />
            {CHANNELS.map((ch) => (
              <div
                key={ch.name}
                className="lgcd-el lgcd-ch absolute h-24 w-36 rounded-2xl border border-[var(--foreground)]/20"
                style={
                  {
                    "--d": ch.delay,
                    "--ox": ch.ox,
                    "--oy": ch.oy,
                    backgroundColor: `color-mix(in oklab, var(--foreground) ${ch.fill * 100}%, transparent)`,
                  } as CSSProperties
                }
              />
            ))}
            <div
              className="lgcd-el absolute inset-x-1/4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/30"
              style={{ "--d": "260ms" } as CSSProperties}
            />
          </div>

          <p className="max-w-[38ch] text-center text-[13px] text-fd-muted-foreground">
            Three grayscale ghosts at different offsets stand in for the R/G/B
            displaces — hue is not required to teach the fringe. Then{" "}
            <span className="font-mono text-[12px]">
              feBlend mode=&quot;screen&quot;
            </span>
            .
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {CHANNELS.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch fill={item.fill} ox={item.ox} oy={item.oy} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="font-mono text-[12px] text-fd-muted-foreground">
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
