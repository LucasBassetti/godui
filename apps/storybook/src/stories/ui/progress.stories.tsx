import { Button, Progress } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  args: { className: "w-80", "aria-label": "Progress" },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** shadcn's demo: starts at 13 and jumps to 66 after 500ms. */
export const Default: Story = {
  render: (args) => {
    const [progress, setProgress] = useState(13);
    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);
    return <Progress {...args} value={progress} />;
  },
};

/** No value: the bar sweeps across the track on a loop. */
export const Indeterminate: Story = {
  args: { value: null },
};

const STEPS = [13, 66, 100];

/** Steps through values on demand (used by the motion trace). */
export const Stepped: Story = {
  render: (args) => {
    const [step, setStep] = useState(0);
    return (
      <div className="flex w-80 flex-col items-start gap-4">
        <Progress {...args} value={STEPS[step]} />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStep((s) => (s + 1) % STEPS.length)}
        >
          Advance
        </Button>
      </div>
    );
  },
};

const RESOLVE_STEPS = [null, 66, 100];

/** Starts indeterminate; Advance resolves it to a value mid-sweep. */
export const FromIndeterminate: Story = {
  render: (args) => {
    const [step, setStep] = useState(0);
    return (
      <div className="flex w-80 flex-col items-start gap-4">
        <Progress {...args} value={RESOLVE_STEPS[step]} />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setStep((s) => (s + 1) % RESOLVE_STEPS.length)}
        >
          Advance
        </Button>
      </div>
    );
  },
};
