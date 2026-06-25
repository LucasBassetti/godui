import { TiltCard } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/Tilt Card",
  component: TiltCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    maxTilt: { control: { type: "range", min: 0, max: 30, step: 1 } },
    depth: { control: { type: "range", min: 0, max: 120, step: 5 } },
  },
} satisfies Meta<typeof TiltCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <TiltCard {...args} className="w-72 p-6">
      <h3 className="text-lg font-semibold text-foreground">Tilt me</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pointer-driven 3D tilt with parallax depth and a glare highlight.
      </p>
    </TiltCard>
  ),
};

export const StrongTilt: Story = {
  ...Default,
  args: { maxTilt: 22, depth: 70 },
};

export const NoGlare: Story = {
  ...Default,
  args: { glare: false },
};
