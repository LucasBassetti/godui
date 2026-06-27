import { TextScramble, type TextScrambleProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, select } from "../playground/argtypes";

const meta = {
  title: "Text/TextScramble",
  component: TextScramble,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    text: { control: "text", table: { category: "Content" } },
    trigger: select(["mount", "in-view", "hover"], "Behavior"),
    charset: select(
      ["alphanumeric", "symbols", "katakana", "binary"],
      "Appearance",
    ),
    speed: range(10, 80, 2, "Behavior"),
    spread: range(4, 60, 2, "Behavior"),
  },
  args: {
    text: "Decrypting…",
    trigger: "mount",
    charset: "alphanumeric",
    speed: 28,
    spread: 28,
  },
  render: (args: TextScrambleProps) => (
    <TextScramble
      {...args}
      className="font-mono text-4xl font-semibold text-foreground"
    />
  ),
} satisfies Meta<typeof TextScramble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
