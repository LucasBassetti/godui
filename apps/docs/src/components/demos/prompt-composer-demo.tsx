"use client";

import { PromptComposer } from "@godui/components";
import { useState } from "react";

export function PromptComposerDemo() {
  const [streaming, setStreaming] = useState(false);
  const [model, setModel] = useState("Opus 4.8");

  return (
    <div className="mx-auto w-full max-w-xl">
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
      <p className="mt-2 px-1 text-xs text-muted-foreground">
        Press ⌘/Ctrl + Enter to send. Drop files onto the field to attach.
      </p>
    </div>
  );
}
