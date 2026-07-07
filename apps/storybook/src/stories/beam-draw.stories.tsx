import { BeamDraw } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Effects/Beam Draw",
  component: BeamDraw,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div className="flex min-h-[160vh] flex-col items-center justify-center">
      <p className="mb-6 text-muted-foreground">Scroll to draw the beams</p>
      <BeamDraw {...args} className="max-w-3xl" />
    </div>
  ),
} satisfies Meta<typeof BeamDraw>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
