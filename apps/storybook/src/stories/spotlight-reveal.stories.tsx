import { SpotlightReveal, type SpotlightRevealProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range } from "../playground/argtypes";

const meta = {
  title: "Effects/SpotlightReveal",
  component: SpotlightReveal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    radius: range(60, 320, 10, "Appearance"),
    softness: range(0, 1, 0.05, "Appearance"),
    ease: range(0.04, 0.5, 0.02, "Behavior"),
  },
  args: {
    radius: 150,
    softness: 0.55,
    ease: 0.16,
    reveal: (
      <div className="grid size-full place-items-center bg-foreground">
        <span className="font-mono text-xl font-semibold tracking-[0.2em] text-background">
          GODUI-2026
        </span>
      </div>
    ),
  },
  render: (args: SpotlightRevealProps) => (
    <SpotlightReveal {...args} className="size-80 border border-border">
      <div className="grid size-full place-items-center bg-card">
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Move your cursor to reveal
        </span>
      </div>
    </SpotlightReveal>
  ),
} satisfies Meta<typeof SpotlightReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
