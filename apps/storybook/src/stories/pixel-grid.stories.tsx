import { PixelGrid, type PixelGridProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { radio, toggle } from "../playground/argtypes";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Default: { squareSize: 4, gridGap: 6, flickerChance: 0.3, maxOpacity: 0.3 },
  Dense: { squareSize: 2, gridGap: 2, flickerChance: 0.2, maxOpacity: 0.4 },
  Violet: {
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    maxOpacity: 0.5,
    color: "oklch(0.7 0.18 280)",
  },
  Chunky: { squareSize: 8, gridGap: 8, flickerChance: 0.35, maxOpacity: 0.35 },
} satisfies PresetMap<PixelGridProps>;

type PlaygroundArgs = PixelGridProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Pixel Grid",
  component: PixelGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Pixel Grid",
      subtitle: "A flickering field that follows your cursor.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
    interactive: toggle("Behavior"),
    cursorReveal: radio(["hidden", "dim"], "Behavior"),
  },
  args: {
    preset: "Default",
    interactive: false,
    cursorReveal: "hidden",
  },
  render: renderPreset(presets, (cfg) => <PixelGrid {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
