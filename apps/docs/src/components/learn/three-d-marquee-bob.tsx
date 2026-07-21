"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Each column gets its own `animate={{ y: colIndex % 2 === 0 ? [0,-40,0] :
 * [0,40,0] }}` on a `duration: 10 + colIndex` — so no two columns ever repeat
 * in sync, and the alternating direction reads as a slow, ambient churn
 * rather than one wave. Durations are compressed here (the real component
 * runs 10–13s) so the loop is visible without a long wait.
 */
const COLS = 4;
const ROWS = 3;
const EASE = "cubic-bezier(0.65,0,0.35,1)";

const CSS = `
@keyframes tdmb-up { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
@keyframes tdmb-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(18px); } }
.tdmb-col-0, .tdmb-col-2 { animation: tdmb-up var(--dur) ${EASE} infinite; }
.tdmb-col-1, .tdmb-col-3 { animation: tdmb-down var(--dur) ${EASE} infinite; }
.tdmb-static .tdmb-col-0, .tdmb-static .tdmb-col-1,
.tdmb-static .tdmb-col-2, .tdmb-static .tdmb-col-3 { animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "tile" | "alt";
}[] = [
  {
    name: "Column loop",
    desc: "y [0,∓40,0], ease [0.65,0,0.35,1]",
    kind: "tile",
  },
  {
    name: "Alternating direction",
    desc: "colIndex % 2 === 0 ? up-first : down-first",
    kind: "alt",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "alt") {
    return (
      <span className="flex items-center gap-0.5">
        <span className="size-2.5 rounded-[3px] bg-[var(--foreground)]/25 [transform:rotateX(55deg)_rotateZ(-45deg)]" />
        <span className="size-2.5 translate-y-1 rounded-[3px] bg-[var(--foreground)]/25 [transform:rotateX(55deg)_rotateZ(-45deg)]" />
      </span>
    );
  }
  return (
    <span className="flex h-5 w-7 items-center justify-center">
      <span className="size-3.5 rounded-[3px] bg-[var(--foreground)]/25 [transform:rotateX(55deg)_rotateZ(-45deg)]" />
    </span>
  );
}

export function ThreeDMarqueeBob() {
  return (
    <ScrollScene
      label="The motion"
      note="duration 10 + colIndex seconds, per column"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className={`relative flex h-52 w-full items-center justify-center overflow-hidden rounded-sm border border-dashed border-[var(--foreground)]/25 [perspective:1200px] ${reduced ? "tdmb-static" : ""}`}
          >
            <div className="w-[140%] scale-110">
              <div
                key={cycle}
                className="grid w-full grid-cols-4 gap-2.5 [transform:rotateX(55deg)_rotateZ(-45deg)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {Array.from({ length: COLS }).map((_, col) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: columns are positional and static
                    key={col}
                    className={`tdmb-col-${col} flex flex-col gap-2.5`}
                    style={{ "--dur": `${2.4 + col * 0.4}s` } as CSSProperties}
                  >
                    {Array.from({ length: ROWS }).map((_, row) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional and static
                        key={row}
                        className="aspect-square w-full rounded-md bg-[var(--foreground)]/25"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
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
