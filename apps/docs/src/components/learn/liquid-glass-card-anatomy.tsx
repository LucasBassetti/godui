"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Frost / sheen / rim-map — grayscale tokens only. The map plate shows a
 * neutral mid band (dashed) without borrowing the real R/G channel hues.
 */
const CSS = `
@keyframes lgca-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lgca-el { animation: lgca-in 600ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lgca-static .lgca-el { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Frost",
    desc: "backdrop-filter blur + optional url(#filter)",
    kind: "frost" as const,
  },
  {
    name: "Sheen",
    desc: "pointer-tracked radial · mix-blend-screen",
    kind: "sheen" as const,
  },
  {
    name: "Rim map",
    desc: "band=0.3 — neutral mid, bend only at edges",
    kind: "rim" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "frost") {
    return (
      <span className="h-4 w-3 rounded-xl bg-[var(--muted)]/80 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "sheen") {
    return (
      <span className="h-4 w-3 rounded-xl bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-4 rounded-md border border-[var(--foreground)]/25 border-dashed bg-transparent ring-1 ring-fd-border ring-inset" />
  );
}

export function LiquidGlassCardAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="frost · sheen · rim map">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "lgca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full items-end justify-center gap-3 sm:gap-5">
            <div
              className="lgca-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <div className="relative h-28 w-20 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-sm">
                <div className="absolute inset-0 bg-[var(--muted)]/80 backdrop-blur-[2px]" />
                <div className="absolute inset-x-4 bottom-5 h-2 rounded-full bg-[var(--foreground)]/25" />
                <div className="absolute inset-x-6 bottom-9 h-1.5 rounded-full bg-[var(--foreground)]/15" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                frost
              </span>
            </div>

            <div
              className="lgca-el flex flex-col items-center gap-2"
              style={{ "--d": "100ms" } as CSSProperties}
            >
              <div className="relative h-28 w-20 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-sm">
                <div className="absolute inset-0 bg-[var(--muted)]/40" />
                <div
                  className="absolute inset-0 mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--foreground) 45%, transparent), transparent 45%)",
                  }}
                />
                <div className="absolute inset-x-4 bottom-5 h-2 rounded-full bg-[var(--foreground)]/25" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                sheen
              </span>
            </div>

            <div
              className="lgca-el flex flex-col items-center gap-2"
              style={{ "--d": "200ms" } as CSSProperties}
            >
              <div className="relative h-28 w-20 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-sm">
                {/* X ramp */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--foreground) 0%, transparent 35%, transparent 65%, var(--foreground) 100%)",
                    opacity: 0.35,
                  }}
                />
                {/* Y ramp */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--foreground) 0%, transparent 35%, transparent 65%, var(--foreground) 100%)",
                    opacity: 0.25,
                  }}
                />
                <div className="absolute inset-[28%] rounded-md border border-[var(--foreground)]/25 border-dashed" />
              </div>
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                rim map
              </span>
            </div>
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            Same rounded box, three jobs. The dashed mid on the map is the
            neutral band — no bend under your content. (Real maps encode X in R
            and Y in G; diagrams stay grayscale.)
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
