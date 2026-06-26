import { LiquidMetaballs, type LiquidMetaballsProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { toggle } from "../playground/argtypes";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Aurora: {
    colors: ["#6366f1", "#a855f7", "#ec4899", "#06b6d4"],
    speed: 1,
    gooeyness: 16,
    blobCount: 7,
  },
  Sunset: {
    colors: ["#f97316", "#f43f5e", "#f59e0b"],
    speed: 0.7,
    gooeyness: 22,
    blobCount: 6,
  },
  Ocean: {
    colors: ["#0ea5e9", "#06b6d4", "#14b8a6"],
    speed: 1.2,
    gooeyness: 14,
    blobCount: 9,
  },
  Mono: {
    colors: ["#94a3b8", "#cbd5e1", "#64748b"],
    speed: 0.8,
    gooeyness: 18,
    blobCount: 7,
  },
} satisfies PresetMap<LiquidMetaballsProps>;

type PlaygroundArgs = LiquidMetaballsProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Liquid Metaballs",
  component: LiquidMetaballs,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Liquid Metaballs",
      subtitle: "Gooey blobs that merge and split.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
    interactive: toggle("Behavior"),
  },
  args: {
    preset: "Aurora",
    interactive: true,
  },
  render: renderPreset(presets, (cfg) => <LiquidMetaballs {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
