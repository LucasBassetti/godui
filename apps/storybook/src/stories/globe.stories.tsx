import { Globe, type GlobeProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  type PresetMap,
  presetSelect,
  renderPreset,
} from "../playground/presets";
import { box } from "../playground/stage";

// Globe is driven by a single `config` object (cobe options) rather than flat
// scalar props, so we expose a curated set of config presets instead of a pile
// of raw controls.
const presets: PresetMap<GlobeProps> = {
  Default: {},
  Night: {
    config: {
      dark: 1,
      baseColor: [0.3, 0.3, 0.36],
      glowColor: [0.15, 0.15, 0.2],
      markerColor: [0.9, 0.6, 0.2],
    },
  },
  Emerald: {
    config: {
      diffuse: 1.2,
      markerColor: [0.13, 0.77, 0.55],
      glowColor: [0.6, 0.95, 0.8],
    },
  },
  Magenta: {
    config: {
      diffuse: 0.8,
      markerColor: [0.85, 0.2, 0.6],
      glowColor: [1, 0.7, 0.9],
    },
  },
};

type PlaygroundArgs = GlobeProps & { preset: string };

const meta: Meta<PlaygroundArgs> = {
  title: "Effects/Globe",
  component: Globe,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [box(440, 440)],
  argTypes: { preset: presetSelect(presets, "Appearance") },
  args: { preset: "Default" },
  render: renderPreset(presets, (cfg) => <Globe {...cfg} />),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
