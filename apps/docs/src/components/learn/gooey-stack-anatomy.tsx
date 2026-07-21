"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three DOM layers sit on top of each other at every card position: a
 * goo-filtered merge surface (behind), a crisp native surface (borders), and
 * the unfiltered content (always sharp). Same two-card stack, three ways.
 */
const CARD_W = 108;
const CARD_H = 40;
const NECK = 10;

const CSS = `
@keyframes gsa-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.gsa-col { opacity: 0; animation: gsa-in 640ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.gsa-static .gsa-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Merge surface",
    desc: "blurred silhouettes, fused by the goo filter",
    swatch: "bg-[var(--foreground)]/25 blur-[2px]",
  },
  {
    name: "Native surface",
    desc: "crisp bg-card + border, pixel-perfect at rest",
    swatch: "border border-[var(--foreground)]/50 bg-transparent",
  },
  {
    name: "Content",
    desc: "your children — never filtered, never faded flat",
    swatch: "bg-[var(--foreground)]/70",
  },
];

function StackPair({
  merge,
  native,
  content,
}: {
  merge?: boolean;
  native?: boolean;
  content?: boolean;
}) {
  return (
    <div
      className="relative"
      style={{ width: CARD_W, height: CARD_H * 2 + NECK }}
      aria-hidden="true"
    >
      {/* Upper card, necked toward the anchor. */}
      <div className="absolute inset-x-0 top-0" style={{ height: CARD_H }}>
        {merge ? (
          <div className="absolute inset-0 rounded-[14px] bg-[var(--foreground)]/25 blur-[2px]" />
        ) : null}
        {native ? (
          <div className="absolute inset-0 rounded-[14px] border border-[var(--foreground)]/50 bg-[var(--card)]" />
        ) : null}
        {content ? (
          <div className="absolute inset-0 flex items-center px-3.5">
            <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/70" />
          </div>
        ) : null}
      </div>
      {/* Anchor card, pinned to the bottom. */}
      <div className="absolute inset-x-0 bottom-0" style={{ height: CARD_H }}>
        {merge ? (
          <div className="absolute inset-0 rounded-[14px] bg-[var(--foreground)]/25 blur-[2px]" />
        ) : null}
        {native ? (
          <div className="absolute inset-0 rounded-[14px] border border-[var(--foreground)]/50 bg-[var(--card)]" />
        ) : null}
        {content ? (
          <div className="absolute inset-0 flex items-center px-3.5">
            <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/70" />
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
  merge?: boolean;
  native?: boolean;
  content?: boolean;
}[] = [
  { key: "merge", label: "merge surface", delay: 0, merge: true },
  { key: "native", label: "native surface", delay: 120, native: true },
  {
    key: "together",
    label: "together",
    delay: 240,
    native: true,
    content: true,
  },
];

export function GooeyStackAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="same two cards, three layers">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-end justify-items-center gap-3 sm:gap-6 ${reduced ? "gsa-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="gsa-col flex flex-col items-center gap-3"
                style={{ "--d": `${col.delay}ms` } as CSSProperties}
              >
                <StackPair
                  merge={col.merge}
                  native={col.native}
                  content={col.content}
                />
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {col.label}
                </p>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
                />
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
