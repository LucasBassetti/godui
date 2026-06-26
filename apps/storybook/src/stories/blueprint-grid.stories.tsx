import { BlueprintGrid, type BlueprintGridProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Backgrounds/Blueprint Grid",
  component: BlueprintGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden bg-background">
        <Story />
        <div className="relative z-raised text-center">
          <h1 className="font-semibold text-4xl tracking-tight">
            Blueprint Grid
          </h1>
          <p className="mt-2 text-muted-foreground">
            Technical, precise, alive.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof BlueprintGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lines: Story = {
  args: { variant: "lines" } satisfies BlueprintGridProps,
};
export const Dots: Story = {
  args: { variant: "dots" } satisfies BlueprintGridProps,
};
export const Perspective: Story = {
  args: { variant: "perspective" } satisfies BlueprintGridProps,
};
export const Tinted: Story = {
  args: { color: "#6366f1", cellSize: 40 } satisfies BlueprintGridProps,
};
