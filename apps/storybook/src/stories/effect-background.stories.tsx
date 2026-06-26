import {
  EffectBackground,
  type EffectBackgroundProps,
  type EffectBackgroundVariant,
  effectBackgroundPresets,
  effectBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { select } from "../playground/argtypes";
import { effectStage } from "../playground/stage";

type PlaygroundArgs = EffectBackgroundProps & {
  variant: EffectBackgroundVariant;
};

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Effect Background",
  component: EffectBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Effect Background",
      subtitle: "Layered gradient washes.",
    }),
  ],
  argTypes: {
    variant: select(effectBackgroundVariants, "Appearance"),
  },
  args: {
    variant: effectBackgroundVariants[0],
  },
  render: ({ variant }) => (
    <EffectBackground style={effectBackgroundPresets[variant]} />
  ),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
