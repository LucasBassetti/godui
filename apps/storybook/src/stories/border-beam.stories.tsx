import { BorderBeam } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type * as React from "react";
import { color, range, toggle } from "../playground/argtypes";

const meta = {
  title: "Effects/Border Beam",
  component: BorderBeam,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: range(20, 120, 1, "Appearance"),
    borderWidth: range(1, 6, 0.5, "Appearance"),
    colorFrom: color("Appearance"),
    colorTo: color("Appearance"),
    glow: toggle("Appearance"),
    rainbow: toggle("Appearance"),
    duration: range(2, 20, 1, "Behavior"),
    delay: range(0, 10, 0.5, "Behavior"),
    initialOffset: range(0, 100, 1, "Behavior"),
    reverse: toggle("Behavior"),
  },
  args: {
    size: 70,
    borderWidth: 1,
    glow: false,
    rainbow: false,
    duration: 15,
    delay: 0,
    initialOffset: 0,
    reverse: false,
  },
  render: (args) => (
    <DemoCard>
      <BorderBeam {...args} />
    </DemoCard>
  ),
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

export const Playground: Story = {};
