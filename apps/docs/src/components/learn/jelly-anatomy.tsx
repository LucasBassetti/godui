"use client";

import { ScrollScene } from "./scroll-scene";

// One surface, one origin. The rest plate sits on a baseline; the dashed frame
// is the envelope it deforms into on press — wider and shorter, anchored to the
// same bottom edge (transform-origin: bottom).
const CSS = `
@keyframes ja-plate-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ja-ghost-in {
  0%, 40% { opacity: 0; }
  100%    { opacity: 1; }
}
.ja-plate { animation: ja-plate-in 640ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.ja-ghost { animation: ja-ghost-in 900ms ease both; }
.ja-static .ja-plate,
.ja-static .ja-ghost { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: { swatch: string; name: string; note: string }[] = [
  {
    swatch: "h-4 w-8 rounded-md bg-[var(--foreground)]",
    name: "Surface",
    note: "the single animated layer",
  },
  {
    swatch:
      "h-3 w-9 rounded-md border border-dashed border-[var(--foreground)]/50",
    name: "Pressed envelope",
    note: "scaleX ↑, scaleY ↓ on press",
  },
  {
    swatch: "h-0 w-8 border-b border-dashed border-[var(--foreground)]/50",
    name: "Origin",
    note: "transform-origin: bottom",
  },
];

export function JellyAnatomy() {
  return (
    <ScrollScene
      label="Anatomy"
      note="one surface, deformed from its bottom edge"
    >
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex flex-col items-center gap-9 ${reduced ? "ja-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div className="relative flex h-[168px] w-[264px] items-end justify-center">
            <div className="absolute inset-x-8 bottom-9 border-[var(--foreground)]/50 border-b border-dashed" />
            <div className="ja-ghost absolute bottom-9 h-9 w-[168px] origin-bottom rounded-xl border border-[var(--foreground)]/50 border-dashed" />
            <div className="ja-plate absolute bottom-9 flex h-12 w-36 origin-bottom items-center justify-center rounded-xl bg-[var(--foreground)]">
              <div className="h-2 w-12 rounded-full bg-[var(--background)]/80" />
            </div>
          </div>
          <dl className="grid grid-cols-3 gap-x-7 gap-y-2 text-center">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col items-center gap-2">
                <span className={item.swatch} aria-hidden="true" />
                <dt className="font-medium text-[12px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="font-mono text-[11px] text-fd-muted-foreground leading-snug">
                  {item.note}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
