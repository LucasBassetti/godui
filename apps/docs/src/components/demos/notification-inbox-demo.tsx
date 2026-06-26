"use client";

import { type Notification, NotificationInbox } from "@godui/components";
import { GitPullRequest, MessageCircle, UserPlus } from "lucide-react";
import { useState } from "react";

const SEED: Notification[] = [
  {
    id: "1",
    actor: "Ana Reyes",
    action: "assigned you to",
    target: "Fix auth redirect",
    time: "2m",
    group: "Today",
    icon: <UserPlus className="size-2.5" />,
  },
  {
    id: "2",
    actor: "Marco Bell",
    action: "mentioned you in",
    target: "Design review",
    time: "18m",
    group: "Today",
    icon: <MessageCircle className="size-2.5" />,
  },
  {
    id: "3",
    actor: "Priya Nair",
    action: "approved",
    target: "PR #482",
    time: "1h",
    read: true,
    group: "Today",
    icon: <GitPullRequest className="size-2.5" />,
  },
  {
    id: "4",
    actor: "Jules Kim",
    action: "commented on",
    target: "Onboarding flow",
    time: "Yesterday",
    read: true,
    group: "Earlier",
    icon: <MessageCircle className="size-2.5" />,
  },
  {
    id: "5",
    actor: "Sam Diaz",
    action: "requested review on",
    target: "PR #470",
    time: "2d",
    read: true,
    group: "Earlier",
    icon: <GitPullRequest className="size-2.5" />,
  },
];

export function NotificationInboxDemo() {
  const [items, setItems] = useState(SEED);

  return (
    <div className="mx-auto w-full max-w-sm">
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
      <p className="mt-2 px-1 text-xs text-muted-foreground">
        Swipe a row left to archive. Click to mark as read.
      </p>
    </div>
  );
}
