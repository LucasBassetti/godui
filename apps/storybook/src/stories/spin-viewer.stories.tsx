import { SpinViewer, type SpinViewerProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { makeCubeFrames } from "./spin-viewer-frames";

const FRAMES = makeCubeFrames(48);

const meta = {
  title: "Layout/Spin Viewer",
  component: SpinViewer,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    frames: FRAMES,
    autoRotate: true,
    autoRotateSpeed: 12,
    sensitivity: 6,
    reverse: false,
    hint: true,
  } satisfies SpinViewerProps,
  argTypes: {
    autoRotate: { control: "boolean" },
    autoRotateSpeed: { control: { type: "range", min: 2, max: 40, step: 1 } },
    sensitivity: { control: { type: "range", min: 2, max: 20, step: 1 } },
    reverse: { control: "boolean" },
    hint: { control: "boolean" },
    frames: { table: { disable: true } },
  },
  render: (args) => <SpinViewer {...args} className="size-64" />,
} satisfies Meta<typeof SpinViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DragOnly: Story = {
  args: { autoRotate: false },
};

export const NoHint: Story = {
  args: { hint: false },
};
