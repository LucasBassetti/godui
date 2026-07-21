"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `StreamingText` reveals `text` in `chunk`-sized slices on a `setInterval`
 * tick, with a blinking caret rendered by the parent `ConversationMessage`
 * only while `streaming` is true. Each token bar here plays the same
 * keyframes at a different `animation-delay`, so — looped — chunks sweep in
 * one after another, hold, then clear together before the next pass. The
 * caret's own visibility keyframe brackets that same window.
 */
const CSS = `
@keyframes ctst-chunk {
  0%, 4%    { opacity: 0; transform: translateY(3px) scale(0.85); }
  16%, 52%  { opacity: 1; transform: translateY(0) scale(1); }
  64%, 100% { opacity: 0; transform: translateY(3px) scale(0.85); }
}
.ctst-chunk { animation: ctst-chunk 2.8s cubic-bezier(0.3,0.7,0.4,1.2) infinite; }

@keyframes ctst-caret-window {
  0%, 8%    { opacity: 0; }
  14%, 58%  { opacity: 1; }
  66%, 100% { opacity: 0; }
}
.ctst-caret-window { animation: ctst-caret-window 2.8s linear infinite; }

.ctst-static .ctst-chunk { animation: none; opacity: 1; transform: none; }
.ctst-static .ctst-caret-window { animation: none; opacity: 0; }
`;

const CHUNKS: { w: string; delay: string }[] = [
  { w: "w-8", delay: "0ms" },
  { w: "w-14", delay: "90ms" },
  { w: "w-6", delay: "180ms" },
  { w: "w-16", delay: "270ms" },
  { w: "w-10", delay: "360ms" },
  { w: "w-12", delay: "450ms" },
];

const LEGEND: {
  name: string;
  desc: string;
  kind: "chunk" | "caret" | "cadence";
}[] = [
  {
    name: "Token chunk",
    desc: "count += chunk (2 chars) per tick",
    kind: "chunk",
  },
  {
    name: "Caret",
    desc: "animate-pulse, only while streaming is true",
    kind: "caret",
  },
  {
    name: "Cadence",
    desc: "setInterval every speed (24ms)",
    kind: "cadence",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "caret") {
    return (
      <span className="inline-block h-3 w-[2px] rounded-full bg-[var(--foreground)] ring-1 ring-fd-border ring-inset" />
    );
  }
  if (kind === "cadence") {
    return (
      <span className="h-1.5 w-5 rounded-full bg-[var(--foreground)]/20 ring-1 ring-fd-border ring-inset" />
    );
  }
  return (
    <span className="h-1.5 w-6 rounded-full bg-[var(--foreground)]/45 ring-1 ring-fd-border ring-inset" />
  );
}

export function ConversationThreadStream() {
  return (
    <ScrollScene label="The showpiece detail" note="chunked reveal · caret">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[380px] flex-col items-center gap-8 ${reduced ? "ctst-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div
            key={cycle}
            className="flex max-w-[300px] flex-col gap-1.5 rounded-2xl rounded-bl-md bg-[var(--muted)] px-3.5 py-2.5"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {CHUNKS.map((c) => (
                <span
                  key={c.w}
                  className={`ctst-chunk h-2 ${c.w} rounded-full bg-[var(--foreground)]/40`}
                  style={{ animationDelay: c.delay } as CSSProperties}
                />
              ))}
              <span className="ctst-caret-window inline-block h-3 w-[2px] rounded-full bg-[var(--foreground)] motion-reduce:hidden">
                <span className="block size-full animate-pulse motion-reduce:animate-none" />
              </span>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"count = Math.min(count + chunk, text.length)"}
          </p>

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
