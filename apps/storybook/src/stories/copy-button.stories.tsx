import { CopyButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, select, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Copy Button",
  component: CopyButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    value: text("Content"),
    children: text("Content"),
    variant: select(["default", "secondary", "outline", "ghost"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    onCopy: action("copy"),
  },
  args: {
    value: "npm install @godui/components",
    children: "Copy",
    variant: "outline",
    size: "md",
    onCopy: fn(),
  },
} satisfies Meta<typeof CopyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const IconOnly: Story = {
  args: { children: undefined, variant: "ghost" },
};
