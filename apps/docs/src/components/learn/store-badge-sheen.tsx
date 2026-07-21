"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The lift is a plain hover transform (`-translate-y-0.5`, 200ms
 * `cubic-bezier(0.22,1,0.36,1)`). The sheen is a `linear-gradient` strip,
 * skewed `-12deg`, parked at `-130%` and eased to `130%` over 700ms on
 * `group-hover` — one element crossing the badge once, not a shimmer loop.
 * Looped here so it plays without a pointer.
 */
const CSS = `
@keyframes stbs-lift { 0%, 100% { transform: translateY(0); } 45%, 55% { transform: translateY(-2px); } }
@keyframes stbs-sheen {
  0%, 30% { transform: translateX(-130%) skewX(-12deg); opacity: 0; }
  45% { opacity: 1; }
  70%, 100% { transform: translateX(130%) skewX(-12deg); opacity: 0; }
}
.stbs-shell { animation: stbs-lift 2.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.stbs-sheen { animation: stbs-sheen 2.6s cubic-bezier(0.22,1,0.36,1) infinite; }
.stbs-static .stbs-shell { animation: none; transform: none; }
.stbs-static .stbs-sheen { animation: none; opacity: 0; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Lift",
    desc: "translateY −2px, 200ms cubic-bezier(0.22,1,0.36,1)",
    swatch: "bg-[var(--foreground)]/25",
  },
  {
    name: "Sheen",
    desc: "skewed strip, −130% → 130%, 700ms ease-out",
    swatch: "bg-[var(--foreground)]/60",
  },
];

export function StoreBadgeSheen() {
  return (
    <ScrollScene label="The sheen" note="one strip crosses once per hover">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[360px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className={`relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-black px-5 py-3 text-white ring-1 ring-white/20 ${
              reduced ? "stbs-static" : "stbs-shell"
            }`}
          >
            <span className="size-6 shrink-0 rounded-[6px] bg-current opacity-45" />
            <span className="flex flex-col items-start gap-1">
              <span className="h-[6px] w-12 rounded-full bg-current opacity-40" />
              <span className="h-[10px] w-20 rounded-full bg-current opacity-85" />
            </span>
            <span
              aria-hidden
              className="stbs-sheen pointer-events-none absolute inset-0 [background:linear-gradient(105deg,transparent_20%,rgba(255,255,255,0.28)_50%,transparent_80%)]"
            />
          </div>

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
