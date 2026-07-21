"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Two independent `OrbitingCircles` stacked on the same center — different
 * `radius`, `duration`, and `reverse` — the exact geometry of the "Reversed
 * inner ring" example. Each ring is its own component instance; they only
 * happen to share a center point.
 */
const INNER = { radius: 52, count: 3, duration: 4.8 };
const OUTER = { radius: 94, count: 4, duration: 8.4, reverse: true };

function ring(count: number) {
  return Array.from({ length: count }, (_, i) => (360 / count) * i);
}

const CSS = `
@keyframes orr-inner { to { transform: rotate(360deg); } }
@keyframes orr-outer { to { transform: rotate(-360deg); } }
@keyframes orr-slot-in  { to { transform: rotate(-360deg); } }
@keyframes orr-slot-out { to { transform: rotate(360deg); } }
.orr-inner-ring { animation: orr-inner ${INNER.duration}s linear infinite; }
.orr-outer-ring { animation: orr-outer ${OUTER.duration}s linear infinite; }
.orr-slot-in  { animation: orr-slot-in ${INNER.duration}s linear infinite; }
.orr-slot-out { animation: orr-slot-out ${OUTER.duration}s linear infinite; }
.orr-static .orr-inner-ring,
.orr-static .orr-outer-ring,
.orr-static .orr-slot-in,
.orr-static .orr-slot-out { animation: none; transform: none; }
`;

const LEGEND = [
  {
    name: "Inner ring",
    desc: `radius ${INNER.radius} · ${INNER.duration}s · forward`,
    kind: "inner" as const,
  },
  {
    name: "Outer ring",
    desc: `radius ${OUTER.radius} · ${OUTER.duration}s · reverse`,
    kind: "outer" as const,
  },
  {
    name: "Center",
    desc: "shared anchor — each ring is its own instance",
    kind: "center" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "center") {
    return (
      <span className="flex h-3.5 w-6 items-center justify-center rounded-xl bg-[var(--foreground)]/10 ring-1 ring-fd-border ring-inset">
        <span className="h-1 w-4 rounded-full bg-[var(--foreground)]/40" />
      </span>
    );
  }
  if (kind === "outer") {
    return (
      <span className="size-4 rounded-full border border-dashed border-[var(--foreground)]/15 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="size-3 rounded-full border border-dashed border-[var(--foreground)]/15 ring-1 ring-fd-border ring-inset" />
  );
}

function Slots({
  radius,
  angles,
  ringClass,
  slotClass,
  size,
}: {
  radius: number;
  angles: number[];
  ringClass: string;
  slotClass: string;
  size: number;
}) {
  return (
    <div className={`absolute inset-0 ${ringClass}`}>
      {angles.map((angle, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-count ring
          key={i}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: size,
            height: size,
            marginLeft: -size / 2,
            marginTop: -size / 2,
            transform: `rotate(${angle}deg) translateY(-${radius}px)`,
          }}
        >
          <div
            className={`flex size-full items-center justify-center ${slotClass}`}
          >
            <span className="size-full rounded-full border border-fd-border bg-[var(--card)] shadow-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function OrbitingCirclesRings() {
  return (
    <ScrollScene label="Dual rings" note="two instances, one shared center">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "orr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative size-[220px]">
            <div
              aria-hidden="true"
              className="absolute rounded-full border border-dashed border-[var(--foreground)]/15"
              style={
                {
                  left: "50%",
                  top: "50%",
                  width: OUTER.radius * 2,
                  height: OUTER.radius * 2,
                  marginLeft: -OUTER.radius,
                  marginTop: -OUTER.radius,
                } as CSSProperties
              }
            />
            <div
              aria-hidden="true"
              className="absolute rounded-full border border-dashed border-[var(--foreground)]/15"
              style={
                {
                  left: "50%",
                  top: "50%",
                  width: INNER.radius * 2,
                  height: INNER.radius * 2,
                  marginLeft: -INNER.radius,
                  marginTop: -INNER.radius,
                } as CSSProperties
              }
            />

            <Slots
              radius={INNER.radius}
              angles={ring(INNER.count)}
              ringClass="orr-inner-ring"
              slotClass="orr-slot-in"
              size={30}
            />
            <Slots
              radius={OUTER.radius}
              angles={ring(OUTER.count)}
              ringClass="orr-outer-ring"
              slotClass="orr-slot-out"
              size={34}
            />

            <div
              className="absolute flex items-center justify-center rounded-xl bg-[var(--foreground)]/10"
              style={{
                left: "50%",
                top: "50%",
                width: 56,
                height: 28,
                marginLeft: -28,
                marginTop: -14,
              }}
            >
              <span className="h-1.5 w-7 rounded-full bg-[var(--foreground)]/40" />
            </div>
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
