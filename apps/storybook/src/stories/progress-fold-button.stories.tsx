import {
  ProgressFoldButton,
  type ProgressFoldButtonProps,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Buttons/Progress Fold Button",
  component: ProgressFoldButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ProgressFoldButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Submit",
    variant: "primary",
  } satisfies ProgressFoldButtonProps,
};

export const Secondary: Story = {
  args: {
    children: "Submit",
    variant: "secondary",
  } satisfies ProgressFoldButtonProps,
};

export const Disabled: Story = {
  args: {
    children: "Submit",
    variant: "primary",
    disabled: true,
  } satisfies ProgressFoldButtonProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <ProgressFoldButton size="sm">Small</ProgressFoldButton>
      <ProgressFoldButton size="md">Medium</ProgressFoldButton>
      <ProgressFoldButton size="lg">Large</ProgressFoldButton>
    </div>
  ),
};

// Indeterminate: click to fold open and loop the bar until clicked again.
export const Indeterminate: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);
    return (
      <ProgressFoldButton
        status={loading ? "loading" : "idle"}
        onClick={() => setLoading((v) => !v)}
        style={{ minWidth: 160 }}
      >
        {loading ? "Working…" : "Start"}
      </ProgressFoldButton>
    );
  },
};

// Determinate: click to run a progress ramp from 0 to 100, then reset.
export const Determinate: Story = {
  render: () => {
    const [progress, setProgress] = React.useState<number | null>(null);

    React.useEffect(() => {
      if (progress == null) return;
      if (progress >= 100) {
        const id = setTimeout(() => setProgress(null), 600);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setProgress((p) => (p ?? 0) + 10), 250);
      return () => clearTimeout(id);
    }, [progress]);

    return (
      <ProgressFoldButton
        status={progress == null ? "idle" : "loading"}
        progress={progress ?? undefined}
        onClick={() => {
          if (progress == null) setProgress(0);
        }}
        style={{ minWidth: 160 }}
      >
        {progress == null ? "Upload" : `${progress}%`}
      </ProgressFoldButton>
    );
  },
};
