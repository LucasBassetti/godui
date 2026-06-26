import { MagicTab } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, select, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const items = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics" },
  { value: "reports", label: "Reports" },
  { value: "settings", label: "Settings" },
];

const meta = {
  title: "Navigation/Magic Tab",
  component: MagicTab,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    items: hidden(),
    value: hidden(),
    variant: select(["default", "secondary"], "Appearance"),
    size: select(["sm", "md", "lg"], "Appearance"),
    rainbow: toggle("Appearance"),
    defaultValue: select(
      ["overview", "analytics", "reports", "settings"],
      "State",
    ),
    onValueChange: action("valueChange"),
  },
  args: {
    items,
    variant: "default",
    size: "md",
    rainbow: true,
    defaultValue: "overview",
    onValueChange: fn(),
  },
} satisfies Meta<typeof MagicTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
