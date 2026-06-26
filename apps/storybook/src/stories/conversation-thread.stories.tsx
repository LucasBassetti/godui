// biome-ignore-all lint/a11y/useValidAriaRole: "role" is a chat-message domain prop, not an ARIA role
import { ConversationMessage, ConversationThread } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, select, toggle } from "../playground/argtypes";

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

const meta = {
  title: "AI/ConversationThread",
  component: ConversationThread,
  subcomponents: { ConversationMessage },
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: select(["bubbles", "document", "compact"], "Appearance"),
    autoScroll: toggle("Behavior"),
    children: hidden(),
  },
  args: {
    variant: "bubbles",
    autoScroll: true,
  },
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
} satisfies Meta<typeof ConversationThread>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
