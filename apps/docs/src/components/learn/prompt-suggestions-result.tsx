"use client";

import { type PromptSuggestion, PromptSuggestions } from "@godui/components";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, interactive
 * PromptSuggestions. Hover a card, arrow-key across the row, or click one:
 * the spring stagger, the lift, and the arrow reveal are all the live
 * component, not a recreation.
 */
const SUGGESTIONS: PromptSuggestion[] = [
  {
    id: "1",
    label: "Summarize this thread",
    hint: "Condense into 3 bullets",
  },
  { id: "2", label: "Draft a reply", hint: "Friendly and concise" },
  { id: "3", label: "Find action items", hint: "Extract todos and owners" },
  { id: "4", label: "Translate to Spanish", hint: "Keep the tone casual" },
];

export function PromptSuggestionsResult() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — hover, arrow-key, pick one
        </span>
      </div>
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-5 p-10">
        <div className="w-full max-w-lg">
          <PromptSuggestions
            suggestions={SUGGESTIONS}
            onSelect={(suggestion) => setLast(suggestion.label)}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          {last ? (
            <>
              Selected: <span className="text-foreground">{last}</span>
            </>
          ) : (
            "Click or arrow-key to a suggestion and select it"
          )}
        </p>
      </div>
    </div>
  );
}
