import { MagicInput } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Inputs/Magic Input",
  component: MagicInput,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered(320)],
  argTypes: {
    variant: select(["primary", "secondary"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    depth: select(["focus", "always"], "Appearance"),
    rainbow: toggle("Appearance"),
    submitButton: toggle("Behavior"),
    submitLabel: text("Content"),
    placeholder: text("Content"),
    status: select(["idle", "loading", "success", "error"], "State"),
    progress: range(0, 100, 1, "State"),
    disabled: toggle("State"),
    onSubmit: action("submit"),
  },
  args: {
    variant: "primary",
    size: "md",
    depth: "focus",
    rainbow: true,
    submitButton: false,
    submitLabel: "Go",
    placeholder: "Focus me",
    status: "idle",
    progress: 0,
    disabled: false,
    onSubmit: fn(),
  },
} satisfies Meta<typeof MagicInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
