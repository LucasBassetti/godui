"use client";

import { type Notification, NotificationInbox } from "@godui/components";
import { GitPullRequest, MessageCircle, UserPlus } from "lucide-react";
import { useState } from "react";

/**
 * Closing "here's the finished thing" panel — the real, stateful
 * NotificationInbox. Drag a row left past the threshold to archive it,
 * click a row to mark it read, or clear everything with "Mark all read".
 */
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
];

export function NotificationInboxResult() {
  const [items, setItems] = useState(SEED);

  return (
    <div className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card">
      <div className="flex items-center gap-2.5 border-b border-fd-border px-2.5 py-2">
        <span className="inline-flex h-8 items-center rounded-[10px] border border-fd-border bg-[var(--muted)] px-3 font-medium text-[13px] text-[var(--foreground)]">
          Result
        </span>
        <span className="font-mono text-fd-muted-foreground text-xs">
          the real component — drag a row, or mark all read
        </span>
      </div>
      <div className="flex min-h-[280px] items-center justify-center p-10">
        <NotificationInbox
          notifications={items}
          onRead={(id) =>
            setItems((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            )
          }
          onArchive={(id) =>
            setItems((prev) => prev.filter((n) => n.id !== id))
          }
          onMarkAllRead={() =>
            setItems((prev) => prev.map((n) => ({ ...n, read: true })))
          }
          className="max-w-sm"
        />
      </div>
    </div>
  );
}
