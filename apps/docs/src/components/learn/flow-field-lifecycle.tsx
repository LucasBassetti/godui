"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three gates that stop the FlowField rAF loop — each card gets its own
 * silhouette so IO / visibility / reduced-motion read as different mechanisms,
 * not three identical pills.
 */
const CSS = `
@keyframes ffl-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ffl-el { animation: ffl-in 550ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.ffl-static .ffl-el { animation: none; opacity: 1; transform: none; }

/* IO — plate drifts out of the viewport frame and fades */
@keyframes ffl-io-slide {
  0%, 18%   { transform: translateY(0); opacity: 1; }
  55%, 100% { transform: translateY(28px); opacity: 0.2; }
}
.ffl-io-plate { animation: ffl-io-slide 2.8s cubic-bezier(0.3,0.7,0.4,1) infinite; }
.ffl-static .ffl-io-plate { animation: none; transform: translateY(28px); opacity: 0.2; }

/* Visibility — page face dims when the "tab" is hidden */
@keyframes ffl-vis-dim {
  0%, 22%   { opacity: 1; }
  45%, 78%  { opacity: 0.18; }
  100%     { opacity: 1; }
}
.ffl-vis-face { animation: ffl-vis-dim 3s ease-in-out infinite; }
.ffl-static .ffl-vis-face { animation: none; opacity: 0.18; }

/* Reduced — trails freeze after a short run */
@keyframes ffl-reduce-draw {
  0%   { stroke-dashoffset: 36; opacity: 0.35; }
  40%  { stroke-dashoffset: 0; opacity: 0.9; }
  100% { stroke-dashoffset: 0; opacity: 0.9; }
}
.ffl-reduce-path {
  stroke-dasharray: 36;
  animation: ffl-reduce-draw 2.6s cubic-bezier(0.3,0.7,0.4,1) infinite;
}
.ffl-static .ffl-reduce-path {
  animation: none;
  stroke-dashoffset: 0;
  opacity: 0.9;
}
`;

const CARDS = [
  {
    id: "io",
    delay: "0ms",
    name: "Intersection",
    desc: "IO pauses the loop once the canvas leaves the viewport",
    caption: "offscreen → paused",
  },
  {
    id: "vis",
    delay: "90ms",
    name: "Visibility",
    desc: "document.hidden stops frames while the tab is backgrounded",
    caption: "tab hidden → raf = 0",
  },
  {
    id: "reduce",
    delay: "180ms",
    name: "Reduced",
    desc: "~240 frozen steps, then a still frame — no ongoing rAF",
    caption: "240 steps → freeze",
  },
] as const;

function IoGlyph() {
  return (
    <div className="relative h-14 w-16 overflow-hidden rounded-md border border-fd-border bg-[var(--muted)]/40">
      {/* viewport chrome */}
      <div className="absolute inset-x-0 top-0 h-2 border-fd-border border-b bg-[var(--card)]" />
      <div
        className="ffl-io-plate absolute inset-x-2 top-4 h-10 rounded-sm bg-[var(--foreground)]/25"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.12) 60%, transparent 60%)",
          backgroundSize: "8px 8px",
        }}
      />
    </div>
  );
}

function VisGlyph() {
  return (
    <div className="relative flex h-14 w-16 flex-col overflow-hidden rounded-md border border-fd-border bg-[var(--card)]">
      {/* tab strip */}
      <div className="flex h-3.5 items-end gap-0.5 border-fd-border border-b px-1 pt-0.5">
        <div className="h-2.5 w-5 rounded-t-sm bg-[var(--muted)]" />
        <div className="h-2 w-4 rounded-t-sm bg-[var(--muted)]/40" />
      </div>
      <div className="ffl-vis-face flex flex-1 flex-col justify-center gap-1 px-2">
        <div className="h-1 w-8 rounded-full bg-[var(--foreground)]/35" />
        <div className="h-1 w-6 rounded-full bg-[var(--foreground)]/20" />
        <div className="h-1 w-7 rounded-full bg-[var(--foreground)]/15" />
      </div>
    </div>
  );
}

function ReduceGlyph() {
  return (
    <div className="relative flex h-14 w-16 items-center justify-center overflow-hidden rounded-md border border-fd-border bg-[var(--card)]">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 36"
        className="h-9 w-12 text-[var(--foreground)]"
      >
        <path
          className="ffl-reduce-path fill-none"
          d="M4 28 C10 12, 16 8, 24 18 S36 30, 44 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.85}
        />
        <path
          className="ffl-reduce-path fill-none"
          d="M4 22 C12 16, 18 6, 26 14 S38 26, 44 16"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          opacity={0.4}
          style={{ animationDelay: "120ms" }}
        />
        {/* freeze tick — vertical bar after the draw settles */}
        <line
          x1="40"
          y1="8"
          x2="40"
          y2="28"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity={0.35}
        />
      </svg>
    </div>
  );
}

const GLYPHS = {
  io: IoGlyph,
  vis: VisGlyph,
  reduce: ReduceGlyph,
} as const;

function LegendSwatch({ id }: { id: (typeof CARDS)[number]["id"] }) {
  if (id === "io") {
    return (
      <span
        className="h-3 w-5 rounded-sm bg-[var(--foreground)]/25 ring-1 ring-fd-border ring-inset"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.12) 60%, transparent 60%)",
          backgroundSize: "8px 8px",
        }}
      />
    );
  }
  if (id === "vis") {
    return (
      <span className="relative h-3.5 w-5 overflow-hidden rounded-md border border-fd-border bg-[var(--card)] ring-1 ring-fd-border ring-inset">
        <span className="absolute inset-x-0 top-0 h-1 border-fd-border border-b bg-[var(--muted)]" />
        <span className="absolute inset-x-1 bottom-1 h-px rounded-full bg-[var(--foreground)]/35" />
      </span>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 12"
      className="h-3 w-8 text-[var(--foreground)]"
    >
      <path
        d="M2 8 C8 4, 12 4, 16 8 S24 10, 30 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  );
}

export function FlowFieldLifecycle() {
  return (
    <ScrollScene label="Lifecycle" note="IO · visibility · reduced">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[480px] flex-col items-center gap-8 ${reduced ? "ffl-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-3 gap-3">
            {CARDS.map((card) => {
              const Glyph = GLYPHS[card.id];
              return (
                <div
                  key={card.id}
                  className="ffl-el flex flex-col items-center gap-2.5 rounded-xl border border-fd-border bg-[var(--card)] p-3"
                  style={{ "--d": card.delay } as CSSProperties}
                >
                  <Glyph />
                  <span className="font-mono text-[11px] text-fd-muted-foreground">
                    {card.caption}
                  </span>
                </div>
              );
            })}
          </div>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {CARDS.map((card) => (
              <div key={card.id} className="flex flex-col gap-1.5">
                <LegendSwatch id={card.id} />
                <dt className="font-medium text-[13px] text-fd-foreground">
                  {card.name}
                </dt>
                <dd className="text-[12px] text-fd-muted-foreground">
                  {card.desc}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
