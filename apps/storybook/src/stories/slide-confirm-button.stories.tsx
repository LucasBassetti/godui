import { SlideConfirmButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Slide Confirm Button",
  component: SlideConfirmButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    label: text("Content"),
    confirmedLabel: text("Content"),
    variant: select(["default", "destructive"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    threshold: range(0.5, 1, 0.05, "Behavior"),
    disabled: toggle("State"),
    onConfirm: action("confirm"),
  },
  args: {
    label: "Slide to confirm",
    confirmedLabel: "Confirmed",
    variant: "default",
    size: "md",
    threshold: 0.9,
    disabled: false,
    onConfirm: fn(),
  },
} satisfies Meta<typeof SlideConfirmButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
