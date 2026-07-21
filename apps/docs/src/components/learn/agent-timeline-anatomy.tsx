"use client";

import type { ReactNode } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * Three `AgentStep`s, staggered in on scroll. Rings and connectors read the
 * same `status` a real run would report; the middle step is left open so the
 * "Body" piece has something to point at — the exact geometry the demo ships
 * with (a running step defaults open).
 */
const CSS = `
@keyframes ata-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.ata-node { opacity: 0; animation: ata-in 480ms cubic-bezier(0.3,0.7,0.4,1.2) both; }
.ata-static .ata-node { opacity: 1; animation: none; transform: none; }
`;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function Ring({ tone, children }: { tone: string; children?: ReactNode }) {
  return (
    <span
      className={`relative flex size-6 shrink-0 items-center justify-center rounded-full border ${tone}`}
    >
      {children}
    </span>
  );
}

function Connector({ fill }: { fill: string }) {
  return (
    <span className="relative my-1 w-px flex-1 overflow-hidden rounded bg-[var(--border)]">
      <span className={`absolute inset-x-0 top-0 origin-top ${fill}`} />
    </span>
  );
}

const LEGEND: {
  name: string;
  desc: string;
  kind: "ring" | "connector" | "body";
}[] = [
  {
    name: "Ring",
    desc: "border-color + fill keyed by status",
    kind: "ring",
  },
  {
    name: "Connector",
    desc: "scaleY 0 → 0.5 → 1, spring 320/32/0.9",
    kind: "connector",
  },
  {
    name: "Body",
    desc: "height + opacity, collapsible per step",
    kind: "body",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "ring") {
    return (
      <span className="size-3 rounded-full border-2 border-[var(--foreground)] bg-transparent ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "connector") {
    return (
      <span className="h-3.5 w-0.5 rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-3.5 w-6 rounded-md border border-fd-border bg-[var(--muted)]/40 ring-1 ring-fd-border ring-inset" />
  );
}

export function AgentTimelineAnatomy() {
  return (
    <ScrollScene label="Anatomy" note="ring · connector · body">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[380px] flex-col ${reduced ? "ata-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          {/* Step 1 — success, closed */}
          <div
            className="ata-node flex gap-3"
            style={{ animationDelay: "0ms" }}
          >
            <div className="flex flex-col items-center">
              <Ring tone="border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]">
                <CheckIcon className="size-3.5" />
              </Ring>
              <Connector fill="h-full bg-[var(--primary)]" />
            </div>
            <div className="min-w-0 flex-1 pb-5">
              <div className="flex items-center gap-2 py-0.5">
                <span className="h-2 w-24 rounded-full bg-[var(--foreground)]/60" />
                <span className="ml-auto h-2 w-6 rounded-full bg-[var(--foreground)]/20" />
                <ChevronIcon className="size-3.5 shrink-0 text-fd-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Step 2 — running, open body */}
          <div
            className="ata-node flex gap-3"
            style={{ animationDelay: "120ms" }}
          >
            <div className="flex flex-col items-center">
              <Ring tone="border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]">
                <span className="size-2.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
                <span className="absolute inset-0 animate-ping rounded-full border border-[var(--primary)]/50 motion-reduce:animate-none" />
              </Ring>
              <Connector fill="h-1/2 bg-gradient-to-b from-[var(--primary)] to-[var(--border)]" />
            </div>
            <div className="min-w-0 flex-1 pb-5">
              <div className="flex items-center gap-2 py-0.5">
                <span className="h-2 w-32 rounded-full bg-[var(--foreground)]/60 motion-safe:animate-pulse" />
                <ChevronIcon className="ml-auto size-3.5 shrink-0 rotate-90 text-fd-muted-foreground" />
              </div>
              <div className="mt-1.5 rounded-lg border border-fd-border bg-[var(--muted)]/40 p-2.5">
                <span className="block h-1.5 w-[85%] rounded-full bg-[var(--foreground)]/25" />
                <span className="mt-1.5 block h-1.5 w-[55%] rounded-full bg-[var(--foreground)]/15" />
              </div>
            </div>
          </div>

          {/* Step 3 — pending, leaf, last */}
          <div
            className="ata-node flex gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <div className="flex flex-col items-center">
              <Ring tone="border-fd-border bg-[var(--background)] text-fd-muted-foreground">
                <span className="size-1.5 rounded-full bg-current" />
              </Ring>
            </div>
            <div className="min-w-0 flex-1">
              <span className="block h-2 w-28 rounded-full bg-[var(--foreground)]/25" />
            </div>
          </div>

          <dl className="mt-3 grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
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
