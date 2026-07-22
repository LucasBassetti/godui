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

const LEGEND = [
  {
    name: "Blur",
    desc: "feGaussianBlur stdDeviation={gooeyness}",
    kind: "blur" as const,
  },
  {
    name: "Punch",
    desc: "alpha ×20 − 9",
    kind: "punch" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "punch") {
    return (
      <span className="relative flex h-4 w-8 items-center justify-center">
        <span className="absolute size-3 rounded-full bg-[var(--foreground)]/75" />
        <span className="absolute size-3 translate-x-2 rounded-full bg-[var(--foreground)]/75" />
      </span>
    );
  }
  return (
    <span className="relative flex h-4 w-8 items-center justify-center">
      <span className="absolute left-1 size-3 rounded-full bg-[var(--foreground)]/75" />
      <span className="absolute right-1 size-3 rounded-full bg-[var(--foreground)]/75" />
    </span>
  );
}

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
              {/* Native SVG (circles in the filtered <g>): Safari composites a
                  transform-animated HTML child onto its own layer, escaping an
                  HTML `filter: url()` so the metaballs never merge there. */}
              <div className="relative flex h-28 w-full items-center justify-center">
                <svg
                  aria-hidden="true"
                  className="pointer-events-none overflow-visible"
                  width={120}
                  height={112}
                  viewBox="-60 -56 120 112"
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
                  <g
                    filter="url(#lmg-goo)"
                    fill="var(--foreground)"
                    fillOpacity={0.75}
                  >
                    <circle
                      className="lmg-a"
                      cx={0}
                      cy={0}
                      r={24}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                      }}
                    />
                    <circle
                      className="lmg-b"
                      cx={0}
                      cy={0}
                      r={24}
                      style={{
                        transformBox: "fill-box",
                        transformOrigin: "center",
                      }}
                    />
                  </g>
                </svg>
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                gooeyness=16
              </span>
            </div>
          </div>
          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd
                  className={
                    item.kind === "blur"
                      ? "font-mono text-[12px] text-fd-muted-foreground"
                      : "text-[12px] text-fd-muted-foreground"
                  }
                >
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
