"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `gradientBackgroundPresets` bakes 48 full style objects — the same two
 * keys every time (`backgroundImage`/`background` + `backgroundColor`),
 * just different values. Three real presets, staggered in, to show the
 * range one component covers. Color is the subject here, so real color
 * is fair game (unlike the structural scenes).
 */
const CSS = `
@keyframes gbp-in {
  from { opacity: 0; transform: scale(0.92) translateY(6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
.gbp-swatch { animation: gbp-in 550ms cubic-bezier(0.3,0.7,0.4,1.15) var(--d) both; }
.gbp-static .gbp-swatch { animation: none; opacity: 1; transform: none; }
`;

const PRESETS = [
  {
    id: "blue-radial-glow",
    desc: "circle, slate base",
    delay: "0ms",
    style: {
      backgroundImage:
        "radial-gradient(circle 600px at 50% 50%, rgba(59,130,246,0.3), transparent)",
      backgroundColor: "#0f172a",
    },
  },
  {
    id: "aurora-midnight-glow",
    desc: "ellipse, wash from top",
    delay: "120ms",
    style: {
      background:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
    },
  },
  {
    id: "center-spotlight-violet",
    desc: "dead-center bloom",
    delay: "240ms",
    style: {
      backgroundImage:
        "radial-gradient(circle at center, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0.06) 20%, rgba(0, 0, 0, 0.0) 60%)",
      backgroundSize: "100% 100%",
      backgroundColor: "#000000",
    },
  },
] as const;

export function GradientBackgroundPresets() {
  return (
    <ScrollScene label="Presets" note="48 variants, same two style keys">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[560px] flex-col items-center gap-9 ${reduced ? "gbp-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 gap-4">
            {PRESETS.map((p) => (
              <div
                key={p.id}
                className="gbp-swatch h-24 overflow-hidden rounded-xl border border-fd-border"
                style={{ ...p.style, ["--d" as string]: p.delay }}
              />
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {PRESETS.map((p) => (
              <div key={p.id} className="flex flex-col gap-1.5">
                <dt className="font-mono text-[12px] text-fd-foreground">
                  {p.id}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {p.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
