"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Card rim band vs lens full ramp — grayscale foreground ramps. The dashed
 * mid marks "no shift"; we do not paint the real #800000 / #008000 channels.
 */
const CSS = `
@keyframes lglm-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lglm-el { animation: lglm-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.lglm-static .lglm-el { animation: none; opacity: 1; transform: none; }
`;

function MapPlate({ band, className }: { band: number; className?: string }) {
  const lo = ((0.5 - band / 2) * 100).toFixed(0);
  const hi = ((0.5 + band / 2) * 100).toFixed(0);
  return (
    <div
      className={`relative overflow-hidden bg-[var(--card)] ${className ?? ""}`}
      style={{
        backgroundImage:
          band > 0
            ? `linear-gradient(90deg, var(--foreground) 0%, transparent ${lo}%, transparent ${hi}%, var(--foreground) 100%)`
            : "linear-gradient(90deg, var(--foreground) 0%, transparent 50%, var(--foreground) 100%)",
        opacity: 0.55,
      }}
    >
      {band > 0 ? (
        <div
          className="absolute inset-y-0 border-[var(--foreground)]/30 border-x border-dashed"
          style={{ left: `${lo}%`, right: `${100 - Number(hi)}%` }}
        />
      ) : null}
    </div>
  );
}

const LEGEND = [
  {
    name: "Neutral mid",
    desc: "dashed band = no displacement",
    kind: "band" as const,
  },
  {
    name: "Converging lens",
    desc: "continuous ramp edge-to-edge",
    kind: "lens" as const,
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "lens") {
    return (
      <span
        className="size-4 rounded-full border border-fd-border ring-1 ring-fd-border ring-inset"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--foreground) 0%, transparent 50%, var(--foreground) 100%)",
          opacity: 0.55,
        }}
      />
    );
  }
  return (
    <span
      className="relative h-4 w-7 overflow-hidden rounded-2xl border border-fd-border ring-1 ring-fd-border ring-inset"
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--foreground) 0%, transparent 35%, transparent 65%, var(--foreground) 100%)",
        opacity: 0.55,
      }}
    >
      <span className="absolute inset-y-0 left-[35%] right-[35%] border-[var(--foreground)]/30 border-x border-dashed" />
    </span>
  );
}

export function LiquidGlassLensMap() {
  return (
    <ScrollScene label="Displacement map" note="band=0.3 card · band=0 lens">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[440px] flex-col items-center gap-8 ${reduced ? "lglm-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-5">
            <div
              className="lglm-el flex flex-col items-center gap-2"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <MapPlate
                band={0.3}
                className="h-28 w-full rounded-2xl border border-fd-border"
              />
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                card · band 0.3
              </span>
            </div>
            <div
              className="lglm-el flex flex-col items-center gap-2"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <MapPlate
                band={0}
                className="size-28 rounded-full border border-fd-border"
              />
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                lens · band 0
              </span>
            </div>
          </div>

          <p className="max-w-[38ch] text-center text-[13px] text-fd-muted-foreground">
            Real maps pack X into red and Y into green. Here a single grayscale
            ramp is enough — the dashed mid is the neutral &quot;no shift&quot;
            band.
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
