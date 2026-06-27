import { UndoButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, select, text, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Undo Button",
  component: UndoButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    label: text("Content"),
    undoLabel: text("Content"),
    size: select(["sm", "md", "lg"], "Appearance"),
    duration: range(2000, 10000, 500, "Behavior"),
    pauseOnHover: toggle("Behavior"),
    onCommit: action("commit"),
    onUndo: action("undo"),
  },
  args: {
    label: "Message archived",
    undoLabel: "Undo",
    size: "md",
    duration: 5000,
    pauseOnHover: true,
    onCommit: fn(),
    onUndo: fn(),
  },
} satisfies Meta<typeof UndoButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
