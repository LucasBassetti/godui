import { StoreBadge, StoreBadgeGroup } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Layout/Store Badge",
  component: StoreBadge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    store: "app-store",
    theme: "dark",
    href: "#",
    height: 56,
  },
  argTypes: {
    store: {
      control: "inline-radio",
      options: ["app-store", "google-play"],
    },
    theme: { control: "inline-radio", options: ["dark", "light"] },
  },
  render: (args) => <StoreBadge {...args} />,
} satisfies Meta<typeof StoreBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppStore: Story = {};

export const GooglePlay: Story = {
  args: { store: "google-play" },
};

export const Light: Story = {
  args: { theme: "light" },
};

const IOS = "https://apps.apple.com/app/id6761287549";
const ANDROID = "https://play.google.com/store/apps/details?id=lol.hivemind";

export const DualBadges: Story = {
  render: (args) => (
    <StoreBadgeGroup>
      <StoreBadge {...args} store="app-store" href={IOS} />
      <StoreBadge {...args} store="google-play" href={ANDROID} />
    </StoreBadgeGroup>
  ),
};

export const ScanToDownload: Story = {
  args: { qr: true },
  render: (args) => (
    <div className="flex min-h-[300px] items-end justify-center">
      <StoreBadgeGroup>
        <StoreBadge {...args} store="app-store" href={IOS} />
        <StoreBadge {...args} store="google-play" href={ANDROID} />
      </StoreBadgeGroup>
    </div>
  ),
};
