import { LightRays, type LightRaysProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Soft: { rayCount: 14, intensity: 0.6, angle: 0, speed: 1, grain: 0.05 },
  Warm: {
    color: "#f59e0b",
    rayCount: 18,
    intensity: 0.7,
    speed: 1,
    grain: 0.05,
  },
  Angled: { rayCount: 14, intensity: 0.6, angle: -20, speed: 1.3, grain: 0.05 },
  Dense: { rayCount: 26, intensity: 0.5, angle: 0, speed: 0.8, grain: 0.08 },
} satisfies PresetMap<LightRaysProps>;

type PlaygroundArgs = LightRaysProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Light Rays",
  component: LightRays,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Light Rays",
      subtitle: "Volumetric god-rays, breathing.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
  },
  args: {
    preset: "Soft",
  },
  render: renderPreset(presets, (cfg) => <LightRays {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
