"use client";

import type { CSSProperties, ReactNode } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Magic Tab anatomy as a front-facing split (same silhouette three ways) —
 * not an in-rail explode. Exploding ±28px inside the muted track made the
 * middle tab look broken; this matches the gooey-layers teaching pattern:
 * unselected (flat) | the three spans separated | assembled selected lift.
 */

const TAB_W = 96;
const TAB_H = 44;
const GAP = 14;

const CSS = `
@keyframes mta-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
.mta-col {
  opacity: 0;
  animation: mta-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.mta-static .mta-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "front" | "edge" | "shadow";
}[] = [
  {
    name: "Front",
    desc: "label face — lifts −4px when selected",
    kind: "front",
  },
  {
    name: "Edge",
    desc: "gradient wall, fakes the 3D side",
    kind: "edge",
  },
  {
    name: "Shadow",
    desc: "blurred, grounds the raised tab",
    kind: "shadow",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "front") {
    return (
      <span className="h-3 w-6 rounded-lg border border-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "edge") {
    return (
      <span className="h-3 w-6 rounded-lg bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-6 rounded-lg bg-black/60 ring-1 ring-fd-border ring-inset" />
  );
}

function TokenBar({ className = "" }: { className?: string }) {
  return (
    <span
      className={`h-2 w-12 rounded-full bg-[var(--foreground)]/30 ${className}`}
    />
  );
}

/** Unselected: front only — shadow/edge stay at opacity-0 in the real component. */
function FlatTab() {
  return (
    <div
      className="relative flex items-center justify-center rounded-xl"
      style={{ width: TAB_W, height: TAB_H }}
    >
      <TokenBar className="bg-[var(--foreground)]/25" />
    </div>
  );
}

/** Separated sandwich — same three absolute spans, vertically spaced so each is readable. */
function ExplodedTab() {
  const height = TAB_H * 3 + GAP * 2;
  return (
    <div
      className="relative"
      style={{ width: TAB_W, height }}
      aria-hidden="true"
    >
      <span
        className="absolute left-0 rounded-xl bg-black/50 blur-[5px]"
        style={{ width: TAB_W, height: TAB_H, top: TAB_H * 2 + GAP * 2 }}
      />
      <span
        className="absolute left-0 rounded-xl bg-[var(--muted)]"
        style={{ width: TAB_W, height: TAB_H, top: TAB_H + GAP }}
      />
      <span
        className="absolute left-0 flex items-center justify-center rounded-xl border border-border bg-[var(--card)]"
        style={{ width: TAB_W, height: TAB_H, top: 0 }}
      >
        <TokenBar />
      </span>
    </div>
  );
}

/** Assembled selected state — real −4px face lift over edge + shadow. */
function AssembledTab() {
  return (
    <div className="relative" style={{ width: TAB_W, height: TAB_H + 6 }}>
      <span
        className="absolute inset-x-0 bottom-0 rounded-xl bg-black/40 blur-[4px]"
        style={{ height: TAB_H, transform: "translateY(2px)" }}
      />
      <span
        className="absolute inset-x-0 bottom-0 rounded-xl bg-[var(--muted)]"
        style={{ height: TAB_H }}
      />
      <span
        className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-xl border border-border bg-[var(--card)]"
        style={{ height: TAB_H, transform: "translateY(-4px)" }}
      >
        <TokenBar className="bg-[var(--foreground)]/55" />
      </span>
    </div>
  );
}

const COLUMNS: {
  key: string;
  label: string;
  delay: number;
  Stage: () => ReactNode;
}[] = [
  { key: "flat", label: "unselected", delay: 0, Stage: FlatTab },
  { key: "layers", label: "three spans", delay: 120, Stage: ExplodedTab },
  { key: "together", label: "selected", delay: 240, Stage: AssembledTab },
];

export function MagicTabAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="same tab · three reads">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-end justify-items-center gap-3 sm:gap-6 ${reduced ? "mta-static" : ""}`}
          >
            {COLUMNS.map(({ key, label, delay, Stage }) => (
              <div
                key={key}
                className="mta-col flex flex-col items-center gap-3"
                style={{ "--d": `${delay}ms` } as CSSProperties}
              >
                <Stage />
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {label}
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
