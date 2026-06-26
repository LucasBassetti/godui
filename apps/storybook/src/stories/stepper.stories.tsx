import { type Step, Stepper } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, range, select } from "../playground/argtypes";
import { padded } from "../playground/stage";

const steps: Step[] = [
  { label: "Account", description: "Email & password" },
  { label: "Profile", description: "Name & avatar" },
  { label: "Workspace", description: "Invite your team" },
  { label: "Done", description: "All set" },
];

const meta = {
  title: "Layout/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [padded(640)],
  argTypes: {
    steps: hidden(),
    active: range(0, 4, 1, "State"),
    orientation: select(["horizontal", "vertical"], "Appearance"),
  },
  args: {
    steps,
    active: 1,
    orientation: "horizontal",
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
