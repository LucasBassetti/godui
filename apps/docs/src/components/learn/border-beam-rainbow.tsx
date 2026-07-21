"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * Color is the subject: rainbow uses the shared MagicButton hue order
 * (rainbow-1 → 5 → 3 → 4 → transparent); two-color uses --color-from/to.
 * Optional glow is a blur-md opacity-60 echo on the same offsetPath.
 */
const RAINBOW =
  "linear-gradient(to left, var(--rainbow-1), var(--rainbow-5), var(--rainbow-3), var(--rainbow-4), transparent)";

const CSS = `
@keyframes bbr-ride {
  from { offset-distance: 0%; }
  to   { offset-distance: 100%; }
}
.bbr-beam {
  animation: bbr-ride 5s linear infinite;
  offset-path: rect(0 auto auto 0 round 56px);
}
.bbr-glow {
  animation: bbr-ride 5s linear infinite;
  offset-path: rect(0 auto auto 0 round 56px);
  filter: blur(8px);
  opacity: 0.6;
}

@keyframes bbr-in {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
.bbr-card { animation: bbr-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) both; }

.bbr-static .bbr-beam,
.bbr-static .bbr-glow { animation: none; offset-distance: 20%; }
.bbr-static .bbr-card { animation: none; opacity: 1; transform: none; }
`;

const LEGEND = [
  {
    name: "Rainbow",
    desc: "RAINBOW_BEAM — same hue order as MagicButton, trails to transparent",
    swatch:
      "bg-[linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4))]",
  },
  {
    name: "Two-color",
    desc: "from-(--color-from) via-(--color-to) to-transparent",
    swatch: "bg-[linear-gradient(90deg,var(--chart-1),var(--chart-5))]",
  },
  {
    name: "Glow echo",
    desc: "second square: opacity-60 blur-md, same animate/transition",
    swatch: "bg-[var(--foreground)]/25 blur-[2px]",
  },
] as const;

export function BorderBeamRainbow() {
  return (
    <ScrollScene label="Gradient + glow" note="rainbow · two-color · blur echo">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[400px] flex-col items-center gap-9 ${reduced ? "bbr-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex items-center justify-center gap-5">
            {/* Rainbow + glow */}
            <div className="bbr-card relative size-[150px] overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(#000,#000),linear-gradient(#000,#000)]">
                <div
                  className="bbr-glow absolute aspect-square size-12"
                  style={{ background: RAINBOW }}
                />
                <div
                  className="bbr-beam absolute aspect-square size-12"
                  style={{ background: RAINBOW }}
                />
              </div>
            </div>

            {/* Two-color, no glow */}
            <div className="bbr-card relative size-[150px] overflow-hidden rounded-2xl border border-fd-border bg-[var(--card)]">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(#000,#000),linear-gradient(#000,#000)]">
                <div
                  className="bbr-beam absolute aspect-square size-12"
                  style={{
                    background:
                      "linear-gradient(to left, var(--chart-1), var(--chart-5), transparent)",
                  }}
                />
              </div>
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
