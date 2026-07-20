"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Five fixed presets from `SIZES`, drawn at 0.5× so the family fits one
 * frame. Pills (compact / default / long) share a baseline on the top row;
 * the two taller cards sit below — grouping by aspect ratio instead of
 * dumping five mismatched black blobs into a wrapping flex.
 */
const PILLS: {
  name: string;
  w: number;
  h: number;
  r: number;
  dims: string;
}[] = [
  { name: "compact", w: 70, h: 18, r: 9, dims: "140×36 · r18" },
  { name: "default", w: 110, h: 22, r: 11, dims: "220×44 · r22" },
  { name: "long", w: 180, h: 26, r: 13, dims: "360×52 · r26" },
];

const CARDS: {
  name: string;
  w: number;
  h: number;
  r: number;
  dims: string;
}[] = [
  { name: "tall", w: 130, h: 60, r: 14, dims: "260×120 · r28" },
  { name: "large", w: 180, h: 100, r: 18, dims: "360×200 · r36" },
];

const ALL = [...PILLS, ...CARDS];

const CSS = `
@keyframes dia-in {
  from { opacity: 0; transform: translateY(10px) scale(0.96); }
  to   { opacity: 1; transform: none; }
}
.dia-el { opacity: 0; animation: dia-in 520ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.dia-static .dia-el { opacity: 1; animation: none; transform: none; }
`;

function Island({
  w,
  h,
  r,
  delay,
}: {
  w: number;
  h: number;
  r: number;
  delay: string;
}) {
  return (
    <div
      className="dia-el bg-black"
      style={
        {
          width: w,
          height: h,
          borderRadius: r,
          "--d": delay,
        } as CSSProperties
      }
    />
  );
}

export function DynamicIslandAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="five fixed presets · nothing computed">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "dia-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="flex w-full flex-col items-center gap-5">
            {/* Capsule family — same height class, shared baseline. */}
            <div className="flex items-end justify-center gap-3">
              {PILLS.map((s, i) => (
                <Island
                  key={s.name}
                  w={s.w}
                  h={s.h}
                  r={s.r}
                  delay={`${i * 80}ms`}
                />
              ))}
            </div>
            {/* Card family — taller presets, optically centered under the row. */}
            <div className="flex items-end justify-center gap-4">
              {CARDS.map((s, i) => (
                <Island
                  key={s.name}
                  w={s.w}
                  h={s.h}
                  r={s.r}
                  delay={`${(i + 3) * 80}ms`}
                />
              ))}
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5 sm:grid-cols-5">
            {ALL.map((s) => (
              <div key={s.name} className="flex flex-col gap-1.5">
                <span className="h-1.5 w-8 rounded-full bg-black ring-1 ring-fd-border ring-inset" />
                <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                  {s.name}
                </dt>
                <dd className="font-mono text-[11px] text-fd-muted-foreground tabular-nums">
                  {s.dims}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
