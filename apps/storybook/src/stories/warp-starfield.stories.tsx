import { WarpStarfield, type WarpStarfieldProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Warp Starfield",
  component: WarpStarfield,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">
            Warp Starfield
          </h1>
          <p className="mt-2 text-muted-foreground">Fly through the stars.</p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof WarpStarfield>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} satisfies WarpStarfieldProps };

export const Hyperspace: Story = {
  args: { warp: true, speed: 1.6 } satisfies WarpStarfieldProps,
};

export const Dense: Story = {
  args: { starCount: 700, speed: 0.7 } satisfies WarpStarfieldProps,
};
