import { ScrollReveal, type ScrollRevealProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, select, toggle } from "../playground/argtypes";

const Block = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-40 w-80 items-center justify-center rounded-xl border border-border bg-card text-lg font-semibold text-foreground shadow-sm">
    {children}
  </div>
);

const Filler = () => (
  <div className="flex h-[70vh] items-center justify-center text-sm text-muted-foreground">
    Scroll down ↓
  </div>
);

const meta = {
  title: "Effects/ScrollReveal",
  component: ScrollReveal,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    direction: select(["up", "down", "left", "right"], "Behavior"),
    distance: range(0, 120, 5, "Behavior"),
    delay: range(0, 1, 0.05, "Behavior"),
    blur: toggle("Appearance"),
    once: toggle("Behavior"),
    velocitySkew: toggle("Behavior"),
  },
  args: {
    direction: "up",
    distance: 40,
    delay: 0,
    blur: true,
    once: true,
    velocitySkew: false,
  },
  render: (args: ScrollRevealProps) => (
    <div className="flex flex-col items-center gap-24 p-8">
      <Filler />
      <ScrollReveal {...args}>
        <Block>I reveal on scroll</Block>
      </ScrollReveal>
      <ScrollReveal {...args} delay={(args.delay ?? 0) + 0.1}>
        <Block>Staggered sibling</Block>
      </ScrollReveal>
      <Filler />
    </div>
  ),
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
