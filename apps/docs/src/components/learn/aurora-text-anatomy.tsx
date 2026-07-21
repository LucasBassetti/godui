"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Anatomy of AuroraText: the raw 135° rainbow fill, the glyph-shaped clip
 * (token bars stand in for letters), then both together. Color only on the
 * gradient column — the subject *is* the rainbow.
 */

const STOPS = [
  "#ff2d55",
  "#ff9500",
  "#ffd60a",
  "#34c759",
  "#00c7be",
  "#0a84ff",
  "#5e5ce6",
  "#bf5af2",
  "#ff2d55",
].join(", ");

const GRADIENT = `linear-gradient(135deg, ${STOPS})`;

const CSS = `
@keyframes ata-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ata-col {
  opacity: 0;
  animation: ata-in 700ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.ata-static .ata-col { opacity: 1; animation: none; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "Gradient",
    desc: "135° linear-gradient, looped stops",
    swatch:
      "bg-[linear-gradient(90deg,#ff2d55,#ffd60a,#34c759,#0a84ff,#bf5af2)]",
  },
  {
    name: "Clip",
    desc: "bg-clip-text + text-transparent",
    swatch: "border-2 border-[var(--foreground)]/40 bg-transparent",
  },
  {
    name: "Together",
    desc: "gradient visible only through glyphs",
    swatch: "bg-[linear-gradient(90deg,#ff2d55,#ffd60a,#0a84ff)] opacity-80",
  },
];

function TokenBars({ fill }: { fill: "muted" | "gradient" }) {
  const bar =
    fill === "gradient"
      ? "h-2.5 rounded-full"
      : "h-2.5 rounded-full bg-[var(--foreground)]/30";
  const style =
    fill === "gradient"
      ? ({
          backgroundImage: GRADIENT,
          backgroundSize: "200% auto",
          backgroundPosition: "0% 50%",
        } as CSSProperties)
      : undefined;
  return (
    <div className="flex flex-col items-start gap-2" aria-hidden="true">
      <span className={`${bar} w-16`} style={style} />
      <span className={`${bar} w-12`} style={style} />
      <span className={`${bar} w-14`} style={style} />
    </div>
  );
}

const COLUMNS: {
  key: string;
  caption: string;
  delay: number;
  kind: "fill" | "clip" | "together";
}[] = [
  { key: "fill", caption: "gradient fill", delay: 0, kind: "fill" },
  { key: "clip", caption: "clip only", delay: 120, kind: "clip" },
  { key: "together", caption: "together", delay: 240, kind: "together" },
];

export function AuroraTextAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="fill · clip · together">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between ${reduced ? "ata-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="ata-col flex flex-col items-center gap-3"
                style={{ "--d": `${col.delay}ms` } as CSSProperties}
              >
                <div
                  className="flex h-[88px] w-[140px] items-center justify-center overflow-hidden rounded-xl border border-[var(--foreground)]/15 bg-[var(--card)]"
                  aria-hidden="true"
                >
                  {col.kind === "fill" ? (
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: GRADIENT,
                        backgroundSize: "200% auto",
                        backgroundPosition: "0% 50%",
                      }}
                    />
                  ) : null}
                  {col.kind === "clip" ? <TokenBars fill="muted" /> : null}
                  {col.kind === "together" ? (
                    <TokenBars fill="gradient" />
                  ) : null}
                </div>
                <p className="font-mono text-[11px] text-fd-muted-foreground">
                  {col.caption}
                </p>
              </div>
            ))}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ring-1 ring-fd-border ring-inset ${item.swatch}`}
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
