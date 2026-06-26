import {
  TopographicDrift,
  type TopographicDriftProps,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Topographic Drift",
  component: TopographicDrift,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">
            Topographic Drift
          </h1>
          <p className="mt-2 text-muted-foreground">A living elevation map.</p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof TopographicDrift>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} satisfies TopographicDriftProps };

export const Dense: Story = {
  args: { lineCount: 16, noiseScale: 0.006 } satisfies TopographicDriftProps,
};

export const Tinted: Story = {
  args: { color: "#0ea5e9", weight: 1.4 } satisfies TopographicDriftProps,
};
