import { LiquidGlassLens, type LiquidGlassLensProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<LiquidGlassLensProps> = {
  title: "Effects/Liquid Glass Lens",
  component: LiquidGlassLens,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    size: { control: { type: "range", min: 80, max: 320, step: 4 } },
    blur: { control: { type: "range", min: 0, max: 20, step: 0.5 } },
    strength: { control: { type: "range", min: 0, max: 160, step: 1 } },
    dispersion: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    saturation: { control: { type: "range", min: 1, max: 3, step: 0.1 } },
    sheen: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
  args: {
    size: 220,
    blur: 2,
    strength: 80,
    dispersion: 0.15,
    saturation: 1.6,
    sheen: 0.5,
  },
};

export default meta;
type Story = StoryObj<LiquidGlassLensProps>;

export const Default: Story = {
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
