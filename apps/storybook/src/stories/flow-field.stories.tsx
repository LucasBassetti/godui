import { FlowField, type FlowFieldProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Flow Field",
  component: FlowField,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">Flow Field</h1>
          <p className="mt-2 text-muted-foreground">
            Particles riding the currents.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof FlowField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} satisfies FlowFieldProps };

export const LongTrails: Story = {
  args: { fade: 0.02, speed: 1.2 } satisfies FlowFieldProps,
};

export const Tinted: Story = {
  args: { color: "#10b981", noiseScale: 0.0024 } satisfies FlowFieldProps,
};
