"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Illustrates the SVG metaball filter: blur the source, then punch the alpha
 * channel back up with feColorMatrix so overlapping circles fuse into one
 * liquid shape. Looping rest → merge → rest.
 */
const CSS = `
@keyframes gf-a {
  0%, 12%   { transform: translate(0, 0); }
  38%, 62%  { transform: translate(22px, 0); }
  88%, 100% { transform: translate(0, 0); }
}
@keyframes gf-b {
  0%, 12%   { transform: translate(0, 0); }
  38%, 62%  { transform: translate(-22px, 0); }
  88%, 100% { transform: translate(0, 0); }
}
.gf-a { animation: gf-a 3.2s cubic-bezier(0.3, 0.7, 0.4, 1) infinite; }
.gf-b { animation: gf-b 3.2s cubic-bezier(0.3, 0.7, 0.4, 1) infinite; }
.gf-static .gf-a { animation: none; transform: translate(22px, 0); }
.gf-static .gf-b { animation: none; transform: translate(-22px, 0); }
`;

const FILTER_ID = "gooey-learn-filter";

export function GooeyFilter() {
  return (
    <ScrollScene label="Goo filter" note="blur + color-matrix metaballs">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "gf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute size-0"
          >
            <defs>
              <filter id={FILTER_ID}>
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="6"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
                  result="goo"
                />
              </filter>
            </defs>
          </svg>

          <div className="grid w-full grid-cols-2 gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-[120px] w-full items-center justify-center">
                <div className="gf-a absolute size-14 rounded-full bg-black/55" />
                <div className="gf-b absolute size-14 rounded-full bg-black/55" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                raw circles
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div
                className="relative flex h-[120px] w-full items-center justify-center"
                style={{ filter: `url(#${FILTER_ID})` }}
              >
                <div className="gf-a absolute size-14 rounded-full bg-black/55" />
                <div className="gf-b absolute size-14 rounded-full bg-black/55" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                after goo filter
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium text-[13px] text-fd-foreground">
                feGaussianBlur
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                {'stdDeviation="6"'}
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <dt className="font-medium text-[13px] text-fd-foreground">
                feColorMatrix
              </dt>
              <dd className="font-mono text-[12px] text-fd-muted-foreground">
                alpha ×20 − 10
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
