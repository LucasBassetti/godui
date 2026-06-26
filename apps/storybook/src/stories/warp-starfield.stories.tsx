import { WarpStarfield, type WarpStarfieldProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { toggle } from "../playground/argtypes";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Cruise: { starCount: 400, speed: 1, depth: 1.5, parallax: 30 },
  Hyperspace: { starCount: 400, speed: 1.6, depth: 1.5, parallax: 30 },
  Dense: { starCount: 700, speed: 0.7, depth: 1.5, parallax: 30 },
  Deep: { starCount: 400, speed: 1, depth: 2.4, parallax: 45 },
} satisfies PresetMap<WarpStarfieldProps>;

type PlaygroundArgs = WarpStarfieldProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Warp Starfield",
  component: WarpStarfield,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Warp Starfield",
      subtitle: "Fly through the stars.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
    warp: toggle("Behavior"),
  },
  args: {
    preset: "Cruise",
    warp: false,
  },
  render: renderPreset(presets, (cfg) => <WarpStarfield {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
