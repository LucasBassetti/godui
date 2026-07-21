"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Card must stay centered on the pill. Never animate `transform` on the
 * positioned node — a keyframe `transform` overrides Tailwind's
 * `-translate-x-1/2` and leaves the card left-shifted (caret on the pill,
 * body hanging to the left). Position on an outer shell; animate opacity /
 * translateY / scale only on an inner face.
 */
const CSS = `
@keyframes sca-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
}
@keyframes sca-face {
  from { opacity: 0; transform: translateY(6px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.sca-panel { opacity: 0; animation: sca-in 560ms cubic-bezier(0.3,0.7,0.4,1.2) var(--d) both; }
.sca-face { opacity: 0; animation: sca-face 520ms cubic-bezier(0.3,0.7,0.4,1) 200ms both; }
.sca-static .sca-panel,
.sca-static .sca-face { opacity: 1; animation: none; transform: none; }
`;

const LEGEND = [
  {
    name: "Wrapper",
    desc: "relative · owns both pill and card",
    swatch: "border border-dashed border-[var(--foreground)]/40 bg-transparent",
  },
  {
    name: "Pill",
    desc: "numbered <a> — the anchor",
    swatch: "bg-[var(--muted)]",
  },
  {
    name: "Card + caret",
    desc: "left-1/2 −translate-x-1/2 · centered on pill",
    swatch: "bg-[var(--popover)]",
  },
] as const;

function Word({ className }: { className: string }) {
  return (
    <span
      className={`h-2 rounded-full bg-[var(--foreground)]/15 ${className}`}
    />
  );
}

function Pill({ lit = false }: { lit?: boolean }) {
  return (
    <span
      className={`inline-flex h-4 min-w-4 items-center justify-center rounded-[5px] px-1 ${
        lit
          ? "bg-[var(--foreground)]/85 shadow-[0_0_0_3px_color-mix(in_oklch,var(--foreground)_18%,transparent)]"
          : "bg-[var(--muted)] ring-1 ring-fd-border ring-inset"
      }`}
    >
      <span
        className={`block size-1.5 rounded-[2px] ${
          lit ? "bg-[var(--background)]" : "bg-[var(--foreground)]/35"
        }`}
      />
    </span>
  );
}

/**
 * Real DOM shape:
 *   relative wrapper
 *     ├─ pill
 *     └─ position shell (left-1/2 -translate-x-1/2)  ← never animated
 *          └─ face (opacity / y / scale only)
 *               └─ caret at face's horizontal center
 */
function CitationUnit({ open }: { open: boolean }) {
  return (
    <span
      className={`relative inline-flex align-baseline ${
        open
          ? "rounded-md ring-1 ring-dashed ring-[var(--foreground)]/35 ring-offset-2 ring-offset-[var(--card)]"
          : ""
      }`}
    >
      <Pill lit={open} />
      {open ? (
        <span
          className="absolute bottom-full left-1/2 z-raised mb-2 w-44 -translate-x-1/2"
          // Positioning only — do not put animation/transform classes here.
        >
          <span className="sca-face block origin-bottom rounded-xl border border-fd-border bg-[var(--popover)] p-2.5 shadow-xl">
            <span className="flex items-center gap-2">
              <span className="size-4 shrink-0 rounded bg-[var(--muted)]" />
              <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/25" />
            </span>
            <span className="mt-2 block h-2 w-3/4 rounded-full bg-[var(--foreground)]/45" />
            <span className="mt-1.5 block h-1.5 w-full rounded-full bg-[var(--foreground)]/15" />
            <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-[var(--foreground)]/15" />
            <span className="absolute top-full left-1/2 size-2 -translate-x-1/2 -translate-y-1 rotate-45 border-fd-border border-r border-b bg-[var(--popover)]" />
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function SourceCitationsAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="card centered on the pill">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[520px] flex-col items-center gap-8 ${reduced ? "sca-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full gap-5 sm:grid-cols-2">
            {/* Closed */}
            <div
              className="sca-panel flex flex-col gap-3 rounded-xl border border-fd-border bg-[var(--card)] p-4"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                closed
              </span>
              <div className="flex flex-wrap items-center justify-center gap-1.5 py-6">
                <Word className="w-12" />
                <Word className="w-8" />
                <CitationUnit open={false} />
                <Word className="w-10" />
                <Word className="w-7" />
              </div>
              <p className="text-center text-[12px] text-fd-muted-foreground leading-snug">
                Pill only — no card in the DOM.
              </p>
            </div>

            {/* Open — citation unit centered so centering is obvious */}
            <div
              className="sca-panel flex flex-col gap-3 rounded-xl border border-fd-border bg-[var(--card)] p-4"
              style={{ "--d": "120ms" } as CSSProperties}
            >
              <span className="font-mono text-[11px] text-fd-muted-foreground">
                open · centered on pill
              </span>
              <div className="flex flex-col items-center justify-end gap-3 pt-28 pb-2">
                <CitationUnit open />
                <div className="flex items-center gap-1.5 opacity-40">
                  <Word className="w-10" />
                  <Word className="w-14" />
                  <Word className="w-8" />
                </div>
              </div>
              <p className="text-center text-[12px] text-fd-muted-foreground leading-snug">
                Dashed ring = shared wrapper. Card uses left-1/2 +
                −translate-x-1/2 so the caret hits the pill center.
              </p>
            </div>
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
