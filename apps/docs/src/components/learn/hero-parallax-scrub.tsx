"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * One scroll progress (0→1) drives two things at once: the whole plane's
 * `rotateX`/`rotateZ`/`translateY`/`opacity` resolve to rest inside the
 * *first 20%* of scroll, while `translateX`/`translateXReverse` keep
 * spreading the rows apart across the *entire* scroll range. Looped here as
 * a scrub down and back up.
 */
const ROWS: { key: string; dir: 1 | -1; delay: number }[] = [
  { key: "row1", dir: 1, delay: 0 },
  { key: "row2", dir: -1, delay: 60 },
  { key: "row3", dir: 1, delay: 120 },
];

const CSS = `
@keyframes hps-plane {
  0%        { transform: rotateX(15deg) rotateZ(14deg) translateY(-18px); opacity: 0.3; }
  8%, 92%   { transform: rotateX(0deg) rotateZ(0deg) translateY(0px); opacity: 1; }
  100%      { transform: rotateX(15deg) rotateZ(14deg) translateY(-18px); opacity: 0.3; }
}
@keyframes hps-row-fwd {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(38px); }
  100% { transform: translateX(0); }
}
@keyframes hps-row-rev {
  0%   { transform: translateX(0); }
  50%  { transform: translateX(-38px); }
  100% { transform: translateX(0); }
}
.hps-plane { animation: hps-plane 4.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.hps-row-fwd { animation: hps-row-fwd 4.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.hps-row-rev { animation: hps-row-rev 4.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.hps-static .hps-plane,
.hps-static .hps-row-fwd,
.hps-static .hps-row-rev { animation: none; transform: none; opacity: 1; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Plane",
    desc: "rotateX 15→0 · rotateZ 14→0 · translateY, opacity .2→1 — first 20% of scroll",
    swatch: "bg-[var(--foreground)]/70",
  },
  {
    name: "Rows",
    desc: "translateX / translateXReverse spread across the full scroll",
    swatch: "bg-[var(--muted)]",
  },
];

export function HeroParallaxScrub() {
  return (
    <ScrollScene label="The motion" note="scrub down, then back up">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`hps-plane w-full [perspective:800px] [transform-style:preserve-3d] ${reduced ? "hps-static" : ""}`}
          >
            <div className="flex flex-col gap-3">
              {ROWS.map((row) => (
                <div
                  key={row.key}
                  className={`flex gap-2.5 ${row.dir === 1 ? "hps-row-fwd" : "hps-row-rev"}`}
                  style={{ "--d": `${row.delay}ms` } as CSSProperties}
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length card row
                      key={i}
                      className="h-9 flex-1 rounded-lg border border-border bg-[var(--muted)]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            useTransform(scrollYProgress, [0, 0.2], [...]) · useSpring(320, 32,
            0.9)
          </p>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
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
