// biome-ignore-all lint/a11y/useValidAriaRole: "role" is a chat-message domain prop, not an ARIA role
import {
  ConversationMessage,
  ConversationThread,
  StreamingText,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "AI/ConversationThread",
  component: ConversationThread,
  subcomponents: { ConversationMessage },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ConversationThread>;

export default meta;
type Story = StoryObj<typeof meta>;

const copyAction = {
  label: "Copy",
  icon: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="size-4"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
};

export const Bubbles: Story = {
  render: (args) => (
    <div className="mx-auto h-[420px] max-w-2xl rounded-2xl border border-border bg-background">
      <ConversationThread {...args}>
        <ConversationMessage role="user" name="You" timestamp="9:41">
          How do I center a div in 2026?
        </ConversationMessage>
        <ConversationMessage
          role="assistant"
          name="GodUI"
          timestamp="9:41"
          actions={[copyAction]}
        >
          Use a flex parent: `display:flex; place-items:center`. Want a runnable
          example with Tailwind?
        </ConversationMessage>
        <ConversationMessage role="user" name="You" timestamp="9:42">
          Yes please.
        </ConversationMessage>
        <ConversationMessage
          role="assistant"
          name="GodUI"
          timestamp="9:42"
          streaming
        >
          {'<div className="grid min-h-dvh place-items-center">…'}
        </ConversationMessage>
      </ConversationThread>
    </div>
  ),
  args: { variant: "bubbles" },
};

export const Document: Story = {
  render: () => (
    <div className="mx-auto h-[420px] max-w-2xl rounded-2xl border border-border bg-background">
      <ConversationThread variant="document">
        <ConversationMessage role="user" name="You">
          Summarize the design-engineer role in one paragraph.
        </ConversationMessage>
        <ConversationMessage
          role="assistant"
          name="GodUI"
          actions={[copyAction]}
        >
          A design engineer bridges product design and frontend engineering —
          shipping interfaces with the polish of a designer and the rigor of an
          engineer, owning motion, accessibility, and the last 10% that makes a
          product feel premium.
        </ConversationMessage>
      </ConversationThread>
    </div>
  ),
};

export const LiveStreaming: Story = {
  render: () => {
    function Demo() {
      const [done, setDone] = useState(false);
      return (
        <div className="mx-auto h-[300px] max-w-2xl rounded-2xl border border-border bg-background">
          <ConversationThread>
            <ConversationMessage role="user" name="You">
              Give me a tagline for GodUI.
            </ConversationMessage>
            <ConversationMessage
              role="assistant"
              name="GodUI"
              streaming={!done}
            >
              <StreamingText
                text="Animated UI components for design engineers — own the code, keep the magic."
                onDone={() => setDone(true)}
              />
            </ConversationMessage>
          </ConversationThread>
        </div>
      );
    }
    return <Demo />;
  },
};
