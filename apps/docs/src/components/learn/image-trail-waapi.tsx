"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Web Animations API keyframes on each spawn: scale 0.4→1→0.92, opacity
 * 0→1→0, slight upward drift (translateY −50% → −65%), tilt clamped from
 * travel angle. cubic-bezier(0.22,1,0.36,1), fill forwards.
 */
const CSS = `
@keyframes itw-life {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.4) rotate(-8deg);
  }
  18% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(-8deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -65%) scale(0.92) rotate(-8deg);
  }
}
.itw-img {
  animation: itw-life 1.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.itw-img:nth-child(2) { animation-delay: 0.35s; }
.itw-img:nth-child(3) { animation-delay: 0.7s; }
.itw-static .itw-img {
  animation: none;
  opacity: 0.7;
  transform: translate(-50%, -50%) scale(1) rotate(-8deg);
}
.itw-static .itw-img:nth-child(2) { transform: translate(-50%, -50%) scale(1) rotate(4deg); }
.itw-static .itw-img:nth-child(3) { transform: translate(-50%, -50%) scale(1) rotate(-2deg); }
`;

const PLATES = [
  { left: "28%", top: "58%", tone: "bg-[var(--muted)]" },
  { left: "48%", top: "42%", tone: "bg-[var(--foreground)]/25" },
  { left: "68%", top: "52%", tone: "bg-[var(--muted)]" },
] as const;

const LEGEND = [
  {
    name: "Scale",
    desc: "0.4 → 1 (at 18%) → 0.92",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Opacity",
    desc: "0 → 1 → 0 · fill: forwards",
    swatch: "bg-[var(--foreground)]/40",
  },
  {
    name: "Drift + tilt",
    desc: "−50% → −65% Y · rotate(tilt)",
    swatch: "bg-[var(--foreground)]/20",
  },
] as const;

export function ImageTrailWaapi() {
  return (
    <ScrollScene label="The motion" note="WAAPI · no React re-render">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[180px] w-full max-w-[300px] overflow-hidden rounded-xl border border-fd-border bg-[var(--card)] ${reduced ? "itw-static" : ""}`}
          >
            {PLATES.map((p) => (
              <div
                key={p.left}
                className={`itw-img absolute size-16 rounded-xl shadow-md ring-1 ring-fd-border/40 ${p.tone}`}
                style={{ left: p.left, top: p.top }}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            img.animate([…], {"{ duration, easing: "}
            {'"cubic-bezier(0.22,1,0.36,1)" }'})
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
