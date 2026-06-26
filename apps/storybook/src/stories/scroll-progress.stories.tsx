import { ScrollProgress, type ScrollProgressProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { range, select } from "../playground/argtypes";

function ScrollBox(args: ScrollProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      data-scroll-container
      style={{
        position: "relative",
        height: 320,
        width: 420,
        overflowY: "auto",
        borderRadius: 12,
        border: "1px solid var(--border)",
      }}
    >
      <ScrollProgress {...args} container={ref} />
      <div style={{ padding: 24, display: "grid", gap: 16 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static filler
          <p key={i} style={{ margin: 0 }}>
            Scroll this panel to drive the indicator — line {i + 1} of 16.
          </p>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Effects/Scroll Progress",
  component: ScrollProgress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: select(["bar", "circle"], "Appearance"),
    position: select(["bottom-right", "bottom-left"], "Appearance"),
    height: range(2, 12, 1, "Appearance"),
    size: range(36, 72, 2, "Appearance"),
    showAfter: range(0, 1, 0.05, "Behavior"),
  },
  args: {
    variant: "bar",
    position: "bottom-right",
    height: 4,
    size: 48,
    showAfter: 0.05,
  },
  render: (args: ScrollProgressProps) => <ScrollBox {...args} />,
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
