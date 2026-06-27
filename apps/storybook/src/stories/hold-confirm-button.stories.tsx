import { HoldConfirmButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Hold Confirm Button",
  component: HoldConfirmButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["destructive", "default"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    duration: range(400, 2000, 100, "Behavior"),
    onConfirm: action("confirm"),
  },
  args: {
    children: "Hold to delete",
    variant: "destructive",
    size: "md",
    duration: 900,
    onConfirm: fn(),
  },
} satisfies Meta<typeof HoldConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
