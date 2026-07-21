// biome-ignore-all lint/a11y/useValidAriaRole: "role" is a chat-message domain prop, not an ARIA role
"use client";

import {
  ConversationMessage,
  ConversationThread,
  StreamingText,
} from "@godui/components";
import { Copy, RotateCcw, ThumbsUp } from "lucide-react";
import * as React from "react";

/**
 * Closing "here's the finished thing" panel — the real `ConversationThread`
 * with a fixed exchange: a resolved user turn, then an assistant turn that
 * streams in on mount and on every replay. Hover the assistant bubble for
 * its actions row.
 */
const ANSWER =
  "Use a grid parent with `place-items-center` — it centers on both axes in a single declaration.";

const ACTIONS = [
  { label: "Copy", icon: <Copy className="size-4" /> },
  { label: "Regenerate", icon: <RotateCcw className="size-4" /> },
  { label: "Helpful", icon: <ThumbsUp className="size-4" /> },
];

export function ConversationThreadResult() {
  const [run, setRun] = React.useState(0);
  const [streaming, setStreaming] = React.useState(true);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover the reply for its actions
        </span>
        <button
          type="button"
          onClick={() => {
            setStreaming(true);
            setRun((r) => r + 1);
          }}
          aria-label="Replay stream"
          title="Replay"
          className="ms-auto inline-flex size-8 items-center justify-center rounded-[10px] border border-fd-border bg-fd-card text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
      <div className="flex min-h-[360px] items-center justify-center p-4 md:p-6">
        <div
          key={run}
          className="mx-auto flex h-[320px] w-full max-w-md flex-col overflow-hidden rounded-xl border border-border bg-background"
        >
          <ConversationThread className="flex-1">
            <ConversationMessage role="user" name="You">
              How do I center a div in 2026?
            </ConversationMessage>
            <ConversationMessage
              role="assistant"
              name="GodUI"
              actions={ACTIONS}
              streaming={streaming}
            >
              {streaming ? (
                <StreamingText
                  text={ANSWER}
                  onDone={() => setStreaming(false)}
                />
              ) : (
                ANSWER
              )}
            </ConversationMessage>
          </ConversationThread>
        </div>
      </div>
    </div>
  );
}
