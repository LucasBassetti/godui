import { LiquidImage, type LiquidImageProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { radio, range } from "../playground/argtypes";

const meta = {
  title: "Effects/LiquidImage",
  component: LiquidImage,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    strength: range(0, 80, 2, "Appearance"),
    frequency: range(0.004, 0.04, 0.002, "Appearance"),
    trigger: radio(["hover", "always"], "Behavior"),
  },
  args: {
    src: "https://picsum.photos/id/1018/640/640",
    alt: "Mountain landscape",
    strength: 28,
    frequency: 0.012,
    trigger: "hover",
  },
  render: (args: LiquidImageProps) => (
    <LiquidImage {...args} className="size-80 shadow-xl" />
  ),
} satisfies Meta<typeof LiquidImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
