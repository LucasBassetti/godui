"use client";

import { ScrollScene } from "./scroll-scene";

// One shared transition for all three plates: springy translate + gentle fade.
const PLATE =
  "absolute inset-0 m-auto flex h-[58px] w-[170px] items-center justify-center rounded-[14px] font-semibold text-[13px] [transition:transform_900ms_cubic-bezier(0.3,0.7,0.4,1.2),opacity_500ms] motion-reduce:transition-none";

const TAG =
  "pointer-events-none absolute rounded-md border border-fd-border bg-[var(--muted)] px-2 py-[3px] font-medium text-[11px] text-fd-muted-foreground [transition:opacity_400ms_300ms] motion-reduce:transition-none";

export function LayerReveal() {
  return (
    <ScrollScene label="Anatomy" note="the three-layer stack">
      {(play) => (
        <div className="[perspective:900px]">
          <div className="relative h-[180px] w-[220px] [transform:rotateX(54deg)_rotateZ(-40deg)] [transform-style:preserve-3d]">
            {/* shadow */}
            <div
              className={`${PLATE} bg-black/50 text-white/70 blur-[5px] ${
                play
                  ? "opacity-100 [transform:translateZ(-26px)]"
                  : "opacity-0 [transform:translateZ(0px)]"
              }`}
            >
              shadow
            </div>
            {/* edge */}
            <div
              className={`${PLATE} bg-[var(--muted)] text-fd-muted-foreground ${
                play
                  ? "opacity-100 [transform:translateZ(26px)]"
                  : "opacity-0 [transform:translateZ(0px)]"
              }`}
            >
              edge
            </div>
            {/* front face */}
            <div
              className={`${PLATE} border border-white/10 bg-[var(--card)] text-fd-foreground ${
                play
                  ? "opacity-100 [transform:translateZ(78px)]"
                  : "opacity-0 [transform:translateZ(0px)]"
              }`}
            >
              Push me
            </div>
          </div>

          {/* labels — placed around the stack, fade in after the plates settle */}
          <span
            className={`${TAG} top-6 right-4 ${play ? "opacity-100" : "opacity-0"}`}
          >
            front face — what you press
          </span>
          <span
            className={`${TAG} top-[150px] right-2 ${play ? "opacity-100" : "opacity-0"}`}
          >
            edge — fakes the thickness
          </span>
          <span
            className={`${TAG} bottom-6 left-4 ${play ? "opacity-100" : "opacity-0"}`}
          >
            shadow — grounds it
          </span>
        </div>
      )}
    </ScrollScene>
  );
}
