import { Button, Toaster } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react";
import { toast } from "sonner";

const meta = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args, { globals }) => (
    <div className="flex min-h-96 items-start justify-center">
      <Toaster
        {...args}
        // Follow the Storybook theme toggle (no next-themes provider here).
        theme={globals.theme === "dark" ? "dark" : "light"}
      />
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        Show toast
      </Button>
    </div>
  ),
};

export const Types: Story = {
  render: (args, { globals }) => (
    <div className="flex min-h-96 flex-wrap items-start justify-center gap-2">
      <Toaster
        {...args}
        // Follow the Storybook theme toggle (no next-themes provider here).
        theme={globals.theme === "dark" ? "dark" : "light"}
      />
      <Button variant="outline" onClick={() => toast.success("Saved")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info("Heads up")}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning("Careful")}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error("Failed")}>
        Error
      </Button>
    </div>
  ),
};

/** Mixed heights, so expanding the stack changes toast heights. */
export const Stack: Story = {
  render: (args, { globals }) => (
    <div className="flex min-h-96 items-start justify-center gap-2">
      <Toaster
        {...args}
        // Follow the Storybook theme toggle (no next-themes provider here).
        theme={globals.theme === "dark" ? "dark" : "light"}
      />
      <Button
        variant="outline"
        onClick={() =>
          toast("Deployment finished", {
            description:
              "Production is live. 3 regions updated, cache warmed, and the previous build is kept for instant rollback.",
          })
        }
      >
        Tall toast
      </Button>
      <Button variant="outline" onClick={() => toast("Copied")}>
        Short toast
      </Button>
    </div>
  ),
};
