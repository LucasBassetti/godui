import { HolographicCard } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, select, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

const meta = {
  title: "Layout/Holographic Card",
  component: HolographicCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    variant: select(["rainbow", "aurora", "galaxy", "gold"], "Appearance"),
    maxTilt: range(0, 30, 1, "Behavior"),
    glare: toggle("Appearance"),
    sparkle: toggle("Appearance"),
    gyroscope: toggle("Behavior"),
  },
  args: {
    variant: "rainbow",
    maxTilt: 14,
    glare: true,
    sparkle: true,
    gyroscope: false,
  },
  render: (args) => (
    <HolographicCard {...args} className="h-96 w-72 p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-white/60">
          Founding Member
        </span>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white ring-1 ring-white/20">
          #001
        </span>
      </div>
      <div className="mt-32">
        <h3 className="text-2xl font-semibold tracking-tight text-white">
          GodUI
        </h3>
        <p className="mt-2 text-sm text-white/70">
          Move your pointer across the card to catch the foil.
        </p>
      </div>
    </HolographicCard>
  ),
} satisfies Meta<typeof HolographicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Aurora: Story = { args: { variant: "aurora" } };

export const Gold: Story = { args: { variant: "gold" } };
