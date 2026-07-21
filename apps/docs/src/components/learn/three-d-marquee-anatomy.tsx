"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The tilt is two transforms, not a 3D library: the container gets
 * `[perspective:1200px]`, and the grid inside it is
 * `rotateX(55deg) rotateZ(-45deg)` with `transformStyle: preserve-3d`. Every
 * tile is a flat `<img>` — the illusion lives entirely in those two
 * rotations plus a 140%-width, 110%-scale overscan that keeps the tilted
 * plane covering the container's corners.
 */
const COLS = 4;
const ROWS = 3;

const CSS = `
@keyframes tdma-tile { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
.tdma-tile { opacity: 0; animation: tdma-tile 480ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.tdma-static .tdma-tile { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "viewport" | "tile";
}[] = [
  {
    name: "Viewport",
    desc: "overflow clip · [perspective:1200px]",
    kind: "viewport",
  },
  {
    name: "Tile grid",
    desc: "rotateX(55deg) rotateZ(-45deg)",
    kind: "tile",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "viewport") {
    return (
      <span className="flex h-5 w-9 items-center justify-center rounded-sm border border-dashed border-[var(--foreground)]/35">
        <span className="size-2 rounded-[2px] bg-[var(--foreground)]/15" />
      </span>
    );
  }
  // Same fill as diagram tiles; slight isometric so it reads as the diamond plane.
  return (
    <span className="flex h-5 w-9 items-center justify-center">
      <span className="size-3.5 rounded-[3px] bg-[var(--foreground)]/25 [transform:rotateX(55deg)_rotateZ(-45deg)]" />
    </span>
  );
}

export function ThreeDMarqueeAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="two rotations, no 3D library">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            className={`relative flex h-52 w-full items-center justify-center overflow-hidden rounded-sm border border-dashed border-[var(--foreground)]/25 [perspective:1200px] ${reduced ? "tdma-static" : ""}`}
          >
            {/* Scale/width on a wrapper — same as the component. Putting
                scale-* on the rotated grid loses it to the arbitrary
                [transform:…] and the plane underfills the clip (diamond). */}
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
                    className="flex flex-col gap-2.5"
                  >
                    {Array.from({ length: ROWS }).map((_, row) => (
                      <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: rows are positional and static
                        key={row}
                        className="tdma-tile aspect-square w-full rounded-md bg-[var(--foreground)]/25"
                        style={
                          {
                            "--d": `${(col * ROWS + row) * 30}ms`,
                          } as CSSProperties
                        }
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
