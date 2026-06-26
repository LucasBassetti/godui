import { TabBar, type TabBarTab } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";

const icon = (d: string) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const tabs: TabBarTab[] = [
  {
    value: "home",
    label: "Home",
    icon: icon(
      "M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    ),
  },
  {
    value: "search",
    label: "Search",
    icon: icon("M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"),
  },
  {
    value: "alerts",
    label: "Alerts",
    icon: icon("M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"),
    badge: 5,
  },
  {
    value: "profile",
    label: "Profile",
    icon: icon("M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"),
  },
];

const meta = {
  title: "Navigation/Tab Bar",
  component: TabBar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { tabs, defaultValue: "home" },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AllLabels: Story = { args: { labelsOnActiveOnly: false } };
