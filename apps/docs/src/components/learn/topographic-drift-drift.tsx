"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Contours slide as z advances — same silhouette, shifted field. Caption
 * ties the motion to the real tick line.
 */
const CSS = `
@keyframes tdd-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tdd-el { animation: tdd-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.tdd-static .tdd-el { animation: none; opacity: 1; transform: none; }

@keyframes tdd-shift {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(14px); }
}
.tdd-map { animation: tdd-shift 3.4s ease-in-out infinite; }
.tdd-static .tdd-map { animation: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "offset" | "lifecycle";
}[] = [
  {
    name: "z-offset",
    desc: "z += 0.0015 × speed",
    kind: "offset",
  },
  {
    name: "Lifecycle",
    desc: "IO · visibility · reduced freeze",
    kind: "lifecycle",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "lifecycle") {
    return (
      <span className="h-8 w-12 rounded-2xl border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 12"
      className="h-3 w-8 text-[var(--foreground)]"
      fill="none"
    >
      <path
        d="M0 6 Q8 2 16 6 T32 6"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity={0.75}
      />
      <path
        d="M0 9 Q8 6 16 9 T32 9"
        stroke="currentColor"
        strokeWidth="1"
        opacity={0.45}
      />
    </svg>
  );
}

export function TopographicDriftDrift() {
  return (
    <ScrollScene label="Drift" note="z += 0.0015 × speed each frame">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "tdd-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className="tdd-el relative h-40 w-full overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]"
            style={{ "--d": "0ms" } as CSSProperties}
          >
            <div className="tdd-map absolute inset-0 flex items-center justify-center">
              <svg
                aria-hidden="true"
                viewBox="0 0 240 110"
                className="w-full px-2 text-[var(--foreground)]"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  opacity={0.75}
                  d="M-20 55 Q20 22 60 55 T140 55 T220 55 T280 55"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity={0.45}
                  d="M-20 72 Q20 45 60 72 T140 72 T220 72 T280 72"
                />
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.9"
                  opacity={0.28}
                  d="M-20 38 Q20 12 60 38 T140 38 T220 38 T280 38"
                />
              </svg>
            </div>
          </div>

          <p className="max-w-[40ch] text-center text-[13px] text-fd-muted-foreground">
            No path morphing — the tick advances{" "}
            <span className="font-mono text-[12px]">z</span>,{" "}
            <span className="font-mono text-[12px]">sampleField()</span> runs
            again, and marching squares redraw. Offscreen / hidden / reduced
            motion stop the loop.
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd
                  className={
                    item.kind === "offset"
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
