"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The one colored scene — the subject here is the iridescence itself. The
 * card's `rotateX`/`rotateY` and the foil's `background-position` are driven
 * by the same pointer value in the real component (`--holo-x`/`--holo-y`);
 * looped here with two keyframe sets kept in phase so the foil visibly
 * "catches the light" as the card turns, exactly like a trading-card holo.
 */
const CSS = `
@keyframes hcf-tilt {
  0%, 100% { transform: rotateX(0deg) rotateY(0deg); }
  25%       { transform: rotateX(8deg) rotateY(-9deg); }
  75%       { transform: rotateX(-8deg) rotateY(9deg); }
}
@keyframes hcf-foil {
  0%, 100% { background-position: 50% 50%; }
  25%       { background-position: 15% 15%; }
  75%       { background-position: 85% 85%; }
}
.hcf-card-anim { animation: hcf-tilt 4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
.hcf-foil {
  background-image: linear-gradient(115deg,#ff2d95,#ffd84d,#4dff9e,#4dd2ff,#a24dff,#ff2d95);
  background-size: 200% 200%;
  background-position: 50% 40%;
  mix-blend-mode: color-dodge;
}
.hcf-foil-anim { animation: hcf-foil 4s cubic-bezier(0.34,1.4,0.64,1) infinite; }
`;

export function HolographicCardFoil() {
  return (
    <ScrollScene label="The foil" note="one signal, tilt + color together">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="flex h-40 w-full items-center justify-center [perspective:900px]"
          >
            <div
              className={`relative h-28 w-40 overflow-hidden rounded-2xl border border-white/10 shadow-2xl [transform-style:preserve-3d] ${
                reduced ? "" : "hcf-card-anim"
              }`}
            >
              <div
                aria-hidden
                className="absolute inset-0 [background:radial-gradient(120%_120%_at_30%_15%,#312e81_0%,#0b1020_55%,#020617_100%)]"
              />
              <div
                aria-hidden
                className={`absolute inset-0 opacity-60 hcf-foil ${reduced ? "" : "hcf-foil-anim"}`}
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            background-position: var(--holo-x) var(--holo-y)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Tilt
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                rotateX/rotateY from the shared spring
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span
                className="h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg,#ff2d95,#ffd84d,#4dff9e,#4dd2ff,#a24dff,#ff2d95)",
                }}
              />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Foil
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                same sx/sy, mapped to a background position
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
