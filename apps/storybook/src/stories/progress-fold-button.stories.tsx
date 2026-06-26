import { ProgressFoldButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Progress Fold Button",
  component: ProgressFoldButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    variant: select(["primary", "secondary"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    status: select(["idle", "loading"], "State"),
    progress: range(0, 100, 5, "State"),
    disabled: toggle("State"),
    onClick: action("click"),
  },
  args: {
    children: "Submit",
    variant: "primary",
    size: "md",
    status: "idle",
    progress: 40,
    disabled: false,
    onClick: fn(),
  },
} satisfies Meta<typeof ProgressFoldButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
