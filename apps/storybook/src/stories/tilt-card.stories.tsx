import { TiltCard } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Layout/Tilt Card",
  component: TiltCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    maxTilt: range(0, 30, 1, "Behavior"),
    scale: range(1, 1.2, 0.01, "Behavior"),
    depth: range(0, 120, 5, "Behavior"),
    glare: toggle("Appearance"),
  },
  args: {
    maxTilt: 12,
    scale: 1.04,
    depth: 40,
    glare: true,
  },
  render: (args) => (
    <TiltCard {...args} className="w-72 p-6">
      <h3 className="text-lg font-semibold text-foreground">Tilt me</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Pointer-driven 3D tilt with parallax depth and a glare highlight.
      </p>
    </TiltCard>
  ),
} satisfies Meta<typeof TiltCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
