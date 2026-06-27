import { VoiceOrb } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { radio, range } from "../playground/argtypes";

const meta = {
  title: "AI/Voice Orb",
  component: VoiceOrb,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    state: radio(["idle", "listening", "speaking"], "State"),
    amplitude: range(0, 1, 0.01, "State"),
    size: range(80, 320, 8, "Appearance"),
  },
  args: { state: "idle", amplitude: 0, size: 160 },
} satisfies Meta<typeof VoiceOrb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Idle: Story = { args: { state: "idle" } };

export const Listening: Story = {
  args: { state: "listening", amplitude: 0.4 },
};

export const Speaking: Story = { args: { state: "speaking", amplitude: 0.7 } };

/** Self-driving demo: a synthetic amplitude loop stands in for a live mic. */
export const LiveSimulation: Story = {
  render: (args) => {
    const [amp, setAmp] = React.useState(0);
    React.useEffect(() => {
      let raf = 0;
      const loop = () => {
        const t = performance.now() / 1000;
        setAmp((0.5 + 0.5 * Math.sin(t * 6)) * (0.6 + 0.4 * Math.sin(t * 1.7)));
        raf = requestAnimationFrame(loop);
      };
      loop();
      return () => cancelAnimationFrame(raf);
    }, []);
    return <VoiceOrb {...args} state="speaking" amplitude={amp} />;
  },
};
