import { PromptSuggestions } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, range, select, toggle } from "../playground/argtypes";
import { padded } from "../playground/stage";

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

const meta = {
  title: "AI/PromptSuggestions",
  component: PromptSuggestions,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [padded(576)],
  argTypes: {
    variant: select(["grid", "chips", "list"], "Appearance"),
    loading: toggle("State"),
    skeletonCount: range(1, 8, 1, "Behavior"),
    suggestions: hidden(),
    onSelect: action("select"),
  },
  args: {
    variant: "grid",
    loading: false,
    skeletonCount: 4,
    suggestions,
    onSelect: fn(),
  },
} satisfies Meta<typeof PromptSuggestions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
