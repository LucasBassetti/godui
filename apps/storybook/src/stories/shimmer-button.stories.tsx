import { ShimmerButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Shimmer Button",
  component: ShimmerButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["primary", "secondary", "outline"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    shimmer: toggle("Appearance"),
    disabled: toggle("State"),
    onClick: action("click"),
  },
  args: {
    children: "Shimmer",
    variant: "primary",
    size: "md",
    shimmer: true,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof ShimmerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
