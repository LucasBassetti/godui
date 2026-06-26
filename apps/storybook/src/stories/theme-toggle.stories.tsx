import { ThemeToggle } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Buttons/Theme Toggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    duration: range(200, 1200, 50, "Behavior"),
    onThemeChange: action("themeChange"),
  },
  args: {
    duration: 500,
    onThemeChange: fn(),
  },
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
