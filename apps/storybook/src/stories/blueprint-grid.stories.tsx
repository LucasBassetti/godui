import { BlueprintGrid, type BlueprintGridProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { color, range, select, toggle } from "../playground/argtypes";
import { effectStage } from "../playground/stage";

const meta = {
  title: "Backgrounds/Blueprint Grid",
  component: BlueprintGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Blueprint Grid",
      subtitle: "Technical, precise, alive.",
    }),
  ],
  argTypes: {
    variant: select(["lines", "dots", "perspective"], "Appearance"),
    cellSize: range(16, 80, 4, "Appearance"),
    color: color("Appearance"),
    sweep: toggle("Behavior"),
    spotlight: toggle("Behavior"),
  },
  args: {
    variant: "lines",
    cellSize: 32,
    sweep: true,
    spotlight: true,
  },
} satisfies Meta<typeof BlueprintGrid>;

export default meta;
type Story = StoryObj<BlueprintGridProps>;

export const Playground: Story = {};
