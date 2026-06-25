import { AvatarGroup } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const avatars = [
  { src: "https://i.pravatar.cc/80?img=1", alt: "Ada" },
  { src: "https://i.pravatar.cc/80?img=2", alt: "Carl" },
  { src: "https://i.pravatar.cc/80?img=3", alt: "Eve" },
  { src: "https://i.pravatar.cc/80?img=4", alt: "Gus" },
  { src: "https://i.pravatar.cc/80?img=5", alt: "Ivy" },
  { src: "https://i.pravatar.cc/80?img=6", alt: "Jo" },
];

const meta = {
  title: "Layout/Avatar Group",
  component: AvatarGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { avatars },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { max: 4 } };
export const Small: Story = { args: { size: "sm", max: 4 } };
export const Large: Story = { args: { size: "lg", max: 4 } };
export const Initials: Story = {
  args: {
    max: 4,
    avatars: [
      { fallback: "AB", alt: "Ada" },
      { fallback: "CD", alt: "Carl" },
      { fallback: "EF", alt: "Eve" },
      { fallback: "GH", alt: "Gus" },
      { fallback: "IJ", alt: "Ivy" },
    ],
  },
};
