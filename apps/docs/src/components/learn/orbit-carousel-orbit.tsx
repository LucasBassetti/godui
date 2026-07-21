"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Dragging never moves a slide directly — it rewrites `active` continuously
 * (`goTo(dragFrom - offset.x / 120)`), and every slide's `x`, `y`, `scale`,
 * `opacity`, `rotate` re-derive from its new signed distance under one
 * `MORPH_SPRING`. A release past the fling threshold (`|velocity.x| > 500`)
 * nudges `active` one extra slide beyond wherever the finger let go. Looped
 * here as a drag that overshoots into a fling, landing one slide further
 * than the drag alone would.
 *
 * Legend swatches match concrete diagram pieces (pointer · active plate ·
 * flick ghost) — not abstract opacity ramps that don't appear in the scene.
 */
const RADIUS = 150;
const ANGLE_STEP = 28;
const COUNT = 5;
const DUR = "4.6s";

function orbitTransform(offset: number) {
  const a = offset * ANGLE_STEP;
  const rad = (a * Math.PI) / 180;
  const abs = Math.abs(a);
  const x = RADIUS * Math.sin(rad);
  const y = RADIUS * (1 - Math.cos(rad));
  const scale = 1 - Math.min(abs / 70, 1) * 0.42;
  const opacity = Math.max(0, 1 - Math.min(abs / 82, 1) * 0.85);
  const rotate = a * 0.5;
  const z = Math.round(300 - abs);
  return { x, y, scale, opacity, rotate, z };
}

function rule(t: ReturnType<typeof orbitTransform>) {
  return `transform: translate(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px) scale(${t.scale.toFixed(3)}) rotate(${t.rotate.toFixed(1)}deg); opacity: ${t.opacity.toFixed(2)}; z-index: ${t.z};`;
}

function cardKeyframes(index: number): string {
  const base = index - 2; // rest offset, active = 2
  const rest = orbitTransform(base);
  const drag = orbitTransform(base - 0.7); // active drags to 2.7
  const overshoot = orbitTransform(base - 1.15); // fling overshoots
  const settle = orbitTransform(base - 1); // lands on active = 3
  return `
@keyframes occ-card-${index} {
  0%, 10%   { ${rule(rest)} }
  32%       { ${rule(drag)} }
  48%       { ${rule(overshoot)} }
  60%, 84%  { ${rule(settle)} }
  100%      { ${rule(rest)} }
}`;
}

// Flick overshoots past the new front slot (left of center on a leftward
// pan), then the spring settles back to center. Ghost marks that peak —
// not the land slot (which sat to the right of the moving plate and read
// backwards).
const ghostPeak = orbitTransform(-0.4);
const ghostLand = orbitTransform(0);

const CSS = `
@keyframes occ-pointer {
  0%, 10%   { transform: translateX(48px); opacity: 0; }
  16%, 44%  { opacity: 1; }
  32%       { transform: translateX(-42px); }
  56%, 100% { transform: translateX(-42px); opacity: 0; }
}
@keyframes occ-ghost {
  0%, 40%   { opacity: 0; transform: translate(${ghostPeak.x}px, ${ghostPeak.y}px) scale(${ghostPeak.scale}) rotate(${ghostPeak.rotate}deg); }
  48%       { opacity: 1; transform: translate(${ghostPeak.x}px, ${ghostPeak.y}px) scale(${ghostPeak.scale}) rotate(${ghostPeak.rotate}deg); }
  60%       { opacity: 0.55; transform: translate(${ghostLand.x}px, ${ghostLand.y}px) scale(${ghostLand.scale}) rotate(${ghostLand.rotate}deg); }
  72%, 100% { opacity: 0; transform: translate(${ghostLand.x}px, ${ghostLand.y}px) scale(${ghostLand.scale}) rotate(${ghostLand.rotate}deg); }
}
.occ-pointer { animation: occ-pointer ${DUR} cubic-bezier(0.3,0.7,0.4,1) infinite; }
.occ-ghost { animation: occ-ghost ${DUR} cubic-bezier(0.22,1,0.36,1) infinite; }
${Array.from({ length: COUNT })
  .map((_, i) => cardKeyframes(i))
  .join("\n")}
${Array.from({ length: COUNT })
  .map(
    (_, i) =>
      `.occ-card-${i} { animation: occ-card-${i} ${DUR} cubic-bezier(0.22,1,0.36,1) infinite; }`,
  )
  .join("\n")}
.occ-static .occ-pointer { animation: none; opacity: 0; }
.occ-static .occ-ghost {
  animation: none;
  opacity: 0.55;
  transform: translate(${ghostPeak.x}px, ${ghostPeak.y}px) scale(${ghostPeak.scale}) rotate(${ghostPeak.rotate}deg);
}
.occ-static .occ-card { animation: none !important; }
`;

