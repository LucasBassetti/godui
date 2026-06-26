import { Drawer } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { hidden, select, text } from "../playground/argtypes";

const meta = {
  title: "Overlays/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    side: select(["bottom", "right"], "Appearance"),
    title: text("Content"),
    open: hidden(),
    onOpenChange: hidden(),
    children: hidden(),
  },
  args: {
    side: "right",
    title: "Filters",
    open: false,
    onOpenChange: () => {},
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
        >
          Filters
        </button>
        <Drawer {...args} open={open} onOpenChange={setOpen}>
          <div className="space-y-5">
            <div>
              <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Category
              </div>
              <div className="flex flex-wrap gap-2">
                {["Audio", "Wearables", "Desk", "Mobile"].map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-border px-3 py-1 text-sm text-foreground"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Price
              </div>
              <input type="range" className="w-full accent-[var(--primary)]" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Show results
          </button>
        </Drawer>
      </>
    );
  },
};
