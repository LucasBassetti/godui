"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * softeness → inner hard edge: `inner = radius * (1 - softness)`. The mask
 * is transparent through `inner`, then feathers to opaque at `radius`.
 * Side-by-side: hard (softness≈0) vs soft (softness≈0.55 default).
 */
const CSS = `
@keyframes srm-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: none; }
}
.srm-card {
  opacity: 0;
  animation: srm-in 650ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d, 0ms) both;
}
.srm-static .srm-card { opacity: 1; animation: none; transform: none; }
`;

const HARD =
  "radial-gradient(circle 48px at 50% 50%, transparent 0, transparent 46px, #000 48px)";
const SOFT =
  "radial-gradient(circle 48px at 50% 50%, transparent 0, transparent 22px, #000 48px)";

const LEGEND: {
  name: string;
  desc: string;
  kind: "hard" | "soft";
}[] = [
  {
    name: "Hard edge",
    desc: "softness → 0 · inner ≈ radius",
    kind: "hard",
  },
  {
    name: "Soft feather",
    desc: "softness 0.55 · inner = radius × 0.45",
    kind: "soft",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  const mask =
    kind === "hard"
      ? "radial-gradient(circle 6px at 50% 50%, transparent 0, transparent 5px, #000 6px)"
      : "radial-gradient(circle 6px at 50% 50%, transparent 0, transparent 2px, #000 6px)";
  return (
    <span className="relative h-5 w-7 overflow-hidden rounded-lg border border-fd-border ring-1 ring-fd-border ring-inset">
      <span className="absolute inset-0 bg-[var(--foreground)]/75" />
      <span
        className="absolute inset-0 bg-[var(--card)]"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
    </span>
  );
}

export function SpotlightRevealMask() {
  return (
    <ScrollScene label="Softness" note="inner = radius × (1 − softness)">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-9 ${reduced ? "srm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-6">
            <div
              className="srm-card relative mx-auto h-36 w-40 overflow-hidden rounded-xl border border-fd-border"
              style={{ ["--d" as string]: "0ms" }}
            >
              <div className="absolute inset-0 bg-[var(--foreground)]/75" />
              <div
                className="absolute inset-0 bg-[var(--card)]"
                style={{ maskImage: HARD, WebkitMaskImage: HARD }}
              />
            </div>
            <div
              className="srm-card relative mx-auto h-36 w-40 overflow-hidden rounded-xl border border-fd-border"
              style={{ ["--d" as string]: "140ms" }}
            >
              <div className="absolute inset-0 bg-[var(--foreground)]/75" />
              <div
                className="absolute inset-0 bg-[var(--card)]"
                style={{ maskImage: SOFT, WebkitMaskImage: SOFT }}
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            transparent 0 → transparent inner → #000 radius
          </p>

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
