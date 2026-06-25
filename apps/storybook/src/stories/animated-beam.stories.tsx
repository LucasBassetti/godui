import { AnimatedBeam } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta: Meta<typeof AnimatedBeam> = {
  title: "Effects/Animated Beam",
  component: AnimatedBeam,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof AnimatedBeam>;

function BeamScene() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const fromRef = React.useRef<HTMLDivElement>(null);
  const toRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative flex h-48 w-96 items-center justify-between px-8"
    >
      <div
        ref={fromRef}
        className="z-10 size-12 rounded-full border border-border bg-card shadow-md"
      />
      <div
        ref={toRef}
        className="z-10 size-12 rounded-full border border-border bg-primary shadow-md"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
      />
    </div>
  );
}

export const Default: Story = {
  render: () => <BeamScene />,
};
