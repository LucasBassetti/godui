import { AppShowcase } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const TALL = "https://picsum.photos/seed/godui-app/600/1300";
const SCREENS = [
  "https://picsum.photos/seed/godui-a/600/1300",
  "https://picsum.photos/seed/godui-b/600/1300",
  "https://picsum.photos/seed/godui-c/600/1300",
];

const meta = {
  title: "Layout/App Showcase",
  component: AppShowcase,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    device: "iphone",
    mode: "scroll",
    frameColor: "black",
    width: 280,
    src: TALL,
    alt: "App screen",
  },
  argTypes: {
    device: { control: "inline-radio", options: ["iphone", "android"] },
    mode: {
      control: "inline-radio",
      options: ["scroll", "loop", "carousel", "cluster"],
    },
    frameColor: {
      control: "inline-radio",
      options: ["black", "silver", "gold"],
    },
  },
  render: (args) => <AppShowcase {...args} />,
} satisfies Meta<typeof AppShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scroll: Story = {};

export const Loop: Story = {
  args: { mode: "loop" },
};

export const Carousel: Story = {
  args: { mode: "carousel", screens: SCREENS, src: undefined },
};

export const Cluster: Story = {
  args: { mode: "cluster", screens: SCREENS, src: undefined, width: 200 },
  parameters: { layout: "fullscreen" },
};

export const Android: Story = {
  args: { device: "android", mode: "loop" },
};

export const SilverFrame: Story = {
  args: { frameColor: "silver" },
};
