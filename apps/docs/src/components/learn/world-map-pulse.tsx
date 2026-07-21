"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * A direct port of the real values: a ripple circle scales `1 → 3` while its
 * opacity fades `0.6 → 0`, on an infinite loop, `transformBox: fill-box` so
 * it scales around its own center instead of the SVG origin. The solid core
 * pin never animates.
 */
const CSS = `
@keyframes wmp-ripple {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(3); opacity: 0; }
}
.wmp-ripple { animation: wmp-ripple 1.8s cubic-bezier(0.22,1,0.36,1) infinite; animation-delay: var(--d); transform-box: fill-box; transform-origin: center; }
.wmp-static .wmp-ripple { animation: none; opacity: 0; }
`;

export function WorldMapPulse() {
  return (
    <ScrollScene label="The pulse" note="scale 1→3 · opacity .6→0, looping">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[380px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`flex items-center gap-20 py-6 ${reduced ? "wmp-static" : ""}`}
          >
            {[0, 620].map((delay) => (
              <svg
                key={delay}
                viewBox="0 0 40 40"
                className="size-10"
                aria-hidden="true"
              >
                <title>Pin ripple</title>
                <circle
                  className="wmp-ripple"
                  cx={20}
                  cy={20}
                  r={5}
                  fill="var(--primary)"
                  style={{ "--d": `${delay}ms` } as CSSProperties}
                />
                <circle cx={20} cy={20} r={5} fill="var(--primary)" />
              </svg>
            ))}
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--primary)] ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Pin
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                the static core circle, never animates
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[var(--primary)]/40 ring-1 ring-fd-border ring-inset" />
              <dt className="font-medium text-[13px] text-fd-foreground">
                Ripple
              </dt>
              <dd className="text-[12px] text-fd-muted-foreground">
                a second circle, scale + fade, infinite
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
