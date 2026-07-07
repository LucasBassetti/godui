import { HeroParallax } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const PRODUCTS = [
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
].map((id, i) => ({
  title: `Project ${i + 1}`,
  thumbnail: `https://picsum.photos/id/${id}/600/400`,
  href: "#",
}));

const meta = {
  title: "Layout/Hero Parallax",
  component: HeroParallax,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { products: PRODUCTS },
  render: (args) => <HeroParallax {...args} />,
} satisfies Meta<typeof HeroParallax>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
