import {
  ParticleDissolve,
  type ParticleDissolveProps,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { radio, range } from "../playground/argtypes";

const meta = {
  title: "Effects/ParticleDissolve",
  component: ParticleDissolve,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    text: { control: "text", table: { category: "Content" } },
    mode: radio(["assemble", "disperse", "loop"], "Behavior"),
    trigger: radio(["mount", "in-view", "hover"], "Behavior"),
    density: range(2, 10, 1, "Appearance"),
    particleSize: range(1, 6, 1, "Appearance"),
  },
  args: {
    text: "GodUI",
    mode: "loop",
    trigger: "mount",
    density: 4,
    particleSize: 2,
    width: 640,
    height: 240,
  },
  render: (args: ParticleDissolveProps) => (
    <ParticleDissolve {...args} className="text-primary" />
  ),
} satisfies Meta<typeof ParticleDissolve>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
