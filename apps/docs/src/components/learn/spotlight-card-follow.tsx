"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Real follow: the glow layer is `absolute inset-0`; only `--x`/`--y` move
 * (written via setProperty in the component). Scene mirrors that — animate
 * custom props on a full-card radial, with a cursor marker at the same point.
 * Transforming a disc looked like a floating blob, not a CSS-var spotlight.
 */
const CSS = `
@property --scf-x {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 20%;
}
@property --scf-y {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 25%;
}
@keyframes scf-track {
  0%   { --scf-x: 18%; --scf-y: 22%; }
  35%  { --scf-x: 78%; --scf-y: 38%; }
  70%  { --scf-x: 42%; --scf-y: 78%; }
  100% { --scf-x: 18%; --scf-y: 22%; }
}
@keyframes scf-fade {
  0%, 100% { opacity: 0; }
  12%, 88% { opacity: 1; }
}
.scf-glow {
  --scf-x: 18%;
  --scf-y: 22%;
  animation:
    scf-track 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    scf-fade 3.6s ease infinite;
  background: radial-gradient(
    100px circle at var(--scf-x) var(--scf-y),
    color-mix(in oklab, var(--foreground) 28%, transparent),
    transparent 65%
  );
}
.scf-cursor {
  --scf-x: 18%;
  --scf-y: 22%;
  left: var(--scf-x);
  top: var(--scf-y);
  animation:
    scf-track 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite,
    scf-fade 3.6s ease infinite;
}
.scf-static .scf-glow {
  animation: none;
  opacity: 1;
  --scf-x: 58%;
  --scf-y: 42%;
}
.scf-static .scf-cursor {
  animation: none;
  opacity: 0.7;
  --scf-x: 58%;
  --scf-y: 42%;
}
`;

const LEGEND = [
  {
    name: "Glow layer",
    desc: "inset-0 radial at --x/--y · defaults 50%/50%",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "setProperty",
    desc: "direct DOM write on pointer move — zero re-renders",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Hover fade",
    desc: "opacity 0→100, 400ms ease (group-hover)",
    swatch: "bg-transparent ring-1 ring-[var(--foreground)]/40 ring-inset",
  },
] as const;

export function SpotlightCardFollow() {
  return (
    <ScrollScene label="Follow" note="--x/--y · no React state">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "scf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-[160px] w-[240px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
            {/* Full-card glow — only gradient center moves */}
            <div
              aria-hidden="true"
              className="scf-glow pointer-events-none absolute inset-0 rounded-xl"
            />
            <div className="relative z-raised flex h-full flex-col justify-center gap-2.5 px-6">
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/15" />
              <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/15" />
            </div>
            {/* Pointer stand-in, locked to the same --scf-x/--scf-y */}
            <div
              aria-hidden="true"
              className="scf-cursor pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--foreground)]/55 ring-4 ring-[var(--foreground)]/10"
            />
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'el.style.setProperty("--x", px + "px")'}
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
