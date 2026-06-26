import { MagicButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Magic Button",
  component: MagicButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["default", "secondary"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    rainbow: toggle("Appearance"),
    disabled: toggle("State"),
    onClick: action("click"),
  },
  args: {
    children: "Push me",
    variant: "default",
    size: "md",
    rainbow: true,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof MagicButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
