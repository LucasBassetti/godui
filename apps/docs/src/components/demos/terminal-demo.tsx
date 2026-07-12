"use client";

import { Terminal, type TerminalLine } from "@godui/components";

const LINES: TerminalLine[] = [
  { text: "npm install @godui/components", type: "command" },
  { text: "added 1 package in 1.2s", type: "output", delay: 500 },
  { text: "", type: "output", delay: 120 },
  { text: "npm run build", type: "command" },
  { text: "▲ Compiled successfully", type: "output", delay: 600 },
  { text: "✓ Ready in 240ms", type: "output", delay: 300 },
];

export function TerminalDemo() {
  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6">
      <Terminal
        lines={LINES}
        title="zsh — godui"
        loop
        // Desktop: fixed width so it never reflows as lines type in (the preview
        // container would otherwise let the width track content). Mobile: stay
        // fluid so it fits the 360px preview iframe.
        className="w-full max-w-[26rem] sm:w-[28rem] sm:max-w-none"
      />
    </div>
  );
}
