import { Sparkles } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/Sparkles",
  component: Sparkles,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    density: { control: { type: "range", min: 5, max: 100, step: 5 } },
    speed: { control: { type: "range", min: 0.2, max: 3, step: 0.1 } },
  },
} satisfies Meta<typeof Sparkles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Sparkles
      {...args}
      className="flex h-52 w-80 items-center justify-center rounded-2xl bg-card"
    >
      <h2 className="text-4xl font-semibold text-foreground">Magic</h2>
    </Sparkles>
  ),
};

export const Dense: Story = {
  ...Default,
  args: { density: 70 },
};
