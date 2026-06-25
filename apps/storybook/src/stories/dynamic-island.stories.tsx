import { DynamicIsland } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Overlays/Dynamic Island",
  component: DynamicIsland,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: "select",
      options: ["compact", "default", "long", "tall", "large"],
    },
  },
} satisfies Meta<typeof DynamicIsland>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: "default" },
  render: (args) => (
    <DynamicIsland {...args}>
      <span className="text-sm">Now playing</span>
    </DynamicIsland>
  ),
};

export const Large: Story = {
  ...Default,
  args: { size: "large" },
};
