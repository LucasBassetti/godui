import { Lamp } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { color, text } from "../playground/argtypes";

// Lamp wraps headline content under a conic spotlight; we expose the accent
// color plus the headline text and render the latter as children.
type PlaygroundArgs = {
  color: string;
  headline: string;
};

const meta: Meta<PlaygroundArgs> = {
  title: "Effects/Lamp",
  component: Lamp,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: color("Appearance"),
    headline: text("Content"),
  },
  args: {
    headline: "Ship in the spotlight",
  },
  render: ({ color: accent, headline }) => (
    <Lamp color={accent || undefined}>
      <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {headline}
      </h2>
    </Lamp>
  ),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
