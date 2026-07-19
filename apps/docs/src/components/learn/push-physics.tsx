"use client";

import { ScrollScene } from "./scroll-scene";

const SLOW = "[transition:transform_1200ms_cubic-bezier(0.3,0.7,0.4,1.5)]";

export function PushPhysics() {
  return (
    <ScrollScene label="Push physics" note="translate-y, springy bezier">
      {(play) => (
        <div className="flex flex-col items-center gap-8">
          <div className="relative h-[64px] w-[150px]">
            {/* shadow: rest 2px → hover 4px */}
            <span
              className={`absolute inset-0 rounded-xl bg-black/40 blur-[4px] ${SLOW} motion-reduce:transition-none ${
                play
                  ? "[transform:translateY(4px)]"
                  : "[transform:translateY(2px)]"
              }`}
            />
            {/* edge */}
            <span className="absolute inset-0 rounded-xl bg-[var(--muted)]" />
            {/* front face: rest -4px → hover -6px */}
            <span
              className={`absolute inset-0 flex items-center justify-center rounded-xl border border-white/10 bg-[var(--card)] font-semibold text-[13px] text-fd-foreground ${SLOW} motion-reduce:transition-none ${
                play
                  ? "[transform:translateY(-6px)]"
                  : "[transform:translateY(-4px)]"
              }`}
            >
              Push me
            </span>
          </div>
          <dl className="grid grid-cols-3 gap-x-8 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            <dt className="text-fd-foreground">rest</dt>
            <dt className="text-fd-foreground">hover</dt>
            <dt className="text-fd-foreground">press</dt>
            <dd>600ms</dd>
            <dd>250ms</dd>
            <dd>34ms</dd>
            <dd>face -4px</dd>
            <dd>face -6px</dd>
            <dd>face -2px</dd>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
