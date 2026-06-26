"use client";

import { PromptComposer, PromptSuggestions } from "@godui/components";
import { Languages, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import { useState } from "react";

const SUGGESTIONS = [
  {
    id: "1",
    label: "Summarize this thread",
    hint: "Condense into 3 bullets",
    icon: <Sparkles className="size-4" />,
  },
  {
    id: "2",
    label: "Draft a reply",
    hint: "Friendly and concise",
    icon: <MessageSquare className="size-4" />,
  },
  {
    id: "3",
    label: "Find action items",
    hint: "Extract todos and owners",
    icon: <ListChecks className="size-4" />,
  },
  {
    id: "4",
    label: "Translate to Spanish",
    hint: "Localize the latest message",
    icon: <Languages className="size-4" />,
  },
];

export function PromptSuggestionsDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-3 text-center">
        <h3 className="text-lg font-semibold text-foreground">
          What can I help with?
        </h3>
        <p className="text-sm text-muted-foreground">
          Pick a starter or type your own.
        </p>
      </div>
      <PromptSuggestions
        className="mb-3"
        suggestions={SUGGESTIONS}
        onSelect={(s) => setValue(s.label)}
      />
      <PromptComposer
        value={value}
        onValueChange={setValue}
        placeholder="Ask anything…"
      />
    </div>
  );
}
