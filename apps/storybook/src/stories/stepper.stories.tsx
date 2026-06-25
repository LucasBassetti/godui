import { Stepper } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const steps = [
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
  args: { steps, active: 1 },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = { args: { active: 1 } };
export const Vertical: Story = { args: { orientation: "vertical", active: 2 } };
export const Complete: Story = { args: { active: 4 } };

export const Interactive: Story = {
  render: () => {
    const [active, setActive] = React.useState(1);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          alignItems: "center",
        }}
      >
        <Stepper steps={steps} active={active} />
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => setActive((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setActive((s) => Math.min(steps.length, s + 1))}
          >
            Next
          </button>
        </div>
      </div>
    );
  },
};
