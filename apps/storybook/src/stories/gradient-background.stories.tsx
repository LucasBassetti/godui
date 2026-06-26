import {
  GradientBackground,
  type GradientBackgroundProps,
  type GradientBackgroundVariant,
  gradientBackgroundPresets,
  gradientBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { select } from "../playground/argtypes";
import { effectStage } from "../playground/stage";

type PlaygroundArgs = GradientBackgroundProps & {
  variant: GradientBackgroundVariant;
};

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Gradient Background",
  component: GradientBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Gradient Background",
      subtitle: "Spotlit radial washes.",
    }),
  ],
  argTypes: {
    variant: select(gradientBackgroundVariants, "Appearance"),
  },
  args: {
    variant: gradientBackgroundVariants[0],
  },
  render: ({ variant }) => (
    <GradientBackground style={gradientBackgroundPresets[variant]} />
  ),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
