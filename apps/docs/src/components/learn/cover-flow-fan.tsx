"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Dragging the stage doesn't move slides directly — it rewrites `active`
 * (`goTo(dragFrom - offset.x / spacing)`), and every slide's transform
 * re-derives from its new signed distance under one spring. A fast release
 * (`|velocity.x| > 600`) nudges `active` one extra slide in the throw
 * direction. Looped here as active settling from index 2 to 1 and back.
 */
const COUNT = 5;
const SPACING = 62;

function coverTransform(offset: number) {
  const sign = Math.sign(offset);
  const abs = Math.abs(offset);
  const near = Math.min(abs, 1);
  const far = Math.max(abs - 1, 0);
  const x = sign * (near * SPACING + far * SPACING * 0.55);
  const rotateY = -Math.max(-1, Math.min(1, offset)) * 52;
  const z = -Math.min(abs, 3) * 56;
  const scale = 1 - Math.min(abs, 3) * 0.08;
  return { x, rotateY, z, scale };
}

function cardKeyframes(index: number): string {
  const rest = coverTransform(index - 2);
  const dragged = coverTransform(index - 1);
  const t = (v: ReturnType<typeof coverTransform>) =>
    `translateX(${v.x.toFixed(1)}px) translateZ(${v.z.toFixed(1)}px) rotateY(${v.rotateY.toFixed(1)}deg) scale(${v.scale.toFixed(3)})`;
  return `
@keyframes cff-card-${index} {
  0%, 10%   { transform: ${t(rest)}; }
  40%, 60%  { transform: ${t(dragged)}; }
  90%, 100% { transform: ${t(rest)}; }
}`;
}

const CSS = `
@keyframes cff-pointer {
  0%, 10%   { transform: translateX(30px); opacity: 0; }
  16%, 54%  { opacity: 1; }
  40%, 60%  { transform: translateX(-30px); }
  84%, 100% { transform: translateX(30px); opacity: 0; }
}
.cff-pointer { animation: cff-pointer 3.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }
${Array.from({ length: COUNT })
  .map((_, i) => cardKeyframes(i))
  .join("\n")}
${Array.from({ length: COUNT })
  .map(
    (_, i) =>
      `.cff-card-${i} { animation: cff-card-${i} 3.2s cubic-bezier(0.3,0.7,0.4,1) infinite; }`,
  )
  .join("\n")}
.cff-static .cff-pointer { animation: none; opacity: 0; }
.cff-static .cff-card { animation: none !important; }
`;

const LEGEND: {
  name: string;
  desc: string;
  kind: "pointer" | "active" | "neighbor";
}[] = [
  {
    name: "Pointer",
    desc: "pan live — active ← offset.x / spacing",
    kind: "pointer",
  },
  {
    name: "Active slide",
    desc: "foreground plate at offset 0",
    kind: "active",
  },
  {
    name: "Neighbours",
    desc: "muted plates · flick |vx| > 600 nudges +1",
    kind: "neighbor",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "pointer") {
    return (
      <span className="size-2.5 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "active") {
    return (
      <span className="h-3.5 w-5 rounded-md bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-5 rounded-md bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
  );
}

export function CoverFlowFan() {
  return (
    <ScrollScene
      label="The motion"
      note="drag rewrites active, spring settles the fan"
    >
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[480px] flex-col items-center gap-9">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`relative h-[152px] w-full [perspective:900px] ${reduced ? "cff-static" : ""}`}
          >
            <div
              aria-hidden="true"
              className="cff-pointer absolute top-0 left-1/2 flex items-center gap-1.5 text-[var(--foreground)]"
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
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
            <div className="absolute inset-0 top-6 [transform-style:preserve-3d]">
              {Array.from({ length: COUNT }).map((_, i) => {
                const isCenter = i === 2;
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slide row
                    key={i}
                    className={`cff-card cff-card-${i} absolute top-1/2 left-1/2 size-16 rounded-xl border border-border shadow-sm`}
                    style={
                      {
                        marginLeft: -32,
                        marginTop: -32,
                        zIndex: 100 - Math.abs(i - 2) * 10,
                        background: isCenter
                          ? "var(--foreground)"
                          : "var(--muted)",
                      } as CSSProperties
                    }
                  />
                );
              })}
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
