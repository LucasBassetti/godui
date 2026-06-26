import { OTPInput } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Inputs/OTP Input",
  component: OTPInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    length: range(4, 8, 1, "Appearance"),
    type: select(["numeric", "alphanumeric"], "Behavior"),
    mask: toggle("Appearance"),
    disabled: toggle("State"),
    status: select(["idle", "error", "success"], "State"),
    onChange: action("change"),
    onComplete: action("complete"),
  },
  args: {
    length: 6,
    type: "numeric",
    mask: false,
    disabled: false,
    status: "idle",
    onChange: fn(),
    onComplete: fn(),
  },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
