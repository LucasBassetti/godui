"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Default scrub: one `scrollYProgress` drives every segment. Progress walks
 * 0→1 then back 1→0 (`alternate`); each slot's opacity/blur follows its
 * slice and reverses on the way down — the real component's scrubbed
 * mapping, without Framer Motion.
 */
const CSS = `
@keyframes strs-track {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
/* n=5; slot i lights across [i/5, (i+1)/5] of the forward half, mirrors reverse */
@keyframes strs-s0 {
  0%   { opacity: 0.15; filter: blur(6px); }
  10%, 50% { opacity: 1; filter: blur(0); }
  60%, 100% { opacity: 0.15; filter: blur(6px); }
}
@keyframes strs-s1 {
  0%, 10% { opacity: 0.15; filter: blur(6px); }
  20%, 50% { opacity: 1; filter: blur(0); }
  70%, 100% { opacity: 0.15; filter: blur(6px); }
}
@keyframes strs-s2 {
  0%, 20% { opacity: 0.15; filter: blur(6px); }
  30%, 50% { opacity: 1; filter: blur(0); }
  80%, 100% { opacity: 0.15; filter: blur(6px); }
}
@keyframes strs-s3 {
  0%, 30% { opacity: 0.15; filter: blur(6px); }
  40%, 50% { opacity: 1; filter: blur(0); }
  90%, 100% { opacity: 0.15; filter: blur(6px); }
}
@keyframes strs-s4 {
  0%, 40% { opacity: 0.15; filter: blur(6px); }
  50% { opacity: 1; filter: blur(0); }
  100% { opacity: 0.15; filter: blur(6px); }
}
.strs-track {
  transform-origin: left center;
  animation: strs-track 4s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
}
.strs-s0 { animation: strs-s0 8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strs-s1 { animation: strs-s1 8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strs-s2 { animation: strs-s2 8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strs-s3 { animation: strs-s3 8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strs-s4 { animation: strs-s4 8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }
.strs-static .strs-track { animation: none; transform: scaleX(0.5); }
.strs-static .strs-s0,
.strs-static .strs-s1 { animation: none; opacity: 1; filter: none; }
.strs-static .strs-s2 { animation: none; opacity: 0.55; filter: blur(3px); }
.strs-static .strs-s3,
.strs-static .strs-s4 { animation: none; opacity: 0.15; filter: blur(6px); }
`;

const SEG_CLASS = [
  "strs-s0",
  "strs-s1",
  "strs-s2",
  "strs-s3",
  "strs-s4",
] as const;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Progress",
    desc: "scrollYProgress 0 → 1 → 0",
    swatch: "bg-[var(--foreground)]/55",
  },
  {
    name: "Opacity",
    desc: "dimOpacity → 1 per slice",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Blur",
    desc: "blur(6px) → blur(0) in sync",
    swatch: "bg-[var(--foreground)]/15",
  },
];

export function ScrollTextRevealScrub() {
  return (
    <ScrollScene label="The scrub" note="progress drives every slice">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 ${reduced ? "strs-static" : ""}`}
          >
            <div className="flex w-full flex-wrap items-center justify-center gap-2.5">
              {SEG_CLASS.map((cls) => (
                <span
                  key={cls}
                  aria-hidden="true"
                  className={`${cls} h-2.5 w-12 rounded-full bg-[var(--foreground)]`}
                />
              ))}
            </div>

            <div className="flex w-full flex-col gap-2">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <span className="strs-track absolute inset-y-0 left-0 w-full rounded-full bg-[var(--foreground)]/55" />
              </div>
              <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
                scrollYProgress
              </p>
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
