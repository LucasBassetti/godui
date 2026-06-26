import { LiquidGlassLens, type LiquidGlassLensProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { color, range } from "../playground/argtypes";

const meta: Meta<LiquidGlassLensProps> = {
  title: "Effects/Liquid Glass Lens",
  component: LiquidGlassLens,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    size: range(80, 320, 4, "Appearance"),
    blur: range(0, 20, 0.5, "Appearance"),
    strength: range(0, 160, 1, "Appearance"),
    dispersion: range(0, 1, 0.01, "Appearance"),
    saturation: range(1, 3, 0.1, "Appearance"),
    sheen: range(0, 1, 0.01, "Appearance"),
    tint: color("Appearance"),
  },
  args: {
    size: 220,
    blur: 2,
    strength: 80,
    dispersion: 0.15,
    saturation: 1.6,
    sheen: 0.5,
  },
  render: (args) => (
    <div className="relative flex min-h-[480px] w-full items-center justify-center overflow-hidden p-10">
      <div className="absolute inset-0 [background:conic-gradient(from_0deg,#ff2d55,#ff9500,#ffd60a,#34c759,#0a84ff,#5e5ce6,#bf5af2,#ff2d55)] opacity-90" />
      <div className="absolute inset-0 [background-image:linear-gradient(#0003_1px,transparent_1px),linear-gradient(90deg,#0003_1px,transparent_1px)] [background-size:32px_32px]" />
      <h2 className="pointer-events-none relative select-none text-6xl font-bold tracking-tight text-white drop-shadow">
        Liquid Glass
      </h2>
      <LiquidGlassLens {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<LiquidGlassLensProps>;

export const Playground: Story = {};
