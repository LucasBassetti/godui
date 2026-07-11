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
    <div className="flex items-center justify-center px-6 py-12">
      <Terminal lines={LINES} title="zsh — godui" loop className="w-[26rem]" />
    </div>
  );
}
