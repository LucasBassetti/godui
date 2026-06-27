import { ImageTrail, type ImageTrailProps } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { range } from "../playground/argtypes";

const IMAGES = [
  "https://picsum.photos/id/1015/400/400",
  "https://picsum.photos/id/1025/400/400",
  "https://picsum.photos/id/1039/400/400",
  "https://picsum.photos/id/1043/400/400",
  "https://picsum.photos/id/1056/400/400",
  "https://picsum.photos/id/1062/400/400",
];

const meta = {
  title: "Effects/ImageTrail",
  component: ImageTrail,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    threshold: range(20, 160, 4, "Behavior"),
    duration: range(300, 1600, 50, "Behavior"),
    max: range(4, 24, 1, "Behavior"),
    size: range(80, 280, 10, "Appearance"),
  },
  args: { images: IMAGES, threshold: 64, duration: 750, max: 12, size: 180 },
  render: (args: ImageTrailProps) => (
    <ImageTrail
      {...args}
      className="grid h-[80vh] w-full place-items-center bg-background"
    >
      <div className="pointer-events-none text-center">
        <h2 className="text-3xl font-semibold text-foreground">
          Move your cursor
        </h2>
        <p className="mt-2 text-muted-foreground">
          Images trail the pointer and drift away.
        </p>
      </div>
    </ImageTrail>
  ),
} satisfies Meta<typeof ImageTrail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
