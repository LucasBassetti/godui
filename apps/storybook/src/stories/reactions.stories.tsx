import { type Reaction, Reactions } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden } from "../playground/argtypes";
import { centered } from "../playground/stage";

const reactions: Reaction[] = [
  {
    emoji: "👍",
    count: 4,
    reacted: true,
    users: ["You", "Ana", "Marco"],
  },
  { emoji: "🎉", count: 2, users: ["Priya", "Jules"] },
  { emoji: "🚀", count: 1, users: ["Sam"] },
];

const meta = {
  title: "Collaboration/Reactions",
  component: Reactions,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    reactions: hidden(),
    options: hidden(),
    onToggle: action("toggle"),
    onAdd: action("add"),
  },
  args: {
    reactions,
    onToggle: fn(),
    onAdd: fn(),
  },
} satisfies Meta<typeof Reactions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
