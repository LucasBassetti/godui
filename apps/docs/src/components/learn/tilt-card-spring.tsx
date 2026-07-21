"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `rotateX`/`rotateY` and the glare's radial-gradient position both read off
 * the same spring-smoothed pointer (`sx`, `sy`), so they move in lockstep —
 * one signal, two `useTransform` mappings. Looped here as a sweep since
 * there's no pointer to follow; the real card chases whatever the cursor
 * does with `stiffness: 170, damping: 12, mass: 0.1`.
 */
const CSS = `
@keyframes tcs-tilt {
  0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
  25%       { transform: rotateX(9deg) rotateY(-10deg); }
  75%       { transform: rotateX(-9deg) rotateY(10deg); }
}
@keyframes tcs-glare {
  0%, 100% { background-position: 50% 50%; }
  25%       { background-position: 15% 15%; }
  75%       { background-position: 85% 85%; }
}
.tcs-card-anim { animation: tcs-tilt 4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.tcs-glare {
  background-image: radial-gradient(circle, rgba(255,255,255,0.6), transparent 55%);
  background-size: 200% 200%;
  background-position: 50% 40%;
}
.tcs-glare-anim { animation: tcs-glare 4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
`;

export function TiltCardSpring() {
  return (
    <ScrollScene label="The tilt" note="rotateX/Y and glare, one signal">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="flex h-40 w-full items-center justify-center [perspective:900px]"
          >
            <div
              className={`relative flex h-24 w-36 items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)] shadow-md [transform-style:preserve-3d] ${
                reduced ? "" : "tcs-card-anim"
              }`}
            >
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 tcs-glare ${reduced ? "" : "tcs-glare-anim"}`}
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {'useTransform(sx, [-0.5, 0.5], ["0%", "100%"]) → --gx / --gy'}
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Card tilt
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                rotateX/rotateY, spring mass 0.1 · stiffness 170 · damping 12
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-white/70 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Glare
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                same sx/sy, mapped to a radial-gradient position
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
