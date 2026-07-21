"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Magic Input is three absolutely-stacked spans inside one `group`: a blurred
 * shadow, a colored edge, and the real `<input>` on top. Exploded along Z so
 * you can see the parallax sandwich the lift animates. Input-shaped (wide,
 * short) — the geometry the reader meets in the Result.
 */
const CSS = `
@keyframes mia-explode {
  from { opacity: 0; transform: translateZ(0px); }
  to   { opacity: 1; transform: translateZ(var(--tz)); }
}
.mia-plate {
  position: absolute; inset: 0; margin: auto;
  height: 52px; width: 210px; border-radius: 12px;
  opacity: 0; transform: translateZ(var(--tz));
  animation: mia-explode 900ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.mia-static .mia-plate { opacity: 1; animation: none; }
`;

type Plate = { key: string; tz: number; delay: number; cls: string };

const PLATES: Plate[] = [
  { key: "shadow", tz: -34, delay: 0, cls: "bg-black/50 blur-[6px]" },
  { key: "edge", tz: 22, delay: 120, cls: "bg-[var(--foreground)]/15" },
  {
    key: "front",
    tz: 74,
    delay: 240,
    cls: "flex items-center border-2 border-[var(--foreground)]/40 bg-[var(--card)] px-4",
  },
];

const LEGEND: {
  name: string;
  desc: string;
  kind: "front" | "edge" | "shadow";
}[] = [
  {
    name: "Front",
    desc: "the real <input> you type in",
    kind: "front",
  },
  {
    name: "Edge",
    desc: "colored gradient, fakes the 3D wall",
    kind: "edge",
  },
  {
    name: "Shadow",
    desc: "blurred, grounds the lift",
    kind: "shadow",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "front") {
    return (
      <span className="h-3.5 w-7 rounded-[4px] border-2 border-[var(--foreground)]/40 bg-[var(--card)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "edge") {
    return (
      <span className="h-3.5 w-7 rounded-[4px] bg-[var(--foreground)]/15 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-7 rounded-[4px] bg-black/60 ring-1 ring-fd-border ring-inset" />
  );
}

export function MagicInputAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="one group, three stacked layers">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-[200px] items-center justify-center [perspective:1100px] ${reduced ? "mia-static" : ""}`}
          >
            <div className="relative h-[160px] w-[240px] [transform:rotateX(56deg)_rotateZ(-40deg)] [transform-style:preserve-3d]">
              {PLATES.map((p) => (
                <div
                  key={p.key}
                  className={`mia-plate ${p.cls}`}
                  style={
                    {
                      "--tz": `${p.tz}px`,
                      "--d": `${p.delay}ms`,
                    } as CSSProperties
                  }
                >
                  {p.key === "front" ? (
                    <span className="h-2 w-20 rounded-full bg-[var(--foreground)]/25" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
