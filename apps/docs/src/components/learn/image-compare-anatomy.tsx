"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Same open comparison three ways: after-layer paint only, before-layer
 * paint only, then both composited with the divider + handle — what the
 * Result panel actually shows. The "together" split here is a static 50%
 * width, never animated; the real component clips the before layer with
 * `clip-path`, which the drag scene covers separately without touching it.
 */
const CSS = `
@keyframes ica-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ica-col { opacity: 0; animation: ica-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both; }
.ica-static .ica-col { opacity: 1; animation: none; transform: none; }
`;

function Stage({ show }: { show: "after" | "before" | "both" }) {
  return (
    <div className="relative h-24 w-32 overflow-hidden rounded-xl border border-white/10">
      {(show === "after" || show === "both") && (
        <div className="absolute inset-0 bg-[var(--muted)]" />
      )}
      {show === "both" ? (
        <div className="absolute inset-y-0 left-0 w-1/2 bg-[var(--foreground)]/30" />
      ) : show === "before" ? (
        <div className="absolute inset-0 bg-[var(--foreground)]/30" />
      ) : null}
      {show === "both" && (
        <>
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/90" />
          <span className="absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/30" />
        </>
      )}
    </div>
  );
}

const COLUMNS: {
  key: "after" | "before" | "both";
  label: string;
  delay: number;
}[] = [
  { key: "after", label: "after only", delay: 0 },
  { key: "before", label: "before only", delay: 120 },
  { key: "both", label: "together", delay: 240 },
];

const LEGEND: {
  name: string;
  desc: string;
  kind: "after" | "before" | "handle";
}[] = [
  {
    name: "After",
    desc: "base layer, always full",
    kind: "after",
  },
  {
    name: "Before",
    desc: "clip-path: inset(...) on top",
    kind: "before",
  },
  {
    name: "Handle",
    desc: "role=slider, drag or arrow keys",
    kind: "handle",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "handle") {
    return (
      <span className="size-3 rounded-full border-2 border-white bg-white/30 ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "before") {
    return (
      <span className="h-3 w-5 rounded-lg bg-[var(--foreground)]/30 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-5 rounded-lg bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

export function ImageCompareAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="two layers, one boundary">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-end justify-items-center gap-3 sm:gap-6 ${reduced ? "ica-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="ica-col flex flex-col items-center gap-3"
                style={{ "--d": `${col.delay}ms` } as CSSProperties}
              >
                <Stage show={col.key} />
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {col.label}
                </p>
              </div>
            ))}
          </div>

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
