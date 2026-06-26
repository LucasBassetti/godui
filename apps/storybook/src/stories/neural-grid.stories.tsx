import { NeuralGrid, type NeuralGridProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Neural Grid",
  component: NeuralGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">Neural Grid</h1>
          <p className="mt-2 text-muted-foreground">
            Signals firing across a lattice.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof NeuralGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} satisfies NeuralGridProps };

export const Busy: Story = {
  args: {
    nodeCount: 80,
    density: 0.9,
    pulseSpeed: 1.4,
  } satisfies NeuralGridProps,
};

export const Tinted: Story = {
  args: { color: "#22d3ee", nodeSize: 2.5 } satisfies NeuralGridProps,
};
