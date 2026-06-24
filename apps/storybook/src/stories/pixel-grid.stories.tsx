import { PixelGrid, type PixelGridProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<PixelGridProps> = {
  title: "Backgrounds/Pixel Grid",
  component: PixelGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    squareSize: { control: { type: "number" } },
    gridGap: { control: { type: "number" } },
    flickerChance: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    maxOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    interactive: { control: "boolean" },
    interactionRadius: { control: { type: "number" } },
    interactionStrength: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
    },
    cursorReveal: { control: "inline-radio", options: ["hidden", "dim"] },
    color: { control: "color" },
  },
  args: {
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    maxOpacity: 0.3,
    interactive: false,
    interactionRadius: 120,
    interactionStrength: 1,
    cursorReveal: "hidden",
  },
};

export default meta;
type Story = StoryObj<PixelGridProps>;

const Stage = (args: PixelGridProps, label: string) => (
  <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-background">
    <PixelGrid {...args} />
    <p className="relative z-raised rounded-lg bg-background/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur">
      {label}
    </p>
  </div>
);

// Automatic animated background — the whole field flickers on its own.
export const Automatic: Story = {
  args: { interactive: false },
  render: (args) => Stage(args, "Automatic animated background"),
};

// Cursor mode: only squares within the radius animate, the rest hidden.
export const CursorReveal: Story = {
  args: { interactive: true, cursorReveal: "hidden" },
  render: (args) => Stage(args, "Move your cursor across the grid"),
};

// Cursor mode with a static dim field outside the radius.
export const CursorRevealDim: Story = {
  args: { interactive: true, cursorReveal: "dim" },
  render: (args) => Stage(args, "Move your cursor across the grid"),
};

export const CustomColor: Story = {
  args: { color: "oklch(0.7 0.18 280)", maxOpacity: 0.5 },
  render: (args) => Stage(args, "Custom color"),
};

export const Dense: Story = {
  args: { squareSize: 2, gridGap: 2, flickerChance: 0.2, maxOpacity: 0.4 },
  render: (args) => Stage(args, "Dense grid"),
};
