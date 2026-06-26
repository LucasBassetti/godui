import { AuroraText } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, range, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Text/AuroraText",
  component: AuroraText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    speed: range(0.5, 5, 0.5, "Behavior"),
    colors: hidden(),
    className: hidden(),
  },
  args: {
    children: "Aurora",
    speed: 1,
    className: "text-6xl font-bold tracking-tight",
  },
} satisfies Meta<typeof AuroraText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
