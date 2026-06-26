import { AvatarGroup } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { hidden, range, select, toggle } from "../playground/argtypes";
import { centered } from "../playground/stage";

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
  decorators: [centered()],
  argTypes: {
    avatars: hidden(),
    max: range(1, 6, 1, "Behavior"),
    size: select(["sm", "md", "lg"], "Appearance"),
    spreadOnHover: toggle("Behavior"),
  },
  args: {
    avatars,
    max: 4,
    size: "md",
    spreadOnHover: true,
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
