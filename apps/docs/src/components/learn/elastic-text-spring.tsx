"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Each segment's raw weight target feeds `useSpring(..., { stiffness: 150,
 * damping: 18, mass: 1 })`. When the spotlight steps to a new index, weight
 * doesn't snap — it overshoots slightly and settles. Diagrammed as a single
 * active bar springing up while neighbors stay at rest.
 */

const CHARS = 7;
const ACTIVE = 3;

const CSS = `
@keyframes etsp-settle {
  0%, 8%   { transform: scaleY(0.3); opacity: 0.35; }
  42%      { transform: scaleY(1.12); opacity: 0.95; }
  58%      { transform: scaleY(0.94); opacity: 0.85; }
  72%, 100%{ transform: scaleY(1); opacity: 0.9; }
}
@keyframes etsp-pulse {
  0%, 100% { opacity: 0.25; }
  40%, 70% { opacity: 0.55; }
}
.etsp-active {
  transform-origin: bottom center;
  animation: etsp-settle 2.4s cubic-bezier(0.22, 1.2, 0.36, 1) infinite;
}
.etsp-rest {
  transform-origin: bottom center;
  transform: scaleY(0.3);
  opacity: 0.35;
  animation: etsp-pulse 2.4s ease-in-out infinite;
}
.etsp-static .etsp-active {
  animation: none;
  transform: scaleY(1);
  opacity: 0.9;
}
.etsp-static .etsp-rest {
  animation: none;
  transform: scaleY(0.3);
  opacity: 0.35;
}
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "target" | "spring";
}[] = [
  {
    name: "Raw target",
    desc: "useTransform(spotlight → influence)",
    kind: "target",
  },
  {
    name: "Spring",
    desc: "stiffness 150 · damping 18 · mass 1",
    kind: "spring",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "spring") {
    return (
      <span className="flex h-6 items-end">
        <span className="h-6 w-2 rounded-sm bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
      </span>
    );
  }
  return (
    <span className="flex h-6 items-end">
      <span className="h-2 w-2 rounded-sm bg-[var(--foreground)]/35 ring-1 ring-fd-border ring-inset" />
    </span>
  );
}

export function ElasticTextSpring() {
  return (
    <ScrollScene
      label="The spring"
      note="target moves · weight settles with overshoot"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[440px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-28 items-end justify-center gap-2 ${reduced ? "etsp-static" : ""}`}
            aria-hidden="true"
          >
            {Array.from({ length: CHARS }).map((_, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length segment row
                key={i}
                className={`h-24 w-3 rounded-sm bg-[var(--foreground)] sm:w-3.5 ${
                  i === ACTIVE ? "etsp-active" : "etsp-rest"
                }`}
              />
            ))}
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"useSpring(rawWeight, { stiffness: 150, damping: 18, mass: 1 })"}
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
