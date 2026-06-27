import { VoiceButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Voice Button",
  component: VoiceButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["default", "outline"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    mode: select(["toggle", "hold"], "Behavior"),
    bars: range(3, 9, 1, "Appearance"),
    onStart: action("start"),
    onStop: action("stop"),
  },
  args: {
    children: "Record",
    variant: "default",
    size: "md",
    mode: "toggle",
    bars: 5,
    onStart: fn(),
    onStop: fn(),
  },
} satisfies Meta<typeof VoiceButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
