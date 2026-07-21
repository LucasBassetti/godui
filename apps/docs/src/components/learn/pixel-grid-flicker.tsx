"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes pgf-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pgf-el { animation: pgf-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.pgf-static .pgf-el { animation: none; opacity: 1; transform: none; }
@keyframes pgf-flick {
  0%, 100% { opacity: 0.12; }
  40% { opacity: 0.55; }
  70% { opacity: 0.2; }
}
.pgf-c { animation: pgf-flick 1.6s ease-in-out infinite; }
.pgf-static .pgf-c { animation: none; opacity: 0.25; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "cell" | "dimCell";
}[] = [
  {
    name: "Chance",
    desc: "flickerChance=0.3 / second",
    kind: "cell",
  },
  {
    name: "Draw",
    desc: "opacity re-rolled when triggered",
    kind: "dimCell",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "cell") {
    return (
      <span className="size-2 rounded-[1px] bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-2 rounded-[1px] bg-[var(--foreground)]/15 ring-1 ring-fd-border ring-inset" />
  );
}

export function PixelGridFlicker() {
  return (
    <ScrollScene label="Flicker" note="P(re-roll) = chance × dt">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "pgf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            className="pgf-el grid h-36 w-full place-content-center gap-1 overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] p-6"
            style={
              {
                "--d": "0ms",
                gridTemplateColumns: "repeat(10, 0.55rem)",
              } as CSSProperties
            }
          >
            {Array.from({ length: 70 }, (_, i) => `pgf-${i}`).map((id, i) => (
              <div
                key={id}
                className="pgf-c size-2 rounded-[1px] bg-[var(--foreground)]"
                style={{ animationDelay: `${(i * 97) % 1600}ms` }}
              />
            ))}
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
