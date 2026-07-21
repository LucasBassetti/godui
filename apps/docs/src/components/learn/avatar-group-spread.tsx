"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Two springs, two triggers, same avatars. Hovering *the group* flips every
 * avatar's `variants` from `rest` (`marginLeft: -12`) to `spread`
 * (`marginLeft: 4`) on a `{ stiffness: 520, damping: 32 }` spring — that's
 * the fan-out. Hovering *one avatar* additionally fires its own `whileHover:
 * { y: -6, scale: 1.06 }` on the same spring config, independent of whether
 * the group is spread. Illustrated here as translateX (the group spread) on
 * an outer layer and translateY/scale (the one-avatar lift) on an inner
 * layer — in the real component both live on the same node and Framer
 * resolves hover over variant per property.
 */
const COUNT = 5;
const LIFT_INDEX = 2;
const DELTA = 16;

const CSS = `
@keyframes ags-spread {
  0%, 8%   { transform: translateX(0); }
  30%, 70% { transform: translateX(var(--tx)); }
  92%,100% { transform: translateX(0); }
}
@keyframes ags-lift {
  0%, 34%, 76%, 100% { transform: translateY(0) scale(1); }
  46%, 64%           { transform: translateY(-6px) scale(1.06); }
}
.ags-outer { animation: ags-spread 4s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.ags-lift  { animation: ags-lift 4s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.ags-static .ags-outer,
.ags-static .ags-lift { animation: none; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "spread" | "lift";
}[] = [
  {
    name: "Group spread",
    desc: "marginLeft -12 → 4, stiffness 520 · damping 32",
    kind: "spread",
  },
  {
    name: "Avatar lift",
    desc: "y: -6, scale: 1.06 on the hovered avatar only",
    kind: "lift",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "spread") {
    return (
      <span className="relative h-3 w-7">
        <span className="absolute inset-y-0 left-0 size-3 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
        <span className="absolute inset-y-0 left-2 size-3 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
        <span className="absolute inset-y-0 left-4 size-3 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
      </span>
    );
  }
  return (
    <span className="relative size-3 rounded-full bg-[var(--muted)] ring-2 ring-background ring-inset [transform:translateY(-2px)_scale(1.06)]" />
  );
}

export function AvatarGroupSpread() {
  return (
    <ScrollScene label="The motion" note="group spread · one avatar also lifts">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${
            reduced ? "ags-static" : ""
          }`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex items-center py-3">
            {Array.from({ length: COUNT }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed avatar row
                key={i}
                className="ags-outer"
                style={
                  {
                    marginLeft: i === 0 ? 0 : "-12px",
                    zIndex: i,
                    "--tx": `${i * DELTA}px`,
                  } as CSSProperties
                }
              >
                <div
                  className={`size-11 rounded-full bg-[var(--muted)] shadow-sm ring-2 ring-background ${
                    i === LIFT_INDEX ? "ags-lift" : ""
                  }`}
                />
              </div>
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'{ type: "spring", stiffness: 520, damping: 32 }'}
          </p>

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
