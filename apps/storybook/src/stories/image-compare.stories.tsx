import { ImageCompare } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/Image Compare",
  component: ImageCompare,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    before: <img src="https://picsum.photos/id/1015/800/600" alt="Color" />,
    after: (
      <img
        src="https://picsum.photos/id/1015/800/600"
        alt="Black and white"
        className="grayscale"
      />
    ),
  },
  render: (args) => (
    <div style={{ width: 420, aspectRatio: "4 / 3" }}>
      <ImageCompare {...args} />
    </div>
  ),
} satisfies Meta<typeof ImageCompare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { beforeLabel: "Color", afterLabel: "B&W" },
};
export const Vertical: Story = { args: { orientation: "vertical" } };
export const StartLeft: Story = { args: { initial: 15 } };
