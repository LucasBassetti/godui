"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Two independent springs, looped: the pin mounts with `{ stiffness: 520,
 * damping: 32 }` (a quick, slightly-overshooting pop), then the panel opens
 * on a softer `{ stiffness: 320, damping: 32, mass: 0.9 }` — scale + y +
 * opacity together, `origin-top-left` so it grows out of the pin's corner,
 * never the panel's own center.
 */
const CSS = `
@keyframes cps-pin {
  0%, 4%    { transform: scale(0); }
  16%       { transform: scale(1.1); }
  24%, 100% { transform: scale(1); }
}
@keyframes cps-pop {
  0%, 24%   { opacity: 0; transform: scale(0.85) translateY(4px); }
  40%       { opacity: 1; transform: scale(1.05) translateY(-1px); }
  50%, 78%  { opacity: 1; transform: scale(1) translateY(0); }
  90%, 100% { opacity: 0; transform: scale(0.85) translateY(4px); }
}
.cps-pin { animation: cps-pin 4.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.cps-pop { transform-origin: top left; animation: cps-pop 4.6s cubic-bezier(0.34,1.56,0.64,1) infinite; }
.cps-static .cps-pin { animation: none; transform: scale(1); }
.cps-static .cps-pop { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "pin" | "panel";
}[] = [
  {
    name: "Pin spring",
    desc: "stiffness: 520, damping: 32 — snaps in first",
    kind: "pin",
  },
  {
    name: "Panel spring",
    desc: "stiffness: 320, damping: 32, mass: 0.9 — softer, follows",
    kind: "panel",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pin") {
    return (
      <span className="size-3 rounded-full rounded-bl-sm bg-[var(--foreground)]/70 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3 w-6 rounded-xl border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
  );
}

export function CommentPinSpring() {
  return (
    <ScrollScene
      label="The motion"
      note="two springs, one anchored to the other"
    >
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[360px] flex-col items-center gap-9 ${reduced ? "cps-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="relative h-48 w-full">
            <div className="cps-pin absolute left-0 top-0 flex size-9 items-center justify-center rounded-full rounded-bl-sm bg-[var(--foreground)]/70 shadow-md ring-2 ring-fd-card">
              <span className="size-1.5 rounded-full bg-[var(--background)]" />
            </div>

            <div className="cps-pop absolute left-0 top-11 w-56 overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] shadow-lg">
              <div className="flex flex-col gap-2.5 p-3">
                <div className="flex gap-2.5">
                  <span className="mt-0.5 size-5 shrink-0 rounded-full bg-[var(--foreground)]/25" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/30" />
                    <span className="h-1.5 w-full rounded-full bg-[var(--foreground)]/15" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }'}
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
