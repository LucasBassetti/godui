"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The signature `whileInView` ignite: both cones and the glowing bar scaleX
 * from 0.5 → 1 over 0.8s easeInOut (opacity 0.5 → 1 on the cones). Origins
 * match the component — right cone origin-right, left cone origin-left —
 * so the light blooms outward from the center seam.
 */
const CSS = `
@keyframes li-cone-r {
  from { transform: scaleX(0.5); opacity: 0.5; }
  to   { transform: scaleX(1);   opacity: 1; }
}
@keyframes li-cone-l {
  from { transform: scaleX(0.5); opacity: 0.5; }
  to   { transform: scaleX(1);   opacity: 1; }
}
@keyframes li-bar {
  from { transform: scaleX(0.5); }
  to   { transform: scaleX(1); }
}
@keyframes li-wash {
  from { opacity: 0.35; transform: scaleX(0.7); }
  to   { opacity: 1;    transform: scaleX(1); }
}
.li-cone-r { animation: li-cone-r 800ms ease-in-out both; transform-origin: right center; }
.li-cone-l { animation: li-cone-l 800ms ease-in-out both; transform-origin: left center; }
.li-bar    { animation: li-bar 800ms ease-in-out both; }
.li-wash   { animation: li-wash 800ms ease-in-out both; }
.li-static .li-cone-r,
.li-static .li-cone-l { animation: none; opacity: 1; transform: none; }
.li-static .li-bar,
.li-static .li-wash { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Cones",
    desc: "scaleX 0.5→1 · opacity 0.5→1",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Bar",
    desc: "scaleX 0.5→1, same 0.8s easeInOut",
    swatch: "bg-[var(--foreground)]/60",
  },
  {
    name: "Viewport",
    desc: "once:true, margin −20%",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function LampIgnite() {
  return (
    <ScrollScene label="Ignite" note="scaleX 0.5→1 · 0.8s easeInOut">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-9 ${reduced ? "li-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="relative isolate overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ width: 360, height: 200 }}
          >
            <div className="absolute inset-0 flex items-start justify-center pt-8">
              <div
                className="li-cone-r absolute right-1/2 h-32 w-52"
                style={
                  {
                    backgroundImage:
                      "conic-gradient(from 70deg at center top, color-mix(in oklch, var(--foreground) 40%, transparent), transparent, transparent)",
                    maskImage: "linear-gradient(to top, transparent, white)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent, white)",
                  } as CSSProperties
                }
              />
              <div
                className="li-cone-l absolute left-1/2 h-32 w-52"
                style={
                  {
                    backgroundImage:
                      "conic-gradient(from 290deg at center top, transparent, transparent, color-mix(in oklch, var(--foreground) 40%, transparent))",
                    maskImage: "linear-gradient(to top, transparent, white)",
                    WebkitMaskImage:
                      "linear-gradient(to top, transparent, white)",
                  } as CSSProperties
                }
              />
              <div
                className="li-wash absolute top-8 h-24 w-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center top, color-mix(in oklch, var(--foreground) 20%, transparent), transparent 60%)",
                }}
              />
              <div className="li-bar absolute top-[3.5rem] z-raised h-0.5 w-36 rounded-full bg-[var(--foreground)]/75 blur-[1px]" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"initial={unlit} whileInView={lit} · viewport once −20%"}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
