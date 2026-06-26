import { Highlighter } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  color,
  hidden,
  range,
  select,
  text,
  toggle,
} from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Text/Highlighter",
  component: Highlighter,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    children: text("Content"),
    action: select(
      [
        "highlight",
        "underline",
        "box",
        "circle",
        "strike-through",
        "crossed-off",
        "bracket",
      ],
      "Appearance",
    ),
    color: color("Appearance"),
    strokeWidth: range(1, 6, 0.5, "Appearance"),
    animationDuration: range(200, 3000, 100, "Behavior"),
    iterations: range(1, 5, 1, "Appearance"),
    padding: range(0, 16, 1, "Appearance"),
    multiline: toggle("Behavior"),
    isView: toggle("Behavior"),
    className: hidden(),
  },
  args: {
    children: "highlight",
    action: "highlight",
    className: "text-3xl font-sans",
  },
} satisfies Meta<typeof Highlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
