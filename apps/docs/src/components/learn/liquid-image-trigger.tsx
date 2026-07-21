"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Target writers: hover sets strength×0.5, leave → 0, always mode holds
 * strength×0.45, and pointer velocity briefly boosts toward strength.
 * Diagram stays grayscale — the subject is the target ladder, not color.
 */
const CSS = `
@keyframes lit-hover {
  0%, 12%  { transform: scaleY(0.05); }
  28%, 48% { transform: scaleY(0.5); }
  62%, 100%{ transform: scaleY(0.05); }
}
@keyframes lit-always {
  0%, 100% { transform: scaleY(0.45); }
}
@keyframes lit-boost {
  0%, 40%  { transform: scaleY(0.5); opacity: 0.35; }
  52%      { transform: scaleY(1);    opacity: 1; }
  70%, 100%{ transform: scaleY(0.5); opacity: 0.35; }
}
@keyframes lit-cursor {
  0%, 40%  { transform: translate(0, 0); }
  52%      { transform: translate(18px, -10px); }
  70%, 100%{ transform: translate(6px, -2px); }
}
.lit-hover  { animation: lit-hover 4.2s ease-in-out infinite; transform-origin: bottom center; }
.lit-always { animation: lit-always 4.2s linear infinite; transform-origin: bottom center; }
.lit-boost  { animation: lit-boost 4.2s ease-in-out infinite; transform-origin: bottom center; }
.lit-cursor { animation: lit-cursor 4.2s ease-in-out infinite; }
.lit-static .lit-hover  { animation: none; transform: scaleY(0.5); }
.lit-static .lit-always { animation: none; transform: scaleY(0.45); }
.lit-static .lit-boost  { animation: none; transform: scaleY(0.5); opacity: 0.35; }
.lit-static .lit-cursor { animation: none; transform: none; }
`;

const COLS = [
  {
    name: "Hover",
    desc: "enter → strength×0.5 · leave → 0",
    bar: "lit-hover",
    mark: "50%",
  },
  {
    name: "Always",
    desc: "target held at strength×0.45",
    bar: "lit-always",
    mark: "45%",
  },
  {
    name: "Velocity",
    desc: "boost = min(strength, 0.5s + speed×60)",
    bar: "lit-boost",
    mark: "100%",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof COLS)[number]["name"] }) {
  if (kind === "Velocity") {
    return (
      <span className="relative h-4 w-3">
        <span className="absolute inset-x-0 bottom-0 h-full w-2 rounded-md bg-[var(--foreground)]/40" />
        <span className="absolute top-0 right-0 size-2 rounded-full border border-fd-border bg-[var(--muted)] shadow-sm" />
      </span>
    );
  }
  return (
    <span className="h-4 w-2 rounded-md bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset" />
  );
}

export function LiquidImageTrigger() {
  return (
    <ScrollScene label="Targets" note="hover · always · velocity boost">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[460px] flex-col items-center gap-9 ${reduced ? "lit-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 gap-4">
            {COLS.map((col) => (
              <div key={col.name} className="flex flex-col items-center gap-3">
                <div className="relative flex h-36 w-14 items-end justify-center rounded-xl border border-fd-border bg-[var(--card)] p-2">
                  <div
                    className={`w-8 rounded-md bg-[var(--foreground)]/40 ${col.bar}`}
                    style={{ height: "100%" } as CSSProperties}
                  />
                  {col.name === "Velocity" ? (
                    <span
                      aria-hidden="true"
                      className="lit-cursor absolute top-3 right-1 size-2.5 rounded-full border border-fd-border bg-[var(--muted)] shadow-sm"
                    />
                  ) : null}
                </div>
                <span className="font-mono text-[10px] text-fd-muted-foreground">
                  {col.mark}
                </span>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {COLS.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.name} />
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
