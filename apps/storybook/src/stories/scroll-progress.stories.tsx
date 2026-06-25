import { ScrollProgress } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Effects/Scroll Progress",
  component: ScrollProgress,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ScrollProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

function ScrollBox({ variant }: { variant: "bar" | "circle" }) {
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
      {variant === "bar" && <ScrollProgress container={ref} />}
      <div style={{ padding: 24, display: "grid", gap: 16 }}>
        {Array.from({ length: 16 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static filler
          <p key={i} style={{ margin: 0 }}>
            Scroll this panel to drive the indicator — line {i + 1} of 16.
          </p>
        ))}
      </div>
      {variant === "circle" && (
        <ScrollProgress
          variant="circle"
          container={ref}
          showAfter={0.05}
          position="bottom-left"
        />
      )}
    </div>
  );
}

export const Bar: Story = { render: () => <ScrollBox variant="bar" /> };
export const Circle: Story = { render: () => <ScrollBox variant="circle" /> };
