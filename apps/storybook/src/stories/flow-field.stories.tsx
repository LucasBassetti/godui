import { FlowField, type FlowFieldProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Calm: { speed: 1, fade: 0.06, noiseScale: 0.0016 },
  "Long Trails": { speed: 1.2, fade: 0.02, noiseScale: 0.0016 },
  Emerald: { color: "#10b981", speed: 1, fade: 0.05, noiseScale: 0.0024 },
  Crisp: { speed: 0.8, fade: 0.12, noiseScale: 0.002 },
} satisfies PresetMap<FlowFieldProps>;

type PlaygroundArgs = FlowFieldProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Flow Field",
  component: FlowField,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Flow Field",
      subtitle: "Particles riding the currents.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
  },
  args: {
    preset: "Calm",
  },
  render: renderPreset(presets, (cfg) => <FlowField {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
