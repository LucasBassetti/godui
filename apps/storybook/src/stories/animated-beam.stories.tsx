import { AnimatedBeam, type AnimatedBeamProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { color, range, toggle } from "../playground/argtypes";

// AnimatedBeam needs live element refs (container/from/to) to measure and draw
// the path, so the refs can't be wired to Controls. We expose only the scalar
// props as controls and rebuild the demo scene inside `render`.
type PlaygroundArgs = Pick<
  AnimatedBeamProps,
  | "curvature"
  | "reverse"
  | "duration"
  | "delay"
  | "pathColor"
  | "pathWidth"
  | "pathOpacity"
  | "gradientStartColor"
  | "gradientStopColor"
>;

const meta: Meta<PlaygroundArgs> = {
  title: "Effects/Animated Beam",
  // Cast: the refs are required props but supplied inside `render`, never via
  // Controls, so the Playground args only cover the scalar props.
  component: AnimatedBeam as unknown as React.ComponentType<PlaygroundArgs>,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    curvature: range(-100, 100, 1, "Appearance"),
    pathColor: color("Appearance"),
    pathWidth: range(1, 8, 0.5, "Appearance"),
    pathOpacity: range(0, 1, 0.05, "Appearance"),
    gradientStartColor: color("Appearance"),
    gradientStopColor: color("Appearance"),
    reverse: toggle("Behavior"),
    duration: range(1, 10, 0.5, "Behavior"),
    delay: range(0, 5, 0.5, "Behavior"),
  },
  args: {
    curvature: 0,
    reverse: false,
    duration: 3,
    delay: 0,
    pathWidth: 2,
    pathOpacity: 0.2,
  },
  render: (args) => <BeamScene {...args} />,
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

function BeamScene(args: PlaygroundArgs) {
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
        {...args}
      />
    </div>
  );
}

export const Playground: Story = {};
