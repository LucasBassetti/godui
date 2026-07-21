"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * One throw, in four beats: rest, thrown past the target with
 * `dragElastic: 0.16` giving a little extra travel, then the settle spring
 * (stiffness 320, damping 32, mass 0.9) pulls it back — the same
 * under-damped-but-controlled feel as `SETTLE_SPRING` in the source, just
 * on `translateX` instead of a live pointer.
 */
const CSS = `
@keyframes igd-track {
  0%, 8%    { transform: translateX(0); }
  32%       { transform: translateX(-146px); }
  55%       { transform: translateX(-124px); }
  74%       { transform: translateX(-132px); }
  100%      { transform: translateX(-128px); }
}
.igd-track { animation: igd-track 4.4s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
.igd-static .igd-track { animation: none; transform: translateX(-128px); }
`;

const SLIDES = [0, 1, 2, 3, 4];

export function InertiaGalleryDrag() {
  return (
    <ScrollScene label="The throw" note="elastic 0.16, settle 320 / 32 / 0.9">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "igd-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative h-24 w-40 overflow-hidden rounded-xl border border-white/10">
            <span
              aria-hidden
              className="absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-white/50"
            />
            <div className="igd-track absolute inset-y-0 left-1/2 flex items-center gap-3 will-change-transform">
              {SLIDES.map((i) => (
                <div
                  key={i}
                  className="h-16 w-11 shrink-0 rounded-lg bg-[var(--foreground)]/70"
                />
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-4 gap-x-6 gap-y-1 text-center font-mono text-[11px] text-fd-muted-foreground">
            <dt className="text-fd-foreground">rest</dt>
            <dt className="text-fd-foreground">thrown</dt>
            <dt className="text-fd-foreground">overshoot</dt>
            <dt className="text-fd-foreground">settle</dt>
            <dd>0%</dd>
            <dd>32%</dd>
            <dd>55–74%</dd>
            <dd>100%</dd>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
