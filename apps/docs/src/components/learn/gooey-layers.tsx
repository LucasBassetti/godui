"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy of the real open FAB: same geometry three ways — blob paint only,
 * control hit-targets only, then both composited (what the Result shows).
 * Two layers, not three. Trigger is the base disc in every column.
 */

const TRIGGER = 44;
const SAT = 34;
const STEP = SAT + 14;
const SATS = [1, 2, 3] as const;

const CSS = `
@keyframes gl-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.gl-col {
  opacity: 0;
  animation: gl-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.gl-static .gl-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "blob" | "control";
}[] = [
  {
    name: "Blob layer",
    desc: "soft discs under the goo filter",
    kind: "blob",
  },
  {
    name: "Control layer",
    desc: "sharp icons + hit targets",
    kind: "control",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "blob") {
    return (
      <span className="size-3.5 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="relative flex size-3.5 items-center justify-center rounded-full border-2 border-[var(--foreground)]/50 bg-transparent ring-1 ring-fd-border ring-inset">
      <span className="size-1 rounded-full bg-[var(--foreground)]/70" />
    </span>
  );
}

function FabStage({
  blobs,
  controls,
}: {
  blobs?: boolean;
  controls?: boolean;
}) {
  const height = TRIGGER + STEP * SATS.length + 8;
  return (
    <div
      className="relative"
      style={{ width: TRIGGER, height }}
      aria-hidden="true"
    >
      {/* Satellites — same offsets as the real component (direction="up"). */}
      {SATS.map((i) => {
        const y = -STEP * i;
        return (
          <div
            key={i}
            className="absolute left-1/2"
            style={{
              width: SAT,
              height: SAT,
              bottom: (TRIGGER - SAT) / 2,
              transform: `translate(-50%, ${y}px)`,
            }}
          >
            {blobs ? (
              <div className="absolute inset-0 rounded-full bg-[var(--foreground)]/20" />
            ) : null}
            {controls ? (
              <div className="absolute inset-0 grid place-items-center rounded-full border-[2.5px] border-[var(--foreground)]/50">
                <span className="size-1.5 rounded-full bg-[var(--foreground)]/70" />
              </div>
            ) : null}
          </div>
        );
      })}

      {/* Trigger base — blob paint under, sharp face on top when controls show. */}
      <div
        className="absolute bottom-0 left-0"
        style={{ width: TRIGGER, height: TRIGGER }}
      >
        {blobs ? (
          <div className="absolute inset-0 rounded-full bg-[var(--foreground)]/20" />
        ) : null}
        {controls ? (
          <div className="absolute inset-0 grid place-items-center rounded-full bg-[var(--foreground)]">
            <span className="font-semibold text-[15px] text-[var(--background)] leading-none">
              +
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const COLUMNS: {
  key: string;
  label: string;
  delay: number;
  blobs?: boolean;
  controls?: boolean;
}[] = [
  { key: "blob", label: "blob only", delay: 0, blobs: true },
  { key: "control", label: "control only", delay: 120, controls: true },
  {
    key: "both",
    label: "together",
    delay: 240,
    blobs: true,
    controls: true,
  },
];

export function GooeyLayers() {
  return (
    <ScrollScene label="Anatomy" note="same open FAB, two layers">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-end justify-items-center gap-3 sm:gap-6 ${reduced ? "gl-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="gl-col flex flex-col items-center gap-3"
                style={{ "--d": `${col.delay}ms` } as CSSProperties}
              >
                <FabStage blobs={col.blobs} controls={col.controls} />
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {col.label}
                </p>
              </div>
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
