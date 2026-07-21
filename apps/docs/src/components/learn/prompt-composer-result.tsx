"use client";

import { PromptComposer } from "@godui/components";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * PromptComposer. Type and press ⌘/Ctrl + Enter (or the send button) to see
 * the send↔stop morph play against a fake 2.2s stream; drop or paste a file
 * to watch the chip spring in.
 */
export function PromptComposerResult() {
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState("Opus 4.8");

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — type, attach, send
        </span>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 p-10">
        <div className="w-full max-w-xl">
          <PromptComposer
            placeholder="Ask anything, attach a file, or pick a model…"
            models={["Opus 4.8", "Sonnet 4.6", "Haiku 4.5"]}
            model={model}
            onModelChange={setModel}
            isStreaming={streaming}
            onSend={() => {
              setStreaming(true);
              setTimeout(() => setStreaming(false), 2200);
            }}
            onStop={() => setStreaming(false)}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          ⌘/Ctrl + Enter to send · drop or paste a file to attach it
        </p>
      </div>
    </div>
  );
}
