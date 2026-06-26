import { DynamicIsland } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, select } from "../playground/argtypes";

const meta = {
  title: "Overlays/Dynamic Island",
  component: DynamicIsland,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: select(["compact", "default", "long", "tall", "large"], "Appearance"),
    presenceKey: hidden(),
    children: hidden(),
  },
  args: { size: "default" },
} satisfies Meta<typeof DynamicIsland>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DynamicIsland {...args}>
      <span className="text-sm">Now playing</span>
    </DynamicIsland>
  ),
};
