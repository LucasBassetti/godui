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
 */
const RADIUS = 92;
const ANGLE_STEP = 26;
const COUNT = 5;

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

const CSS = `
@keyframes occ-pointer {
  0%, 10%   { transform: translateX(34px); opacity: 0; }
  16%, 44%  { opacity: 1; }
  32%       { transform: translateX(-30px); }
  56%, 100% { transform: translateX(-30px); opacity: 0; }
}
.occ-pointer { animation: occ-pointer 4.6s cubic-bezier(0.3,0.7,0.4,1) infinite; }
${Array.from({ length: COUNT })
  .map((_, i) => cardKeyframes(i))
  .join("\n")}
${Array.from({ length: COUNT })
  .map(
    (_, i) =>
      `.occ-card-${i} { animation: occ-card-${i} 4.6s cubic-bezier(0.22,1,0.36,1) infinite; }`,
  )
  .join("\n")}
.occ-static .occ-pointer { animation: none; opacity: 0; }
.occ-static .occ-card { animation: none !important; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Pan",
    desc: "active = dragFrom − offset.x / 120, live",
    swatch: "bg-[var(--foreground)]/30",
  },
  {
    name: "Settle",
    desc: "spring 320 / 32 / 0.9 resolves every property",
    swatch: "bg-[var(--foreground)]/60",
  },
  {
    name: "Flick",
    desc: "|velocity.x| > 500 nudges one extra slide",
    swatch: "bg-[var(--foreground)]",
  },
];

export function OrbitCarouselOrbit() {
  return (
    <ScrollScene
      label="The motion"
      note="pan rewrites active, spring settles the arc"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[168px] w-full ${reduced ? "occ-static" : ""}`}
          >
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
              {Array.from({ length: COUNT }).map((_, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slide row
                  key={i}
                  className={`occ-card occ-card-${i} absolute top-0 left-1/2 size-16 rounded-2xl border border-border shadow-md`}
                  style={{
                    marginLeft: -32,
                    background: i === 2 ? "var(--foreground)" : "var(--card)",
                  }}
                />
              ))}
            </div>
          </div>

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
