"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Without the inner counter-rotation, a slot inherits the ring's spin and
 * tumbles as it travels. With it, `rotate: [-angle, -angle - 360]` runs on
 * the *same* clock as the ring's `rotate: 360`, so the two cancel out and
 * the slot's content stays upright the whole orbit. Both panels share one
 * ring rotation; only the slot's own transform differs.
 */
const CSS = `
@keyframes occ-ring { to { transform: rotate(360deg); } }
.occ-ring { animation: occ-ring 6s linear infinite; }

/* The counter-rotation: same duration and easing as the ring, opposite
   direction, so the two exactly cancel and the content stays upright. */
@keyframes occ-counter { to { transform: rotate(-360deg); } }
.occ-counter { animation: occ-counter 6s linear infinite; }

.occ-static .occ-ring,
.occ-static .occ-counter { animation: none; transform: none; }
`;

const LEGEND = [
  {
    name: "Without",
    desc: "no inner transform — content tumbles with the ring",
    kind: "without" as const,
  },
  {
    name: "With",
    desc: "rotate([-angle, -angle-360]) cancels the ring exactly",
    kind: "with" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "with") {
    return (
      <span className="relative flex size-4 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] shadow-sm ring-1 ring-fd-border ring-inset">
        <span className="h-1.5 w-4 rounded-full bg-[var(--foreground)]/50" />
      </span>
    );
  }
  return (
    <span className="relative flex size-4 items-center justify-center rounded-lg border border-fd-border bg-[var(--card)] shadow-sm ring-1 ring-fd-border ring-inset [transform:rotate(12deg)]">
      <span className="h-1.5 w-4 rounded-full bg-[var(--foreground)]/50 [transform:rotate(-12deg)]" />
    </span>
  );
}

function Panel({
  caption,
  counter,
  delay,
}: {
  caption: string;
  counter: boolean;
  delay: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-32">
        <div
          className="occ-ring absolute inset-0"
          style={{ "--d": delay } as CSSProperties}
        >
          <div
            className="absolute rounded-lg border border-fd-border bg-[var(--card)] shadow-sm"
            style={{
              left: "50%",
              top: 0,
              width: 34,
              height: 34,
              marginLeft: -17,
            }}
          >
            <div
              className={`flex size-full items-center justify-center ${counter ? "occ-counter" : ""}`}
            >
              <span className="h-1.5 w-4 rounded-full bg-[var(--foreground)]/50" />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-dashed border-[var(--foreground)]/20"
        />
      </div>
      <p className="font-mono text-[11px] text-fd-muted-foreground">
        {caption}
      </p>
    </div>
  );
}

export function OrbitingCirclesCounter() {
  return (
    <ScrollScene label="The counter-rotation" note="without vs. with">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "occ-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex items-center gap-10">
            <Panel caption="without — tumbles" counter={false} delay="0ms" />
            <Panel caption="with — stays upright" counter={true} delay="0ms" />
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
