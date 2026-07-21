"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * ConfettiButton: getBoundingClientRect → normalize center to viewport
 * fractions → canvas-confetti origin { x, y }.
 */
const CSS = `
@keyframes cfo-btn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cfo-btn { animation: cfo-btn 480ms cubic-bezier(0.3,0.7,0.4,1.2) both; }

@keyframes cfo-ray {
  from { opacity: 0; transform: scaleY(0); }
  to   { opacity: 1; transform: scaleY(1); }
}
.cfo-ray { animation: cfo-ray 520ms cubic-bezier(0.3,0.7,0.4,1) 160ms both; transform-origin: bottom center; }

@keyframes cfo-dot {
  0%   { opacity: 0; transform: scale(0.5); }
  40%  { opacity: 1; transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}
.cfo-dot { animation: cfo-dot 560ms cubic-bezier(0.3,0.7,0.4,1.2) 280ms both; }

@keyframes cfo-chip {
  from { opacity: 0; transform: translate(0, 0) scale(0.4); }
  to   { opacity: 0.8; transform: translate(var(--tx), var(--ty)) scale(1); }
}
.cfo-chip { animation: cfo-chip 640ms cubic-bezier(0.22, 1, 0.36, 1) var(--d) both; }

.cfo-static .cfo-btn,
.cfo-static .cfo-ray,
.cfo-static .cfo-dot { animation: none; opacity: 1; transform: none; }
.cfo-static .cfo-chip {
  animation: none;
  opacity: 0.8;
  transform: translate(var(--tx), var(--ty)) scale(1);
}
`;

const CHIPS = [
  { tx: -36, ty: -48, d: "360ms" },
  { tx: 28, ty: -56, d: "400ms" },
  { tx: -52, ty: -20, d: "440ms" },
  { tx: 48, ty: -18, d: "480ms" },
] as const;

const LEGEND = [
  {
    name: "Button rect",
    desc: "e.currentTarget.getBoundingClientRect()",
    kind: "button",
  },
  {
    name: "Normalized origin",
    desc: "x = (left + w/2) / innerWidth · y = (top + h/2) / innerHeight",
    kind: "origin",
  },
  {
    name: "Burst",
    desc: "canvasConfetti({ ...DEFAULTS, origin: { x, y }, ...options })",
    kind: "burst",
  },
] as const;

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "button") {
    return (
      <span className="h-2.5 w-7 rounded-lg border border-fd-border bg-[var(--muted)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "origin") {
    return (
      <span className="size-2 rounded-full bg-[var(--foreground)]/60 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-2.5 rounded-[1px] bg-[var(--foreground)]/40 ring-1 ring-fd-border ring-inset" />
  );
}

export function ConfettiOrigin() {
  return (
    <ScrollScene label="Button origin" note="rect → viewport fractions">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col items-center gap-9 ${reduced ? "cfo-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="relative flex h-[220px] w-full items-end justify-center pb-2">
            {/* Viewport frame */}
            <div className="absolute inset-0 rounded-xl border border-dashed border-fd-border/80" />

            {/* Vertical guide from top to button center */}
            <div className="cfo-ray absolute bottom-[52px] left-1/2 h-[100px] w-px -translate-x-1/2 bg-[var(--foreground)]/20" />
            <div
              className="cfo-ray absolute bottom-[52px] left-[12%] right-[12%] h-px bg-[var(--foreground)]/15"
              style={{ transformOrigin: "center" }}
            />

            {/* Origin crosshair */}
            <div className="cfo-dot absolute bottom-[48px] left-1/2 z-raised size-2.5 -translate-x-1/2 rounded-full bg-[var(--foreground)]/60" />

            {CHIPS.map((c, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                className="cfo-chip absolute bottom-[48px] left-1/2 z-raised h-1.5 w-2.5 -translate-x-1/2 rounded-[1px] bg-[var(--foreground)]/40"
                style={
                  {
                    "--tx": `${c.tx}px`,
                    "--ty": `${c.ty}px`,
                    "--d": c.d,
                  } as CSSProperties
                }
              />
            ))}

            {/* Button stand-in — token bar face, no copy */}
            <div className="cfo-btn relative z-raised flex h-11 w-36 items-center justify-center rounded-lg border border-fd-border bg-[var(--muted)] shadow-sm">
              <span className="h-2 w-16 rounded-full bg-[var(--foreground)]/30" />
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
