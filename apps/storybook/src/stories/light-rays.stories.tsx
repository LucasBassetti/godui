import { LightRays, type LightRaysProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Light Rays",
  component: LightRays,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">Light Rays</h1>
          <p className="mt-2 text-muted-foreground">
            Volumetric god-rays, breathing.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof LightRays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} satisfies LightRaysProps };

export const Warm: Story = {
  args: {
    color: "#f59e0b",
    rayCount: 18,
    intensity: 0.7,
  } satisfies LightRaysProps,
};

export const Angled: Story = {
  args: { angle: -20, speed: 1.3 } satisfies LightRaysProps,
};
