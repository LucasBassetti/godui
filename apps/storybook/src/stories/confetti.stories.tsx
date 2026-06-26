import { ConfettiButton } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, range, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

// The burst is tuned through a single `options` object, so we expose its scalar
// knobs as flat controls and reassemble them into `options` in `render`.
type PlaygroundArgs = {
  label: string;
  particleCount: number;
  spread: number;
  startVelocity: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const meta: Meta<PlaygroundArgs> = {
  title: "Effects/Confetti",
  component: ConfettiButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered()],
  argTypes: {
    label: text("Content"),
    particleCount: range(20, 400, 5, "Appearance"),
    spread: range(20, 180, 5, "Appearance"),
    startVelocity: range(15, 90, 1, "Appearance"),
    onClick: action("click"),
  },
  args: {
    label: "Celebrate 🎉",
    particleCount: 120,
    spread: 70,
    startVelocity: 45,
    onClick: fn(),
  },
  render: ({ label, particleCount, spread, startVelocity, onClick }) => (
    <ConfettiButton
      className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      options={{ particleCount, spread, startVelocity }}
      onClick={onClick}
    >
      {label}
    </ConfettiButton>
  ),
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

export const Playground: Story = {};
