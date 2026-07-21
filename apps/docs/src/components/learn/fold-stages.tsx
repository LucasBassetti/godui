"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * The real geometry: a front face on a hinge at its top edge, tilting back
 * in 3D space to reveal a back layer underneath. Idle keeps it flat; hover,
 * focus-visible, and the loading status all fold it to the same 35deg.
 */

const W = 132;
const H = 44;

const CSS = `
@keyframes fs-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fs-fold {
  from { transform: rotateX(0deg); }
  to   { transform: rotateX(35deg); }
}
.fs-col {
  opacity: 0;
  animation: fs-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.fs-fold-front {
  animation: fs-fold 500ms cubic-bezier(0.3, 0.7, 0.4, 1) var(--d) both;
}
.fs-static .fs-col { opacity: 1; animation: none; transform: none; }
.fs-static .fs-fold-front { animation: none; transform: rotateX(35deg); }
`;

function FoldStage({ folded, loading }: { folded: boolean; loading: boolean }) {
  return (
    <div
      className="[perspective:700px]"
      style={{ width: W, height: H }}
      aria-hidden="true"
    >
      <div
        className="relative [transform-style:preserve-3d]"
        style={{ width: W, height: H }}
      >
        {/* Back layer — tint always present, bar only while loading. */}
        <div className="absolute inset-0 -z-[1] overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-[var(--foreground)]/[0.07]" />
          {loading ? (
            <div
              className="absolute top-0 left-0 h-full bg-[var(--foreground)]/25"
              style={{ width: "55%" }}
            />
          ) : null}
        </div>
        {/* Front face — hinged at the top edge. */}
        <div
          className={`relative grid h-full w-full place-items-center rounded-lg border border-[var(--foreground)]/15 bg-[var(--card)] [transform-origin:top_center] ${
            folded ? "fs-fold-front" : ""
          }`}
          style={!folded ? { transform: "rotateX(0deg)" } : undefined}
        />
      </div>
    </div>
  );
}

const COLUMNS: {
  key: string;
  caption: string;
  delay: number;
  folded: boolean;
  loading: boolean;
}[] = [
  {
    key: "idle",
    caption: "idle — rotateX(0deg)",
    delay: 0,
    folded: false,
    loading: false,
  },
  {
    key: "hover",
    caption: "hover / focus — rotateX(35deg)",
    delay: 150,
    folded: true,
    loading: false,
  },
  {
    key: "loading",
    caption: "loading — rotateX(35deg)",
    delay: 300,
    folded: true,
    loading: true,
  },
];

export function FoldStages() {
  return (
    <ScrollScene label="Anatomy" note="three triggers, one hinge">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between ${reduced ? "fs-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="fs-col flex flex-col items-center gap-3"
                style={{ "--d": `${col.delay}ms` } as CSSProperties}
              >
                <FoldStage folded={col.folded} loading={col.loading} />
                <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
                  {col.caption}
                </p>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-3.5 w-6 rounded-lg border border-[var(--foreground)]/15 bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Front face
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                hinged at the top, folds back
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="relative h-3.5 w-6 overflow-hidden rounded-lg bg-[var(--foreground)]/[0.07] ring-1 ring-fd-border ring-inset">
                <span className="absolute inset-y-0 left-0 w-[55%] bg-[var(--foreground)]/25" />
              </span>
              <dt className="font-medium text-[13px] text-fd-foreground">
                Back layer
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                tint always there, bar while loading
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
