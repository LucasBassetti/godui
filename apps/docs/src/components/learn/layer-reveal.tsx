"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

const CSS = `
@keyframes lr-explode {
  from { opacity: 0; transform: translateZ(0px); }
  to   { opacity: 1; transform: translateZ(var(--tz)); }
}
.lr-plate {
  position: absolute; inset: 0; margin: auto;
  height: 54px; width: 172px; border-radius: 14px;
  opacity: 0; transform: translateZ(var(--tz));
  animation: lr-explode 900ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.lr-static .lr-plate { opacity: 1; animation: none; }
`;

type Plate = { key: string; tz: number; delay: number; cls: string };

const PLATES: Plate[] = [
  { key: "shadow", tz: -30, delay: 0, cls: "bg-black/50 blur-[5px]" },
  {
    key: "edge",
    tz: 24,
    delay: 120,
    cls: "bg-zinc-500 dark:bg-zinc-600",
  },
  {
    key: "face",
    tz: 78,
    delay: 240,
    cls: "bg-primary",
  },
];

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  { name: "Front face", desc: "what you press", swatch: "bg-primary" },
  {
    name: "Edge",
    desc: "fakes the thickness",
    swatch: "bg-zinc-500 dark:bg-zinc-600",
  },
  { name: "Shadow", desc: "grounds it", swatch: "bg-black/60" },
];

export function LayerReveal() {
  return (
    <ScrollScene label="Anatomy" note="the three-layer stack">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[520px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex h-[190px] items-center justify-center [perspective:1000px] ${reduced ? "lr-static" : ""}`}
          >
            <div className="relative h-[160px] w-[200px] [transform:rotateX(55deg)_rotateZ(-38deg)] [transform-style:preserve-3d]">
              {PLATES.map((p) => (
                <div
                  key={p.key}
                  className={`lr-plate ${p.cls}`}
                  style={
                    {
                      "--tz": `${p.tz}px`,
                      "--d": `${p.delay}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          {/* Legend — grounded, reads like a diagram key instead of floating tags. */}
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
