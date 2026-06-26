import { MaskButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Mask Button",
  component: MaskButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    mask: select(["nature", "urban", "forest"], "Appearance"),
    variant: select(["primary", "secondary"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    disabled: toggle("State"),
    onClick: action("click"),
  },
  args: {
    children: "Hover me",
    mask: "nature",
    variant: "primary",
    size: "md",
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof MaskButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
