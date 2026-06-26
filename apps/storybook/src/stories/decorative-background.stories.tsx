import {
  DecorativeBackground,
  type DecorativeBackgroundProps,
  type DecorativeBackgroundVariant,
  decorativeBackgroundPresets,
  decorativeBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { select } from "../playground/argtypes";
import { effectStage } from "../playground/stage";

type PlaygroundArgs = DecorativeBackgroundProps & {
  variant: DecorativeBackgroundVariant;
};

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Decorative Background",
  component: DecorativeBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Decorative Background",
      subtitle: "Drop-in full-bleed surfaces.",
    }),
  ],
  argTypes: {
    variant: select(decorativeBackgroundVariants, "Appearance"),
  },
  args: {
    variant: decorativeBackgroundVariants[0],
  },
  render: ({ variant }) => (
    <DecorativeBackground style={decorativeBackgroundPresets[variant]} />
  ),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
