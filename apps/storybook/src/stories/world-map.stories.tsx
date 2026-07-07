import { WorldMap } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Visualizations/World Map",
  component: WorldMap,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered(900)],
  argTypes: {
    loop: toggle("Behavior"),
  },
  args: {
    loop: true,
  },
  render: (args) => <WorldMap {...args} />,
} satisfies Meta<typeof WorldMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SinglePulse: Story = {
  args: {
    loop: false,
    connections: [
      {
        start: { lat: 40.7128, lng: -74.006, label: "New York" },
        end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" },
      },
    ],
  },
};
