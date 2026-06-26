import { ToastProvider, toast } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range, select } from "../playground/argtypes";

const meta = {
  title: "Overlays/Toast",
  component: ToastProvider,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    position: select(
      ["top-left", "top-right", "bottom-left", "bottom-right"],
      "Appearance",
    ),
    duration: range(1000, 10000, 500, "Behavior"),
  },
  args: { position: "bottom-right", duration: 4000 },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            toast({ title: "Event created", description: "Friday at 5pm" })
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Show toast
        </button>
        <button
          type="button"
          onClick={() =>
            toast.success({
              title: "Saved",
              description: "Your changes are live.",
            })
          }
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground"
        >
          Success
        </button>
        <button
          type="button"
          onClick={() =>
            toast.error({
              title: "Something went wrong",
              description: "Please retry.",
            })
          }
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground"
        >
          Error
        </button>
        <button
          type="button"
          onClick={() =>
            toast({
              title: "Deleted file",
              description: "report.pdf",
              action: { label: "Undo", onClick: () => {} },
            })
          }
          className="rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground"
        >
          With action
        </button>
      </div>
      <ToastProvider {...args} />
    </>
  ),
};