const LEGEND: {
  name: string;
  desc: string;
  x: number;
  /** How the swatch is drawn — mirrors the matching diagram piece. */
  kind: "pointer" | "active" | "ghost";
}[] = [
  {
    name: "Pointer",
    desc: "pan · active ← x / 120",
    // Drag starts on the right.
    x: 90,
    kind: "pointer",
  },
  {
    name: "Active",
    desc: "spring 320 / 32 settles",
    x: 0,
    kind: "active",
  },
  {
    name: "Flick ghost",
    desc: "|vx| > 500 · overshoot, then +1",
    // Under the overshoot peak (left of center on a leftward flick).
    x: -90,
    kind: "ghost",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pointer") {
    return (
      <span className="size-2.5 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "ghost") {
    return (
      <span className="h-3.5 w-5 rounded-[5px] border border-dashed border-[var(--foreground)]/55" />
    );
  }
  return (
    <span className="h-3.5 w-5 rounded-[5px] bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
  );
}

export function OrbitCarouselOrbit() {
  return (
    <ScrollScene
      label="The motion"
      note="pan rewrites active, spring settles the arc"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[420px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[196px] w-full ${reduced ? "occ-static" : ""}`}
          >
            {/* Pointer — solid foreground dot; legend "Pointer" swatch. */}
            <div
              aria-hidden="true"
              className="occ-pointer absolute top-2 left-1/2 flex items-center gap-1.5 text-[var(--foreground)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M19 12H5M5 12l6-6M5 12l6 6" />
              </svg>
              <span className="size-2.5 rounded-full bg-[var(--foreground)]" />
            </div>

            <div className="absolute inset-0 top-8">
              {/* Flick peak — dashed plate left of center, then eases to land. */}
              <div
                aria-hidden="true"
                className="occ-ghost absolute top-0 left-1/2 size-14 rounded-2xl border border-dashed border-[var(--foreground)]/55"
                style={{ marginLeft: -28 }}
              />

              {Array.from({ length: COUNT }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slide row
                  key={i}
                  className={`occ-card occ-card-${i} absolute top-0 left-1/2 size-14 rounded-2xl border border-border shadow-md`}
                  style={{
                    marginLeft: -28,
                    // Index 2 starts as the active (filled) plate; after the
                    // flick settles on active=3, index 3 is the new front —
                    // keep 2 filled so the "Active" swatch stays readable
                    // through the loop (the plate that motion is about).
                    background: i === 2 ? "var(--foreground)" : "var(--card)",
                  }}
                />
              ))}
            </div>
          </div>

          <dl className="relative h-[4.25rem] w-full border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div
                key={item.name}
                className="absolute top-5 left-1/2 flex w-[4.75rem] flex-col items-center gap-1 text-center"
                style={{ transform: `translateX(calc(-50% + ${item.x}px))` }}
              >
                <LegendSwatch kind={item.kind} />
                <dt className="font-medium text-[12px] text-fd-foreground">
                  {item.name}
                </dt>
                <dd className="text-[10px] text-fd-muted-foreground leading-snug">
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
