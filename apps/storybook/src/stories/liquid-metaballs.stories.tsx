import { LiquidMetaballs, type LiquidMetaballsProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Liquid Metaballs",
  component: LiquidMetaballs,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">
            Liquid Metaballs
          </h1>
          <p className="mt-2 text-muted-foreground">
            Gooey blobs that merge and split.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof LiquidMetaballs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} satisfies LiquidMetaballsProps };

export const Gooey: Story = {
  args: { gooeyness: 24, blobCount: 9 } satisfies LiquidMetaballsProps,
};

export const Duotone: Story = {
  args: {
    colors: ["#6366f1", "#06b6d4"],
    speed: 0.7,
  } satisfies LiquidMetaballsProps,
};
