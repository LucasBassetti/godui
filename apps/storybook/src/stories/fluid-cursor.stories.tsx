import { FluidCursor } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

const meta = {
  title: "Effects/Fluid Cursor",
  component: FluidCursor,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof FluidCursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => {
    const ref = React.useRef<HTMLDivElement>(null);
    return (
      <div
        ref={ref}
        className="relative grid h-64 w-96 cursor-none place-items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card"
      >
        <p className="text-lg font-semibold">Move inside the card</p>
        <button
          type="button"
          className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
        >
          Hover me — the cursor swells
        </button>
        <FluidCursor containerRef={ref} />
      </div>
    );
  },
};
