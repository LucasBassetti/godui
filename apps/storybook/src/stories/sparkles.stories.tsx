import { Sparkles, type SparklesProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { color, range } from "../playground/argtypes";

const meta = {
  title: "Effects/Sparkles",
  component: Sparkles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    color: color("Appearance"),
    density: range(5, 100, 5, "Appearance"),
    minSize: range(0.5, 3, 0.5, "Appearance"),
    maxSize: range(1, 6, 0.5, "Appearance"),
    speed: range(0.2, 3, 0.1, "Behavior"),
  },
  args: {
    density: 40,
    speed: 1,
  },
  render: (args: SparklesProps) => (
    <Sparkles
      {...args}
      className="flex h-52 w-80 items-center justify-center rounded-2xl bg-card"
    >
      <h2 className="text-4xl font-semibold text-foreground">Magic</h2>
    </Sparkles>
  ),
} satisfies Meta<typeof Sparkles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
