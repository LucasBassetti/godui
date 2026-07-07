import { ThreeDMarquee } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const IMAGES = [
  "1015",
  "1016",
  "1018",
  "1019",
  "1024",
  "1025",
  "1027",
  "1035",
  "1036",
  "1039",
  "1043",
  "1044",
  "1047",
  "1050",
  "1051",
  "1060",
].map((id) => `https://picsum.photos/id/${id}/400/400`);

const meta = {
  title: "Layout/Three D Marquee",
  component: ThreeDMarquee,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { images: IMAGES, columns: 4 },
  render: (args) => (
    <div className="h-[28rem] w-[40rem]">
      <ThreeDMarquee {...args} />
    </div>
  ),
} satisfies Meta<typeof ThreeDMarquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ThreeColumns: Story = {
  args: { columns: 3 },
};
