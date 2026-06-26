import {
  TopographicDrift,
  type TopographicDriftProps,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Calm: { lineCount: 9, noiseScale: 0.004, speed: 1, weight: 1 },
  Dense: { lineCount: 16, noiseScale: 0.006, speed: 1, weight: 1 },
  Sky: {
    color: "#0ea5e9",
    lineCount: 9,
    noiseScale: 0.004,
    speed: 1,
    weight: 1.4,
  },
  Broad: { lineCount: 7, noiseScale: 0.0025, speed: 0.8, weight: 1.2 },
} satisfies PresetMap<TopographicDriftProps>;

type PlaygroundArgs = TopographicDriftProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Topographic Drift",
  component: TopographicDrift,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Topographic Drift",
      subtitle: "A living elevation map.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
  },
  args: {
    preset: "Calm",
  },
  render: renderPreset(presets, (cfg) => <TopographicDrift {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
