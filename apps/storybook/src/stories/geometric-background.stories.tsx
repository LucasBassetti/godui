import {
  GeometricBackground,
  type GeometricBackgroundProps,
  type GeometricBackgroundVariant,
  geometricBackgroundPresets,
  geometricBackgroundVariants,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { select } from "../playground/argtypes";
import { effectStage } from "../playground/stage";

type PlaygroundArgs = GeometricBackgroundProps & {
  variant: GeometricBackgroundVariant;
};

const meta: Meta<PlaygroundArgs> = {
  title: "Backgrounds/Geometric Background",
  component: GeometricBackground,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    effectStage({
      title: "Geometric Background",
      subtitle: "Ruled grids meet soft glows.",
    }),
  ],
  argTypes: {
    variant: select(geometricBackgroundVariants, "Appearance"),
  },
  args: {
    variant: geometricBackgroundVariants[0],
  },
  render: ({ variant }) => (
    <GeometricBackground style={geometricBackgroundPresets[variant]} />
  ),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
