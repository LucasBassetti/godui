"use client";

import { Terminal, type TerminalLine } from "@godui/components";
import { useBareScene } from "@/components/learn/bare-scene-context";

const LINES: TerminalLine[] = [
  { text: "npx shadcn@latest add @godui/terminal", type: "command" },
  { text: "✔ Installing dependencies.", type: "output", delay: 450 },
  { text: "✔ Created 1 file.", type: "output", delay: 280 },
  { text: "", type: "output", delay: 80 },
  { text: "pnpm check", type: "command" },
  { text: "✓ All checks passed", type: "output", delay: 400 },
];

/**
 * Closing panel — the real Terminal, looping with chrome.
 */
export function TerminalResult() {
  // On the LearnPlayer stage, the player supplies the card — render the live
  // component only. (Standalone / classic scroll layout keeps its own card.)
  if (useBareScene())
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center p-6">
        <Terminal
          lines={LINES}
          title="zsh — godui"
          loop
          className="w-full max-w-[26rem]"
        />
      </div>
    );
  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — types in view, loops after 2s
        </span>
      </div>
      <div className="flex min-h-[300px] items-center justify-center p-6 md:p-10">
        <Terminal
          lines={LINES}
          title="zsh — godui"
          loop
          className="w-full max-w-[26rem]"
        />
      </div>
    </div>
  );
}
