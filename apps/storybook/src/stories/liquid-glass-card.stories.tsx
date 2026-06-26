import { LiquidGlassCard, type LiquidGlassCardProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { color, range } from "../playground/argtypes";

const meta: Meta<LiquidGlassCardProps> = {
  title: "Effects/Liquid Glass Card",
  component: LiquidGlassCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    radius: range(0, 64, 1, "Appearance"),
    blur: range(0, 20, 0.5, "Appearance"),
    strength: range(0, 160, 1, "Appearance"),
    dispersion: range(0, 1, 0.01, "Appearance"),
    saturation: range(1, 3, 0.1, "Appearance"),
    sheen: range(0, 1, 0.01, "Appearance"),
    tint: color("Appearance"),
  },
  args: {
    radius: 28,
    blur: 2,
    strength: 60,
    dispersion: 0.15,
    saturation: 1.6,
    sheen: 0.5,
  },
  render: (args) => (
    <Backdrop>
      <LiquidGlassCard {...args} className="w-80 p-8">
        <h3 className="text-xl font-semibold text-white drop-shadow">
          Liquid Glass
        </h3>
        <p className="mt-2 text-sm text-white/80">
          Move your cursor across the panel — the light tracks the pointer while
          the backdrop bends through the lens.
        </p>
      </LiquidGlassCard>
    </Backdrop>
  ),
};

export default meta;
type Story = StoryObj<LiquidGlassCardProps>;

// A busy backdrop so the refraction and color fringing are obvious.
const Backdrop = ({ children }: { children: ReactNode }) => (
  <div className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden p-10">
    <div className="absolute inset-0 [background:conic-gradient(from_0deg,#ff2d55,#ff9500,#ffd60a,#34c759,#0a84ff,#5e5ce6,#bf5af2,#ff2d55)] opacity-90" />
    <div className="absolute inset-0 [background-image:linear-gradient(#0003_1px,transparent_1px),linear-gradient(90deg,#0003_1px,transparent_1px)] [background-size:32px_32px]" />
    {children}
  </div>
);

export const Playground: Story = {};
