import { JellyButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Jelly Button",
  component: JellyButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["primary", "secondary", "outline"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    squash: range(0, 1, 0.05, "Behavior"),
    disabled: toggle("State"),
    onClick: action("click"),
  },
  args: {
    children: "Press me",
    variant: "primary",
    size: "md",
    squash: 0.6,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof JellyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
