import { PromptSuggestions } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "AI/PromptSuggestions",
  component: PromptSuggestions,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { suggestions: [] },
} satisfies Meta<typeof PromptSuggestions>;

export default meta;
type Story = StoryObj<typeof meta>;

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const suggestions = [
  {
    id: "1",
    label: "Summarize this thread",
    hint: "Condense the conversation into 3 bullets",
    icon: <Icon d="M4 6h16M4 12h10M4 18h7" />,
  },
  {
    id: "2",
    label: "Draft a reply",
    hint: "Write a friendly response",
    icon: <Icon d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />,
  },
  {
    id: "3",
    label: "Find action items",
    hint: "Extract todos and owners",
    icon: (
      <Icon d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    ),
  },
  {
    id: "4",
    label: "Translate to Spanish",
    hint: "Localize the latest message",
    icon: (
      <Icon d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
    ),
  },
];

export const Grid: Story = {
  render: (args) => (
    <div className="mx-auto max-w-xl">
      <PromptSuggestions {...args} suggestions={suggestions} />
    </div>
  ),
  args: { variant: "grid" },
};

export const Chips: Story = {
  render: () => (
    <div className="mx-auto max-w-xl">
      <PromptSuggestions variant="chips" suggestions={suggestions} />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="mx-auto max-w-xl">
      <PromptSuggestions suggestions={suggestions} loading skeletonCount={4} />
    </div>
  ),
};
