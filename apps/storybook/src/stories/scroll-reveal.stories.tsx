import { ScrollReveal, type ScrollRevealProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
  args: { direction: "up", blur: true, once: true },
  render: (args: ScrollRevealProps) => (
    <div className="flex flex-col items-center gap-24 p-8">
      <Filler />
      <ScrollReveal {...args}>
        <Block>I reveal on scroll</Block>
      </ScrollReveal>
      <ScrollReveal {...args} delay={0.1}>
        <Block>Staggered sibling</Block>
      </ScrollReveal>
      <Filler />
    </div>
  ),
} satisfies Meta<typeof ScrollReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FromLeft: Story = { args: { direction: "left", distance: 80 } };

export const NoBlur: Story = { args: { blur: false } };

export const VelocitySkew: Story = { args: { velocitySkew: true } };
