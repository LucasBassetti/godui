"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three first-run gates from the real component: mount (immediate),
 * in-view (IntersectionObserver threshold 0.4), hover (onPointerEnter).
 * Diagram only — token bars, no instructional copy on shapes.
 */

const CSS = `
@keyframes tst-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tst-col {
  opacity: 0;
  animation: tst-in 600ms cubic-bezier(0.3, 0.7, 0.4, 1.2) var(--d) both;
}
.tst-static .tst-col { opacity: 1; animation: none; transform: none; }

@keyframes tst-mount-pulse {
  0%, 15%  { opacity: 0.2; transform: scaleY(0.4); }
  35%, 55% { opacity: 1;   transform: scaleY(1); }
  75%, 100%{ opacity: 0.2; transform: scaleY(0.4); }
}
.tst-mount-bar {
  transform-origin: bottom center;
  animation: tst-mount-pulse 2.6s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.tst-static .tst-mount-bar { animation: none; opacity: 1; transform: none; }

@keyframes tst-io-enter {
  0%, 20%  { opacity: 0.2; transform: translateY(18px); }
  40%, 65% { opacity: 1;   transform: translateY(0); }
  85%, 100%{ opacity: 0.2; transform: translateY(18px); }
}
.tst-io-slot {
  animation: tst-io-enter 3.2s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.tst-static .tst-io-slot { animation: none; opacity: 1; transform: none; }

@keyframes tst-hover-ring {
  0%, 25%  { opacity: 0.15; transform: scale(0.85); }
  40%, 60% { opacity: 1;    transform: scale(1); }
  80%, 100%{ opacity: 0.15; transform: scale(0.85); }
}
.tst-hover-ring {
  animation: tst-hover-ring 2.8s cubic-bezier(0.3, 0.7, 0.4, 1) infinite;
}
.tst-static .tst-hover-ring { animation: none; opacity: 1; transform: none; }
`;

const LEGEND: { name: string; desc: string; swatch: string }[] = [
  {
    name: "mount",
    desc: "first effect — run(text) immediately",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "in-view",
    desc: "IO threshold 0.4, then disconnect",
    swatch: "border border-dashed border-[var(--foreground)]/45 bg-transparent",
  },
  {
    name: "hover",
    desc: "onPointerEnter sets started + run",
    swatch: "bg-[var(--foreground)]/20 ring-1 ring-[var(--foreground)]/40",
  },
];

const COLUMNS: {
  key: string;
  caption: string;
  delay: string;
  kind: "mount" | "in-view" | "hover";
}[] = [
  { key: "mount", caption: "mount", delay: "0ms", kind: "mount" },
  { key: "in-view", caption: "in-view", delay: "100ms", kind: "in-view" },
  { key: "hover", caption: "hover", delay: "200ms", kind: "hover" },
];

function MountPanel() {
  return (
    <div
      className="flex h-[88px] w-full items-end justify-center gap-1 rounded-xl border border-fd-border bg-[var(--muted)]/40 px-4 pb-5"
      aria-hidden="true"
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="tst-mount-bar w-2 rounded-sm bg-[var(--foreground)]/45"
          style={
            {
              height: `${14 + (i % 3) * 8}px`,
              animationDelay: `${i * 60}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function InViewPanel() {
  return (
    <div
      className="relative flex h-[88px] w-full flex-col overflow-hidden rounded-xl border border-fd-border bg-[var(--muted)]/40"
      aria-hidden="true"
    >
      <div className="flex h-4 items-center gap-1 border-b border-fd-border px-2">
        <span className="size-1 rounded-full bg-[var(--foreground)]/25" />
        <span className="size-1 rounded-full bg-[var(--foreground)]/25" />
        <span className="size-1 rounded-full bg-[var(--foreground)]/25" />
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-[30%] bottom-[30%] border-y border-dashed border-[var(--foreground)]/25"
          aria-hidden="true"
        />
        <div className="tst-io-slot flex h-7 w-20 items-center justify-center rounded-md border border-fd-border bg-[var(--card)]">
          <span className="h-1.5 w-10 rounded-full bg-[var(--foreground)]/35" />
        </div>
      </div>
    </div>
  );
}

function HoverPanel() {
  return (
    <div
      className="relative flex h-[88px] w-full items-center justify-center rounded-xl border border-fd-border bg-[var(--card)]"
      aria-hidden="true"
    >
      <span className="tst-hover-ring absolute size-14 rounded-full border border-[var(--foreground)]/30" />
      <span className="tst-hover-ring absolute size-9 rounded-full bg-[var(--foreground)]/10" />
      <span className="relative h-2 w-12 rounded-full bg-[var(--foreground)]/40" />
    </div>
  );
}

export function TextScrambleTrigger() {
  return (
    <ScrollScene label="Trigger" note="mount · in-view · hover">
      {({ cycle, reduced }) => (
        <div className="flex w-full max-w-[560px] flex-col items-center gap-8">
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />
          <div
            key={cycle}
            className={`flex w-full flex-col items-center gap-6 sm:flex-row sm:justify-between ${reduced ? "tst-static" : ""}`}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.key}
                className="tst-col flex w-full max-w-[160px] flex-col items-center gap-3"
                style={{ "--d": col.delay } as CSSProperties}
              >
                {col.kind === "mount" ? <MountPanel /> : null}
                {col.kind === "in-view" ? <InViewPanel /> : null}
                {col.kind === "hover" ? <HoverPanel /> : null}
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
