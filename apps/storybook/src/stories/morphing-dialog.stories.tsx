import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Overlays/Morphing Dialog",
  component: MorphingDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { children: null },
} satisfies Meta<typeof MorphingDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <MorphingDialog>
      <MorphingDialogTrigger className="w-64 rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="h-28 rounded-xl bg-gradient-to-br from-chart-1 to-chart-3" />
        <div className="mt-3 font-semibold">Aurora Sessions</div>
        <div className="text-sm text-muted-foreground">Tap to expand</div>
      </MorphingDialogTrigger>

      <MorphingDialogContent className="w-[min(92vw,28rem)] rounded-2xl">
        <div className="h-44 bg-gradient-to-br from-chart-1 to-chart-3" />
        <div className="p-5">
          <div className="text-lg font-semibold">Aurora Sessions</div>
          <p className="mt-2 text-sm text-muted-foreground">
            A shared <code>layoutId</code> morphs the card into this modal and
            springs it back on close. Press Escape or click the backdrop to
            dismiss.
          </p>
        </div>
        <MorphingDialogClose />
      </MorphingDialogContent>
    </MorphingDialog>
  ),
};
