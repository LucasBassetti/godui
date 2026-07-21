"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy of the real button: same rounded-rect silhouette three ways —
 * the raw spark layer, the spark cut down to a border ring, then the label
 * on top (what the Result shows). Three layers, matching the source stack.
 */

const W = 168;
const H = 44;
const CUT = 5;

const CSS = `
@keyframes sl-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes sl-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.sl-col {
  opacity: 0;
  animation: sl-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.sl-spark {
  animation: sl-spin 2.6s linear infinite;
}
.sl-static .sl-col { opacity: 1; animation: none; transform: none; }
.sl-static .sl-spark { animation: none; transform: rotate(35deg); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "spark" | "cut" | "label";
}[] = [
  {
    name: "Spark",
    desc: "conic gradient, blurred, spinning",
    kind: "spark",
  },
  {
    name: "Cut",
    desc: "solid inset that hides the middle",
    kind: "cut",
  },
  {
    name: "Label",
    desc: "text, always on top",
    kind: "label",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "cut") {
    return (
      <span className="h-3 w-8 rounded-[9px] border-2 border-[var(--foreground)]/50 bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "label") {
    return (
      <span className="h-2 w-6 rounded-full bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-8 rounded-md bg-[var(--foreground)]/70 blur-[1px] ring-1 ring-fd-border ring-inset" />
  );
}

function ButtonStage({
  spark,
  cut,
  label,
}: {
  spark?: boolean;
  cut?: boolean;
  label?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-[var(--foreground)]/15 bg-[var(--card)]"
      style={{ width: W, height: H }}
      aria-hidden="true"
    >
      {spark ? (
        <div className="absolute inset-0 overflow-hidden blur-[3px]">
          <div
            className="sl-spark absolute inset-[-60%]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--foreground) 75%, transparent) 45deg, transparent 110deg)",
            }}
          />
        </div>
      ) : null}
      {cut ? (
        <div
          className="absolute rounded-[9px] bg-[var(--card)]"
          style={{ inset: CUT }}
        />
      ) : null}
      {label ? (
        <div className="absolute inset-0 grid place-items-center">
          <span className="h-2 w-12 rounded-full bg-[var(--foreground)]/40" />
        </div>
      ) : null}
    </div>
  );
}

const COLUMNS: {
  key: string;
  caption: string;
  delay: number;
  spark?: boolean;
  cut?: boolean;
  label?: boolean;
}[] = [
  { key: "spark", caption: "spark only", delay: 0, spark: true },
  { key: "cut", caption: "spark + cut", delay: 120, spark: true, cut: true },
  {
    key: "together",
    caption: "+ label",
    delay: 240,
    spark: true,
    cut: true,
    label: true,
  },
];

export function ShimmerLayers() {
  return (
    <ScrollScene label="Anatomy" note="same button, three layers">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between ${reduced ? "sl-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="sl-col flex flex-col items-center gap-3"
                style={{ "--d": `${col.delay}ms` } as CSSProperties}
              >
                <ButtonStage
                  spark={col.spark}
                  cut={col.cut}
                  label={col.label}
                />
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {col.caption}
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
