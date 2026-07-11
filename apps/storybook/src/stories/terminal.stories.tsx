import {
  Terminal,
  type TerminalLine,
  type TerminalProps,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const LINES: TerminalLine[] = [
  { text: "npm install @godui/components", type: "command" },
  { text: "added 1 package in 1.2s", type: "output", delay: 500 },
  { text: "", type: "output", delay: 120 },
  { text: "npm run build", type: "command" },
  { text: "▲ Compiled successfully", type: "output", delay: 600 },
  { text: "✓ Ready in 240ms", type: "output", delay: 300 },
];

const meta = {
  title: "Effects/Terminal",
  component: Terminal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    lines: LINES,
    title: "zsh — godui",
    typingSpeed: 38,
    startOnView: false,
    loop: false,
    showChrome: true,
    promptSymbol: "$",
  } satisfies TerminalProps,
  argTypes: {
    typingSpeed: { control: { type: "range", min: 10, max: 120, step: 2 } },
    startOnView: { control: "boolean" },
    loop: { control: "boolean" },
    showChrome: { control: "boolean" },
    promptSymbol: { control: "text" },
    title: { control: "text" },
  },
  render: (args) => <Terminal {...args} className="w-[26rem]" />,
} satisfies Meta<typeof Terminal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Looping: Story = {
  args: { loop: true },
};

export const Bare: Story = {
  args: { showChrome: false, title: undefined },
};
