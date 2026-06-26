import { SpotlightCard, type SpotlightCardProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { color, range, toggle } from "../playground/argtypes";

const meta = {
  title: "Effects/SpotlightCard",
  component: SpotlightCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    glowColor: color("Appearance"),
    radius: range(100, 600, 10, "Appearance"),
    border: toggle("Appearance"),
  },
  args: { radius: 350, border: true },
  render: (args: SpotlightCardProps) => (
    <SpotlightCard {...args} className="max-w-sm p-8">
      <h3 className="text-lg font-semibold text-foreground">
        Move your pointer
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The glow tracks the cursor across the card and softly lights the border.
      </p>
    </SpotlightCard>
  ),
} satisfies Meta<typeof SpotlightCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
