import { NeuralGrid, type NeuralGridProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { effectStage } from "../playground/stage";

const presets = {
  Calm: { nodeCount: 48, density: 0.5, pulseSpeed: 1, nodeSize: 2 },
  Busy: { nodeCount: 80, density: 0.9, pulseSpeed: 1.4, nodeSize: 2 },
  Cyan: {
    color: "#22d3ee",
    nodeCount: 48,
    density: 0.5,
    pulseSpeed: 1,
    nodeSize: 2.5,
  },
  Sparse: { nodeCount: 28, density: 0.3, pulseSpeed: 0.8, nodeSize: 3 },
} satisfies PresetMap<NeuralGridProps>;

type PlaygroundArgs = NeuralGridProps & { preset: keyof typeof presets };

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Neural Grid",
  component: NeuralGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Neural Grid",
      subtitle: "Signals firing across a lattice.",
    }),
  ],
  argTypes: {
    preset: presetSelect(presets, "Appearance"),
  },
  args: {
    preset: "Calm",
  },
  render: renderPreset(presets, (cfg) => <NeuralGrid {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
