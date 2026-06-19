import { BorderBeam } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";

const meta = {
  title: "Effects/Border Beam",
  component: BorderBeam,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BorderBeam>;

export default meta;
type Story = StoryObj<typeof meta>;

// A plain card-shaped surface so the beam has a rounded border to ride.
// In a real app this is your own shadcn `<Card>`.
function DemoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[200px] w-[350px] flex-col justify-center overflow-hidden rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <h3 className="font-semibold leading-none">Border Beam</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        A beam of light circles the card border.
      </p>
      {children}
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <DemoCard>
      <BorderBeam {...args} />
    </DemoCard>
  ),
};

export const FastLargeBeam: Story = {
  render: () => (
    <DemoCard>
      <BorderBeam duration={8} size={70} />
    </DemoCard>
  ),
};

export const Reverse: Story = {
  render: () => (
    <DemoCard>
      <BorderBeam size={70} reverse />
    </DemoCard>
  ),
};

export const Glow: Story = {
  render: () => (
    <DemoCard>
      <BorderBeam size={80} glow />
    </DemoCard>
  ),
};

export const ThickColored: Story = {
  render: () => (
    <DemoCard>
      <BorderBeam
        size={70}
        borderWidth={2}
        colorFrom="var(--chart-2)"
        colorTo="var(--chart-4)"
      />
    </DemoCard>
  ),
};

export const DualBeams: Story = {
  render: () => (
    <DemoCard>
      <BorderBeam size={70} duration={6} />
      <BorderBeam size={70} duration={6} delay={3} />
    </DemoCard>
  ),
};
