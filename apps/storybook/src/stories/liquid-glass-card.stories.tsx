import { LiquidGlassCard, type LiquidGlassCardProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

const meta: Meta<LiquidGlassCardProps> = {
  title: "Effects/Liquid Glass Card",
  component: LiquidGlassCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    radius: { control: { type: "range", min: 0, max: 64, step: 1 } },
    blur: { control: { type: "range", min: 0, max: 20, step: 0.5 } },
    strength: { control: { type: "range", min: 0, max: 160, step: 1 } },
    dispersion: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    saturation: { control: { type: "range", min: 1, max: 3, step: 0.1 } },
    sheen: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
  args: {
    radius: 28,
    blur: 2,
    strength: 60,
    dispersion: 0.15,
    saturation: 1.6,
    sheen: 0.5,
  },
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

export const Default: Story = {
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

export const Cards: Story = {
  render: (args) => (
    <Backdrop>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {["Refract", "Disperse", "Reflect"].map((label) => (
          <LiquidGlassCard key={label} {...args} className="w-48 p-6">
            <span className="text-lg font-semibold text-white drop-shadow">
              {label}
            </span>
          </LiquidGlassCard>
        ))}
      </div>
    </Backdrop>
  ),
};
