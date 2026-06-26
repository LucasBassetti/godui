import { type Notification, NotificationInbox } from "@godui/components";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta = {
  title: "Collaboration/NotificationInbox",
  component: NotificationInbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { notifications: [] },
} satisfies Meta<typeof NotificationInbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const seed: Notification[] = [
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

export const Default: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(seed);
      return (
        <div className="mx-auto max-w-sm">
          <NotificationInbox
            notifications={items}
            onRead={(id) =>
              setItems((p) =>
                p.map((n) => (n.id === id ? { ...n, read: true } : n)),
              )
            }
            onArchive={(id) => setItems((p) => p.filter((n) => n.id !== id))}
            onMarkAllRead={() =>
              setItems((p) => p.map((n) => ({ ...n, read: true })))
            }
          />
        </div>
      );
    }
    return <Demo />;
  },
};

export const Empty: Story = {
  render: () => (
    <div className="mx-auto max-w-sm">
      <NotificationInbox notifications={[]} />
    </div>
  ),
};
