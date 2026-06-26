import { type Notification, NotificationInbox } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { action, hidden, text } from "../playground/argtypes";
import { centered } from "../playground/stage";

const notifications: Notification[] = [
  {
    id: "1",
    actor: "Ana Reyes",
    action: "assigned you to",
    target: "Fix auth redirect",
    time: "2m",
    group: "Today",
  },
  {
    id: "2",
    actor: "Marco Bell",
    action: "mentioned you in",
    target: "Design review",
    time: "18m",
    group: "Today",
  },
  {
    id: "3",
    actor: "Priya Nair",
    action: "approved",
    target: "PR #482",
    time: "1h",
    read: true,
    group: "Today",
  },
  {
    id: "4",
    actor: "Jules Kim",
    action: "commented on",
    target: "Onboarding flow",
    time: "Yesterday",
    read: true,
    group: "Earlier",
  },
  {
    id: "5",
    actor: "Sam Diaz",
    action: "requested review on",
    target: "PR #470",
    time: "2d",
    read: true,
    group: "Earlier",
  },
];

const meta = {
  title: "Collaboration/NotificationInbox",
  component: NotificationInbox,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [centered(384)],
  argTypes: {
    title: text("Content"),
    notifications: hidden(),
    onRead: action("read"),
    onArchive: action("archive"),
    onMarkAllRead: action("markAllRead"),
  },
  args: {
    title: "Inbox",
    notifications,
    onRead: fn(),
    onArchive: fn(),
    onMarkAllRead: fn(),
  },
} satisfies Meta<typeof NotificationInbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
