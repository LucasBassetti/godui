"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * `SourceList` mounts every row inside `AnimatePresence`, each fading up
 * with `delay: Math.min(i, previewCount) * 0.05` — capped so a long list
 * doesn't drag the last row in half a second late. Collapsed, only the
 * first `previewCount` rows render; the "+N more" toggle mounts the rest,
 * which fade up on their own stagger. Looped here as collapse → expand →
 * collapse.
 */
const CSS = `
@keyframes scl-row {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.scl-row { opacity: 0; animation: scl-row 300ms cubic-bezier(0.22,1,0.36,1) var(--d) both; }

@keyframes scl-extra {
  0%, 10%   { opacity: 0; transform: translateY(8px); }
  38%, 72%  { opacity: 1; transform: translateY(0); }
  92%, 100% { opacity: 0; transform: translateY(-4px); }
}
.scl-extra { opacity: 0; animation: scl-extra 4.4s cubic-bezier(0.22,1,0.36,1) infinite; }

@keyframes scl-caret {
  0%, 10%   { transform: rotate(0deg); }
  38%, 72%  { transform: rotate(180deg); }
  92%, 100% { transform: rotate(0deg); }
}
.scl-caret { animation: scl-caret 4.4s cubic-bezier(0.22,1,0.36,1) infinite; }

.scl-static .scl-row,
.scl-static .scl-extra { opacity: 1; animation: none; transform: none; }
.scl-static .scl-caret { animation: none; transform: none; }
`;

function Row({
  className = "",
  style,
  titleW,
  hostW,
}: {
  className?: string;
  style?: CSSProperties;
  titleW: string;
  hostW: string;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 ${className}`}
      style={style}
    >
      <span className="size-5 shrink-0 rounded bg-[var(--muted)]" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span
          className={`h-2 ${titleW} rounded-full bg-[var(--foreground)]/40`}
        />
        <span
          className={`h-1.5 ${hostW} rounded-full bg-[var(--foreground)]/20`}
        />
      </span>
      <span className="size-3 shrink-0 rounded-[3px] bg-[var(--foreground)]/15" />
    </div>
  );
}

const ALWAYS: { titleW: string; hostW: string }[] = [
  { titleW: "w-32", hostW: "w-16" },
  { titleW: "w-28", hostW: "w-20" },
  { titleW: "w-36", hostW: "w-14" },
];

const EXTRA: { titleW: string; hostW: string; delay: string }[] = [
  { titleW: "w-24", hostW: "w-16", delay: "0ms" },
  { titleW: "w-32", hostW: "w-12", delay: "70ms" },
];

const LEGEND: {
  name: string;
  desc: string;
  kind: "row" | "stagger" | "toggle";
}[] = [
  {
    name: "Row",
    desc: "chip · title · host, fades up on mount",
    kind: "row",
  },
  {
    name: "Stagger",
    desc: "delay min(i, previewCount) × 0.05s",
    kind: "stagger",
  },
  {
    name: "+N more",
    desc: "toggles the rows past previewCount",
    kind: "toggle",
  },
];

function LegendSwatch({ kind }: { kind: (typeof LEGEND)[number]["kind"] }) {
  if (kind === "stagger") {
    return (
      <span className="flex flex-col gap-0.5">
        <span className="h-1 w-6 rounded-full bg-[var(--foreground)]/40" />
        <span className="ml-1.5 h-1 w-5 rounded-full bg-[var(--foreground)]/25" />
      </span>
    );
  }
  if (kind === "toggle") {
    return (
      <span className="inline-flex items-center gap-0.5">
        <span className="h-1 w-4 rounded-full bg-[var(--foreground)]/70" />
        <span className="size-1.5 rotate-180 border-[var(--foreground)]/70 border-t border-r" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-lg border border-transparent px-0.5 py-0.5">
      <span className="size-2 shrink-0 rounded bg-[var(--muted)]" />
      <span className="flex flex-col gap-0.5">
        <span className="h-1 w-4 rounded-full bg-[var(--foreground)]/40" />
        <span className="h-0.5 w-2.5 rounded-full bg-[var(--foreground)]/20" />
      </span>
    </span>
  );
}

export function SourceCitationsList() {
  return (
    <ScrollScene label="The motion" note="staggered rows · collapse toggle">
      {({ cycle, reduced }) => (
        <div
          className={`flex w-full max-w-[420px] flex-col items-center gap-8 ${reduced ? "scl-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div key={cycle} className="flex w-full flex-col gap-1">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="size-3.5 rounded-[3px] bg-[var(--foreground)]/25" />
              <span className="h-2 w-14 rounded-full bg-[var(--foreground)]/25" />
            </div>

            {ALWAYS.map((r, i) => (
              <Row
                key={r.titleW}
                className="scl-row"
                style={{ "--d": `${i * 50}ms` } as CSSProperties}
                titleW={r.titleW}
                hostW={r.hostW}
              />
            ))}

            {EXTRA.map((r) => (
              <Row
                key={r.titleW}
                className="scl-extra"
                style={{ animationDelay: r.delay }}
                titleW={r.titleW}
                hostW={r.hostW}
              />
            ))}

            <div className="mt-0.5 flex items-center gap-1 self-start rounded-md px-2 py-1">
              <span className="h-1.5 w-14 rounded-full bg-[var(--foreground)]/70" />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="scl-caret size-3 text-[var(--foreground)]/70"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"delay: Math.min(i, previewCount) * 0.05, duration: 0.3"}
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
