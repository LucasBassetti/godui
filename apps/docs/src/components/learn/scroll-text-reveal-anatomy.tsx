"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * ScrollTextReveal owns one `scrollYProgress` and carves it into n equal
 * slices — segment i maps `[i/n, (i+1)/n]` → reveal 0→1. This scene freezes
 * progress mid-paragraph so early slots are lit, the active slice is mid,
 * and trailing slots stay at dimOpacity. Token bars stand in for words.
 */
const CSS = `
@keyframes stra-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
@keyframes stra-playhead {
  from { transform: scaleX(0); }
  to   { transform: scaleX(0.5); }
}
.stra-row { opacity: 0; animation: stra-in 520ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.stra-playhead {
  transform-origin: left center;
  animation: stra-playhead 900ms cubic-bezier(0.3,0.7,0.4,1.2) 200ms both;
}
.stra-static .stra-row { opacity: 1; animation: none; transform: none; }
.stra-static .stra-playhead { animation: none; transform: scaleX(0.5); }
`;

/** Five word slots; progress frozen at 0.5 → indices 0–1 lit, 2 mid, 3–4 dim. */
const SLOTS: { id: string; opacity: number; blur: number }[] = [
  { id: "s0", opacity: 1, blur: 0 },
  { id: "s1", opacity: 1, blur: 0 },
  { id: "s2", opacity: 0.55, blur: 3 },
  { id: "s3", opacity: 0.15, blur: 6 },
  { id: "s4", opacity: 0.15, blur: 6 },
];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Dim",
    desc: "reveal 0 — opacity dimOpacity, blur 6px",
    swatch: "bg-[var(--foreground)]/15",
  },
  {
    name: "Lit",
    desc: "reveal 1 — opacity 1, blur 0",
    swatch: "bg-[var(--foreground)]",
  },
  {
    name: "Slice",
    desc: "segment i owns progress [i/n, (i+1)/n]",
    swatch: "bg-[var(--foreground)]/45",
  },
];

export function ScrollTextRevealAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one progress, n equal slices">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 ${reduced ? "stra-static" : ""}`}
          >
            <div
              className="stra-row flex w-full flex-wrap items-center justify-center gap-2.5"
              style={{ animationDelay: "0ms" }}
            >
              {SLOTS.map((slot) => (
                <span
                  key={slot.id}
                  aria-hidden="true"
                  className="h-2.5 w-12 rounded-full bg-[var(--foreground)]"
                  style={{
                    opacity: slot.opacity,
                    filter: `blur(${slot.blur}px)`,
                  }}
                />
              ))}
            </div>

            <div
              className="stra-row flex w-full flex-col gap-2"
              style={{ animationDelay: "80ms" }}
            >
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                <span className="stra-playhead absolute inset-y-0 left-0 w-full rounded-full bg-[var(--foreground)]/55" />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-fd-muted-foreground">
                <span>0</span>
                <span>i/n → (i+1)/n</span>
                <span>1</span>
              </div>
            </div>

            <p className="font-mono text-[11px] text-fd-muted-foreground">
              scrollYProgress ≈ 0.5
            </p>
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
