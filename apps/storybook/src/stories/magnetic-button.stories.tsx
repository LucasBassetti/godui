import { MagneticButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Magnetic Button",
  component: MagneticButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["default", "secondary", "outline"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    strength: range(0, 1, 0.05, "Behavior"),
    range: range(0, 64, 4, "Behavior"),
    staticLabel: toggle("Behavior"),
    disabled: toggle("State"),
    onClick: action("click"),
  },
  args: {
    children: "Get started",
    variant: "default",
    size: "md",
    strength: 0.4,
    range: 32,
    staticLabel: false,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof MagneticButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
