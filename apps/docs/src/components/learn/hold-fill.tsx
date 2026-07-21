"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * The real fill mechanic: a `motion.span` pinned to the button's bounds,
 * `origin-left`, scaled on `scaleX` from 0 → 1. No layout property moves —
 * the button never resizes, only the fill's transform changes.
 */
const CSS = `
@keyframes hf-fill {
  0%, 8%    { transform: scaleX(0); }
  68%, 82%  { transform: scaleX(1); }
  94%, 100% { transform: scaleX(0); }
}
.hf-fill { animation: hf-fill 3.6s linear infinite; }
.hf-static .hf-fill { animation: none; transform: scaleX(1); }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "surface" | "fill";
}[] = [
  {
    name: "Button surface",
    desc: "the real destructive fill color",
    kind: "surface",
  },
  {
    name: "Progress fill",
    desc: "scaleX(progress), origin-left",
    kind: "fill",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "fill") {
    return (
      <span className="relative h-3.5 w-8 overflow-hidden rounded-lg ring-1 ring-fd-border ring-inset">
        <span className="absolute inset-0 bg-[var(--foreground)]" />
        <span className="absolute inset-y-0 left-0 w-1/2 bg-[var(--background)]/30" />
      </span>
    );
  }
  return (
    <span className="h-3.5 w-8 rounded-lg bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
  );
}

export function HoldFill() {
  return (
    <ScrollScene label="The fill" note="scaleX · origin-left · linear · 900ms">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "hf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className="relative flex h-12 w-[220px] items-center justify-center overflow-hidden rounded-xl bg-[var(--foreground)]"
            aria-hidden="true"
          >
            <span className="hf-fill absolute inset-0 origin-left bg-[var(--background)]/30" />
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <LegendSwatch kind={item.kind} />
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
