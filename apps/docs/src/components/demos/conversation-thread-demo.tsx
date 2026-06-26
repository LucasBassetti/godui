// biome-ignore-all lint/a11y/useValidAriaRole: "role" is a chat-message domain prop, not an ARIA role
"use client";

import {
  ConversationMessage,
  ConversationThread,
  PromptComposer,
  StreamingText,
} from "@godui/components";
import { Copy, RotateCcw, ThumbsUp } from "lucide-react";
import { useState } from "react";

type Msg = {
  id: number;
  role: "user" | "assistant";
  text: string;
  streaming?: boolean;
};

const ANSWERS = [
  "Center it with a grid parent: `grid place-items-center`. One line, no flex juggling.",
  "Sure — wrap your content and add `min-h-dvh` so it centers in the viewport.",
  "Use `place-items-center` on a grid, or `items-center justify-center` on a flex row.",
];

export function ConversationThreadDemo() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, role: "user", text: "How do I center a div in 2026?" },
    {
      id: 2,
      role: "assistant",
      text: "Use a grid parent with `place-items-center` — it centers on both axes in a single declaration.",
    },
  ]);

  const actions = (text: string) => [
    {
      label: "Copy",
      icon: <Copy className="size-4" />,
      onClick: () => navigator.clipboard?.writeText(text),
    },
    { label: "Regenerate", icon: <RotateCcw className="size-4" /> },
    { label: "Helpful", icon: <ThumbsUp className="size-4" /> },
  ];

  const send = (value: string) => {
    const id = Date.now();
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    setMessages((prev) => [
      ...prev,
      { id, role: "user", text: value },
      { id: id + 1, role: "assistant", text: answer, streaming: true },
    ]);
  };

  return (
    <div className="mx-auto flex h-[460px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex-1 overflow-hidden">
        <ConversationThread>
          {messages.map((m) =>
            m.role === "assistant" ? (
              <ConversationMessage
                key={m.id}
                role="assistant"
                name="GodUI"
                actions={actions(m.text)}
                streaming={m.streaming}
              >
                {m.streaming ? (
                  <StreamingText
                    text={m.text}
                    onDone={() =>
                      setMessages((prev) =>
                        prev.map((x) =>
                          x.id === m.id ? { ...x, streaming: false } : x,
                        ),
                      )
                    }
                  />
                ) : (
                  m.text
                )}
              </ConversationMessage>
            ) : (
              <ConversationMessage key={m.id} role="user" name="You">
                {m.text}
              </ConversationMessage>
            ),
          )}
        </ConversationThread>
      </div>
      <div className="border-t border-border p-3">
        <PromptComposer variant="compact" placeholder="Reply…" onSend={send} />
      </div>
    </div>
  );
}
