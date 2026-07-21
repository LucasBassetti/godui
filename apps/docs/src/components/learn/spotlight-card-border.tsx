"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Real border layer: `absolute inset-0` with the same radial as the fill,
 * punched to a 1px ring via p-px + mask-composite:exclude. Only `--x`/`--y`
 * move — the layer itself never translates. Earlier scene moved a tiny disc,
 * which looked nothing like the lit arc chasing the pointer on the edge.
 */
const CSS = `
@property --scb-x {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
@property --scb-y {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 0%;
}
@keyframes scb-sweep {
  0%   { --scb-x: 8%;  --scb-y: 8%; }
  25%  { --scb-x: 92%; --scb-y: 10%; }
  50%  { --scb-x: 92%; --scb-y: 90%; }
  75%  { --scb-x: 8%;  --scb-y: 90%; }
  100% { --scb-x: 8%;  --scb-y: 8%; }
}
@keyframes scb-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.scb-ring {
  --scb-x: 8%;
  --scb-y: 8%;
  opacity: 0;
  animation:
    scb-fade 400ms ease 80ms both,
    scb-sweep 4.5s linear 480ms infinite;
  background: radial-gradient(
    110px circle at var(--scb-x) var(--scb-y),
    color-mix(in oklab, var(--foreground) 55%, transparent),
    transparent 65%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
.scb-fill {
  --scb-x: 8%;
  --scb-y: 8%;
  opacity: 0;
  animation:
    scb-fade 400ms ease 80ms both,
    scb-sweep 4.5s linear 480ms infinite;
  background: radial-gradient(
    110px circle at var(--scb-x) var(--scb-y),
    color-mix(in oklab, var(--foreground) 18%, transparent),
    transparent 65%
  );
}
.scb-static .scb-ring,
.scb-static .scb-fill {
  animation: none;
  opacity: 1;
  --scb-x: 72%;
  --scb-y: 38%;
}
`;

const LEGEND = [
  {
    name: "Fill glow",
    desc: "full-area radial at the same --x/--y",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Ring mask",
    desc: "inset-0 · p-px · mask-composite: exclude",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/55 ring-inset",
  },
  {
    name: "Moving center",
    desc: "only --x/--y change — layer stays put",
    swatch: "bg-[var(--muted)]",
  },
] as const;

export function SpotlightCardBorder() {
  return (
    <ScrollScene label="Border ring" note="mask-composite exclude · p-px">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "scb-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-[160px] w-[240px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
            {/* Soft fill — same center as the ring */}
            <div
              aria-hidden="true"
              className="scb-fill pointer-events-none absolute inset-0 rounded-xl"
            />
            {/* Full-card ring layer — gradient masked to 1px edge */}
            <div
              aria-hidden="true"
              className="scb-ring pointer-events-none absolute inset-0 rounded-xl p-px"
            />
            <div className="relative z-raised flex h-full flex-col justify-center gap-2.5 px-6">
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/15" />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"mask-composite: exclude · -webkit-mask-composite: xor"}
          </p>

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
