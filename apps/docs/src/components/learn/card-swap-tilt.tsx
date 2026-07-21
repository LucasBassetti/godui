"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The whole stack — not each card individually — tilts toward the pointer.
 * `onPointerMove` maps the pointer's position inside the container to
 * `[-0.5, 0.5]` on each axis, negates/scales it into small `rotateX`/`rotateY`
 * degrees, and one `useSpring` (mass 0.1 · stiffness 170 · damping 12 — the
 * same fast, slightly underdamped spring `Dock` uses for magnification) chases
 * that target. Looped here as a sweep since there's no pointer to follow.
 */
const CSS = `
@keyframes cst-sweep {
  0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
  25%       { transform: rotateX(6deg) rotateY(7deg); }
  75%       { transform: rotateX(-6deg) rotateY(-7deg); }
}
.cst-stack { animation: cst-sweep 4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.cst-static .cst-stack { animation: none; transform: none; }
`;

const RANKS = [0, 1, 2];

export function CardSwapTilt() {
  return (
    <ScrollScene label="The tilt" note="whole stack, one spring">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="flex h-40 w-full items-center justify-center [perspective:900px]"
          >
            <div
              className={`relative h-24 w-32 [transform-style:preserve-3d] ${
                reduced ? "cst-static" : "cst-stack"
              }`}
            >
              {RANKS.map((rank) => (
                <div
                  key={rank}
                  className="absolute inset-0 rounded-2xl border border-fd-border bg-[var(--card)] shadow-md"
                  style={{
                    transform: `translate(${rank * 14}px, ${-rank * 18}px) scale(${1 - rank * 0.06})`,
                    zIndex: RANKS.length - rank,
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            useSpring({"{"} x: -py * 12, y: px * 14 {"}"}, {"{"} mass: 0.1,
            stiffness: 170, damping: 12 {"}"})
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="size-2 rounded-full bg-[var(--foreground)]/50 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Pointer map
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                position inside the box → [-0.5, 0.5] per axis
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-4 w-5 rounded-2xl border border-fd-border bg-[var(--card)] shadow-md [transform:rotateX(6deg)_rotateY(7deg)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Spring
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                mass 0.1 · stiffness 170 · damping 12
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
