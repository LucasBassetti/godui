"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The card's enter/exit is a Framer spring — `stiffness: 320, damping: 32,
 * mass: 0.9` — off `initial={{ opacity: 0, y: 6, scale: 0.96 }}`. That
 * combination is close to critically damped: it settles fast with only the
 * faintest overshoot past `scale: 1`, nothing like an underdamped bounce.
 * Looped here as open → hold → close.
 */
const CSS = `
@keyframes sct-cycle {
  0%, 8%    { opacity: 0; transform: translateY(6px) scale(0.96); }
  34%       { opacity: 1; transform: translateY(-1px) scale(1.015); }
  46%, 78%  { opacity: 1; transform: translateY(0) scale(1); }
  94%, 100% { opacity: 0; transform: translateY(6px) scale(0.96); }
}
.sct-card { animation: sct-cycle 3.4s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.sct-static .sct-card { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "opacity",
    desc: "0 → 1, tied to the same spring",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "scale",
    desc: "0.96 → 1, a hair of overshoot near 1.015",
    swatch: "bg-[var(--foreground)]/55",
  },
  {
    name: "y",
    desc: "6px → 0, mass 0.9 keeps it from bouncing",
    swatch: "bg-[var(--foreground)]",
  },
];

export function SourceCitationsTooltip() {
  return (
    <ScrollScene label="The motion" note="spring pop · open → hold → close">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "sct-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex flex-col items-center">
            <div className="sct-card w-56 rounded-xl border border-fd-border bg-[var(--popover)] p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="size-5 shrink-0 rounded bg-[var(--muted)]" />
                <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/25" />
              </div>
              <span className="mt-2 block h-2 w-3/4 rounded-full bg-[var(--foreground)]/45" />
              <span className="mt-1.5 block h-1.5 w-full rounded-full bg-[var(--foreground)]/15" />
            </div>
            <div className="-mt-1 size-2 rotate-45 border-fd-border border-r border-b bg-[var(--popover)]" />
            <div className="h-3" />
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-[5px] bg-[var(--foreground)]/70" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
              {'{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }'}
            </p>
            <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
              show delay 80ms · hide delay 120ms — bridges pointer to the card
            </p>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
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
