import { AnimatedTooltip } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, select, text } from "../playground/argtypes";
import { box } from "../playground/stage";

const meta = {
  title: "Overlays/AnimatedTooltip",
  component: AnimatedTooltip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [box("100%", 160)],
  argTypes: {
    content: text("Content"),
    side: select(["top", "bottom"], "Appearance"),
    children: hidden(),
  },
  args: {
    content: "Design Engineer",
    side: "top",
    children: (
      <button
        type="button"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Hover me
      </button>
    ),
  },
} satisfies Meta<typeof AnimatedTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
