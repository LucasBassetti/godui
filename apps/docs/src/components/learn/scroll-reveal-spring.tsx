"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `useInView(ref, { once, amount: 0.3 })` flips `isInView`, which swaps the
 * spring target from `hidden` (offset + blur + opacity 0) to `visible`
 * (settled). Spring: damping 32, stiffness 320, mass 0.9.
 */

const CSS = `
@keyframes srs-reveal {
  0%, 12% {
    opacity: 0;
    transform: translateY(40px);
    filter: blur(10px);
  }
  55%, 78% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: translateY(40px);
    filter: blur(10px);
  }
}
@keyframes srs-threshold {
  0%, 12%  { transform: scaleX(0); opacity: 0.35; }
  20%      { transform: scaleX(0.3); opacity: 1; }
  55%, 78% { transform: scaleX(0.3); opacity: 1; }
  100%     { transform: scaleX(0); opacity: 0.35; }
}
.srs-plate { animation: srs-reveal 3.8s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }
.srs-amt   { animation: srs-threshold 3.8s ease-in-out infinite; }
.srs-static .srs-plate {
  animation: none;
  opacity: 1;
  transform: none;
  filter: none;
}
.srs-static .srs-amt {
  animation: none;
  transform: scaleX(0.3);
  opacity: 1;
}
`;

const LEGEND = [
  {
    name: "In view",
    desc: "useInView once · amount 0.3",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Spring",
    desc: "damping 32 · stiffness 320 · mass 0.9",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Hidden",
    desc: "opacity 0 + offset + blur(10px)",
    swatch: "bg-[var(--card)] ring-1 ring-fd-border ring-inset",
  },
] as const;

export function ScrollRevealSpring() {
  return (
    <ScrollScene label="The reveal" note="useInView → spring · amount 0.3">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "srs-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-xl border border-fd-border bg-[var(--card)]">
            {/* viewport marker — 30% threshold band */}
            <div className="pointer-events-none absolute inset-x-0 top-[35%] h-px bg-[var(--foreground)]/15" />
            <div className="pointer-events-none absolute inset-x-8 top-[32%] h-1.5 overflow-hidden rounded-full bg-[var(--muted)]">
              <span className="srs-amt absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[var(--foreground)]/50" />
            </div>

            <div className="srs-plate flex h-20 w-36 flex-col items-center justify-center gap-2 rounded-xl border border-fd-border bg-[var(--muted)] shadow-sm">
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/30" />
              <span className="h-2 w-8 rounded-full bg-[var(--foreground)]/15" />
            </div>
          </div>

          <p className="font-mono text-[11px] text-fd-muted-foreground">
            {"animate={isInView ? visible : hidden}"}
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
