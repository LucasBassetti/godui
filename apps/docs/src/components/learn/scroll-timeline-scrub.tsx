"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The rail never animates `height` — it's `scaleY` on a fixed-height overlay,
 * `transform-origin: top`, driven by the spring-smoothed scroll progress.
 * Color is intentional here: the growing rail is the component's signature
 * motion. Looped as a scrub down, then back up.
 */
const CSS = `
@keyframes stls-fill {
  0%        { transform: scaleY(0); }
  45%, 55%  { transform: scaleY(1); }
  100%      { transform: scaleY(0); }
}
@keyframes stls-node {
  0%, 6%    { opacity: 0.25; }
  20%, 80%  { opacity: 1; }
  94%, 100% { opacity: 0.25; }
}
.stls-fill { animation: stls-fill 3.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stls-node { animation: stls-node 3.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stls-static .stls-fill { animation: none; transform: scaleY(1); }
.stls-static .stls-node { animation: none; opacity: 1; }
`;

const NODES = [0.12, 0.5, 0.88];

export function ScrollTimelineScrub() {
  return (
    <ScrollScene label="The motion" note="scaleY, origin-top — not height">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative h-52 w-1.5 overflow-hidden rounded-full bg-[var(--muted)] ${
              reduced ? "stls-static" : ""
            }`}
          >
            <div className="stls-fill absolute inset-0 origin-top rounded-full bg-[linear-gradient(to_top,var(--primary),color-mix(in_oklch,var(--primary)_0%,transparent))]" />
          </div>

          <div className="flex w-full items-center justify-between px-2">
            {NODES.map((n) => (
              <span
                key={n}
                className="stls-node size-2.5 rounded-full bg-[var(--primary)]"
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            scaleY: progress · transform-origin: top
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Base rail
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                fixed line, always full height
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--primary)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Progress fill
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                scaleY overlay, grows with scroll
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
