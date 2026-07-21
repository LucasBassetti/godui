"use client";

import type { CSSProperties } from "react";
import { ScrollScene } from "./scroll-scene";

/**
 * State machine: `count` = completed lines, `typed` = chars on the current
 * command. Commands grow char-by-char at typingSpeed (38ms); output/comment
 * appear after delay (default 380). Caret = animate-pulse block.
 * Bars stand in for glyphs — no readable text on the diagram.
 */
const CSS = `
@keyframes tt-type {
  0%   { transform: scaleX(0); }
  55%  { transform: scaleX(1); }
  70%, 100% { transform: scaleX(1); }
}
@keyframes tt-out {
  0%, 55% { opacity: 0; transform: translateY(4px); }
  70%, 100% { opacity: 1; transform: none; }
}
@keyframes tt-type2 {
  0%, 70% { transform: scaleX(0); }
  95%, 100% { transform: scaleX(1); }
}
@keyframes tt-caret {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
.tt-cmd1 {
  transform-origin: left center;
  transform: scaleX(0);
  animation: tt-type 3.6s ease both infinite;
}
.tt-out1 {
  opacity: 0;
  animation: tt-out 3.6s ease both infinite;
}
.tt-cmd2 {
  transform-origin: left center;
  transform: scaleX(0);
  animation: tt-type2 3.6s ease both infinite;
}
.tt-caret {
  animation: tt-caret 1s steps(2, jump-none) infinite;
}
.tt-static .tt-cmd1,
.tt-static .tt-cmd2 {
  animation: none;
  transform: scaleX(1);
}
.tt-static .tt-out1 {
  animation: none;
  opacity: 1;
  transform: none;
}
.tt-static .tt-caret { animation: none; opacity: 0; }
`;

const LEGEND = [
  {
    name: "Command",
    desc: "typed++ every typingSpeed ms (38)",
    swatch: "bg-[var(--foreground)]/50",
  },
  {
    name: "Output",
    desc: "lands after delay (default 380ms)",
    swatch: "bg-[var(--foreground)]/20",
  },
  {
    name: "Caret",
    desc: "animate-pulse on the active command",
    swatch: "bg-[var(--foreground)]",
  },
] as const;

export function TerminalTyping() {
  return (
    <ScrollScene label="Typing machine" note="count + typed · 38ms/char">
      {({ cycle, reduced }) => (
        <div
          key={cycle}
          className={`flex w-full max-w-[420px] flex-col items-center gap-9 ${reduced ? "tt-static" : ""}`}
        >
          {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static keyframes, no user input */}
          <style dangerouslySetInnerHTML={{ __html: CSS }} />

          <div className="w-full max-w-[300px] space-y-3 rounded-xl border border-fd-border bg-[var(--card)] p-5 font-mono">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-sm bg-[var(--foreground)]/45"
                aria-hidden="true"
              />
              <span
                className="tt-cmd1 h-2 w-36 rounded-full bg-[var(--foreground)]/45"
                aria-hidden="true"
              />
              <span
                className="tt-caret ml-0.5 inline-block h-3 w-[0.45ch] bg-[var(--foreground)]/70"
                aria-hidden="true"
              />
            </div>
            <div
              className="tt-out1 flex items-center gap-2 pl-4"
              style={{ "--d": "0ms" } as CSSProperties}
            >
              <span
                className="h-2 w-40 rounded-full bg-[var(--foreground)]/18"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-sm bg-[var(--foreground)]/45"
                aria-hidden="true"
              />
              <span
                className="tt-cmd2 h-2 w-24 rounded-full bg-[var(--foreground)]/45"
                aria-hidden="true"
              />
            </div>
          </div>

          <p className="text-center font-mono text-[11px] text-fd-muted-foreground">
            {"setTyped(t => t + 1) · then setCount(c => c + 1)"}
          </p>

          <dl className="grid w-full grid-cols-3 gap-4 border-fd-border border-t pt-5">
            {LEGEND.map((item) => (
              <div key={item.name} className="flex flex-col gap-1.5">
                <span
                  className={`h-1.5 w-8 rounded-full ${item.swatch} ring-1 ring-fd-border ring-inset`}
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
