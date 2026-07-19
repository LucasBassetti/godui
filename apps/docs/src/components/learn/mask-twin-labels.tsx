"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy of the real button: a plain base label (z-0, always in the DOM)
 * sits under a colored twin (z-1, `aria-hidden`) that's only visible through
 * the sprite mask. The third column loops the mask boundary sweeping across.
 */
const CSS = `
@keyframes mtwin-reveal {
  0%, 8%    { transform: scaleX(0); }
  42%, 58%  { transform: scaleX(1); }
  92%, 100% { transform: scaleX(0); }
}
.mtwin-overlay {
  transform-origin: left;
  animation: mtwin-reveal 3.6s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.mtwin-static .mtwin-overlay { animation: none; transform: scaleX(0); }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Base label",
    desc: "z-0, the real children, always in the DOM",
    swatch: "border-2 border-black/40 bg-transparent",
  },
  {
    name: "Masked overlay",
    desc: "z-1, aria-hidden twin, clipped by --mask-img",
    swatch: "bg-black/80",
  },
];

export function MaskTwinLabels() {
  return (
    <ScrollScene label="Anatomy" note="two spans, same label, one masked">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`grid w-full grid-cols-3 items-center justify-items-center gap-3 sm:gap-6 ${reduced ? "mtwin-static" : ""}`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-11 w-28 items-center justify-center rounded-[10px] border-2 border-black/40">
                <span className="h-2 w-12 rounded-full bg-black/40" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                base only
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex h-11 w-28 items-center justify-center rounded-[10px] bg-black/80">
                <span className="h-2 w-12 rounded-full bg-white/80" />
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                overlay only
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative h-11 w-28 overflow-hidden rounded-[10px] border-2 border-black/40">
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-2 w-12 rounded-full bg-black/40" />
                </span>
                <span className="mtwin-overlay absolute inset-0 flex items-center justify-center bg-black/80">
                  <span className="h-2 w-12 rounded-full bg-white/80" />
                </span>
              </div>
              <p className="font-mono text-[11px] text-fd-muted-foreground">
                together (masked)
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
