import { MagicInput, type MagicInputProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Inputs/Magic Input",
  component: MagicInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof MagicInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Focus me",
    variant: "primary",
  } satisfies MagicInputProps,
};

export const Secondary: Story = {
  args: {
    placeholder: "Focus me",
    variant: "secondary",
  } satisfies MagicInputProps,
};

export const AlwaysRaised: Story = {
  args: {
    placeholder: "Always 3D",
    depth: "always",
  } satisfies MagicInputProps,
};

export const WithoutRainbow: Story = {
  args: {
    placeholder: "Focus me",
    rainbow: false,
  } satisfies MagicInputProps,
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled",
    disabled: true,
  } satisfies MagicInputProps,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <MagicInput size="sm" placeholder="Small" />
      <MagicInput size="md" placeholder="Medium" />
      <MagicInput size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithSubmitButton: Story = {
  args: {
    placeholder: "Type and submit",
    onSubmit: (value: string) => alert(value),
  } satisfies MagicInputProps,
};

export const LoadingIndeterminate: Story = {
  args: {
    placeholder: "Submitting…",
    onSubmit: () => {},
    status: "loading",
  } satisfies MagicInputProps,
};

export const LoadingDeterminate: Story = {
  args: {
    placeholder: "Uploading…",
    onSubmit: () => {},
    status: "loading",
    progress: 60,
  } satisfies MagicInputProps,
};

export const Success: Story = {
  args: {
    placeholder: "Done",
    onSubmit: () => {},
    status: "success",
  } satisfies MagicInputProps,
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    placeholder: "Failed",
    onSubmit: () => {},
    status: "error",
  } satisfies MagicInputProps,
};

export const SubmitFlow: Story = {
  render: () => {
    const [status, setStatus] =
      React.useState<MagicInputProps["status"]>("idle");
    const [progress, setProgress] = React.useState(0);

    const run = () => {
      if (status !== "idle") return;
      setStatus("loading");
      setProgress(0);
      let p = 0;
      const id = setInterval(() => {
        p += 12;
        setProgress(Math.min(p, 100));
        if (p >= 100) {
          clearInterval(id);
          setStatus("success");
          setTimeout(() => setStatus("idle"), 1600);
        }
      }, 250);
    };

    return (
      <div style={{ width: 280 }}>
        <MagicInput
          placeholder="Type and submit"
          status={status}
          progress={status === "loading" ? progress : undefined}
          onSubmit={run}
        />
      </div>
    );
  },
};

export const Playground: Story = {
  args: {
    placeholder: "Focus me",
    variant: "primary",
    size: "md",
    depth: "focus",
    rainbow: true,
  } satisfies MagicInputProps,
};
