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

const LEGEND = [
  {
    name: "Active",
    desc: "r = min(w,h)×0.1 while pointer in",
    kind: "active" as const,
  },
  {
    name: "Idle",
    desc: "r = 0 — no leftover disc",
    kind: "idle" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "idle") {
    return (
      <span className="size-3 rounded-full bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset [transform:scale(0.4)]" />
    );
  }
  return (
    <span className="size-3.5 rounded-full bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
  );
}

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
          {/* Goo filter lives on the blob <g> inside an SVG overlay, not on the
              card element: Safari composites the transform-animated HTML blob
              onto its own layer, which escapes an HTML `filter: url()` so the
              discs never merge there. SVG shapes stay inside the filter and
              fuse on every engine (and the card's border/bg stay crisp). */}
          <div
            className="lmc-el relative flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full"
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
              <g filter="url(#lmg-goo2)" fill="var(--foreground)">
                <circle cx="50%" cy="50%" r={28} fillOpacity={0.7} />
                <circle
                  className="lmc-c"
                  cx="50%"
                  cy="50%"
                  r={24}
                  fillOpacity={0.65}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                />
              </g>
            </svg>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
