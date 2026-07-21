"use client";

import { ScrollScene } from "./scroll-scene";

/**
 * `openAt` measures before it mounts. It estimates the panel box
 * (`menuW = 220`, `menuH = min(items·40 + 12, 360)`) and compares
 * `cursor + size` against `window.innerWidth/innerHeight`. When the panel would
 * spill, `flipX`/`flipY` flip the anchor from `left/top` to `right/bottom` and
 * swap `transformOrigin` to the opposite corner — so a corner-click still opens
 * fully on-screen and still springs from the pointer.
 */
const ROWS = 4;

const CSS = `
@keyframes cmf-open {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}
.cmf-menu { opacity: 0; animation: cmf-open 460ms cubic-bezier(0.34,1.56,0.64,1) both; }
.cmf-static .cmf-menu { opacity: 1; animation: none; transform: none; }
`;

/** A stand-in menu panel; rows are neutral token bars, no copy. */
function Panel({ origin, className }: { origin: string; className: string }) {
  return (
    <div
      className={`cmf-menu absolute w-32 rounded-lg border border-border bg-background p-1 shadow-2xl ${className}`}
      style={{ transformOrigin: origin }}
    >
      {Array.from({ length: ROWS }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length row list
          key={i}
          className="flex items-center gap-2 rounded px-2 py-1.5"
        >
          <span className="size-3 shrink-0 rounded-[4px] bg-[var(--foreground)]/25" />
          <span className="h-1.5 w-12 rounded-full bg-[var(--foreground)]/30" />
        </div>
      ))}
    </div>
  );
}

/** Cursor glyph placed at a viewport corner. */
function Cursor({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="var(--foreground)"
      className={`absolute ${className}`}
    >
      <path d="M1 1l5.5 13 2-5.5 5.5-2z" />
    </svg>
  );
}

export function ContextMenuFlip() {
  return (
    <ScrollScene label="Viewport flip" note="corner-clicks stay on-screen">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[460px] flex-col items-center gap-8 ${reduced ? "cmf-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="grid w-full grid-cols-2 gap-4">
            {/* Room to spare — anchor left/top, origin top-left. */}
            <div className="relative h-48 overflow-hidden rounded-xl border border-fd-border border-dashed bg-[var(--muted)]/40">
              <Cursor className="top-6 left-6" />
              <Panel origin="left top" className="top-8 left-8" />
            </div>
            {/* Bottom-right corner — flipX + flipY, origin bottom-right. */}
            <div className="relative h-48 overflow-hidden rounded-xl border border-fd-border border-dashed bg-[var(--muted)]/40">
              <Cursor className="right-6 bottom-6 rotate-180" />
              <Panel origin="right bottom" className="right-8 bottom-8" />
            </div>
          </div>

          <dl className="grid w-full grid-cols-2 gap-4 border-fd-border border-t pt-5">
            <div className="flex flex-col gap-1.5">
              <span className="relative h-3 w-6">
                <span className="absolute top-0 left-0 size-1.5 rounded-sm bg-[var(--foreground)]" />
                <span className="absolute top-1 left-2 h-2.5 w-4 rounded-lg border border-border bg-background ring-1 ring-fd-border ring-inset" />
              </span>
              <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                no flip
              </dt>
              <dd className="text-[11px] text-fd-muted-foreground">
                left: x · top: y · origin left top
              </dd>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="relative h-3 w-6">
                <span className="absolute right-0 bottom-0 h-2.5 w-4 rounded-lg border border-border bg-background ring-1 ring-fd-border ring-inset" />
                <span className="absolute right-0 bottom-0 size-1.5 rotate-180 rounded-sm bg-[var(--foreground)]" />
              </span>
              <dt className="font-medium font-mono text-[12px] text-fd-foreground">
                flipX · flipY
              </dt>
              <dd className="text-[11px] text-fd-muted-foreground">
                right: W−x · bottom: H−y · origin right bottom
              </dd>
            </div>
          </dl>
        </div>
      )}
    </ScrollScene>
  );
}
