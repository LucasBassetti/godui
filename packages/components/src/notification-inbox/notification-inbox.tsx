"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { initials, presenceColor } from "../lib/presence";

export type Notification = {
  id: string;
  actor: string;
  avatar?: string;
  /** What happened, e.g. "assigned you to". */
  action: string;
  /** The subject, e.g. "Fix the auth redirect". */
  target?: string;
  time: string;
  read?: boolean;
  /** Bucket label, e.g. "Today", "Yesterday". */
  group?: string;
  icon?: React.ReactNode;
};

export type NotificationInboxProps = React.HTMLAttributes<HTMLDivElement> & {
  notifications: Notification[];
  onRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  onMarkAllRead?: () => void;
  title?: string;
};

function groupNotifications(items: Notification[]): [string, Notification[]][] {
  const order: string[] = [];
  const map = new Map<string, Notification[]>();
  for (const item of items) {
    const key = item.group ?? "Earlier";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)?.push(item);
  }
  return order.map((key) => [key, map.get(key) as Notification[]]);
}

const NotificationInbox = React.forwardRef<
  HTMLDivElement,
  NotificationInboxProps
>(
  (
    {
      notifications,
      onRead,
      onArchive,
      onMarkAllRead,
      title = "Inbox",
      className,
      ...props
    },
    ref,
  ) => {
    const unread = notifications.filter((n) => !n.read).length;
    const groups = groupNotifications(notifications);

    return (
      <div
        ref={ref}
        data-slot="notification-inbox"
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${className ?? ""}`}
        {...props}
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <AnimatePresence>
              {unread > 0 ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums"
                >
                  {unread}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          {unread > 0 && onMarkAllRead ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent"
            >
              Mark all read
            </button>
          ) : null}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
                className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <BellIcon className="size-6" />
              </motion.div>
              <p className="text-sm font-medium text-foreground">
                You're all caught up
              </p>
              <p className="text-xs text-muted-foreground">
                No new notifications.
              </p>
            </div>
          ) : (
            groups.map(([label, items]) => (
              <div key={label}>
                <div className="sticky top-0 z-base bg-card/90 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  {label}
                </div>
                <ul>
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <NotificationRow
                        key={item.id}
                        notification={item}
                        onRead={onRead}
                        onArchive={onArchive}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    );
  },
);
NotificationInbox.displayName = "NotificationInbox";

function NotificationRow({
  notification,
  onRead,
  onArchive,
}: {
  notification: Notification;
  onRead?: (id: string) => void;
  onArchive?: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const color = presenceColor(notification.actor);

  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, x: -80 }}
      transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.9 }}
      className="relative overflow-hidden"
    >
      {/* Archive affordance revealed while swiping */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-gradient-to-l from-destructive/15 to-transparent pr-4 text-xs font-medium text-destructive">
        Archive
      </div>
      <motion.div
        drag={reduce ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.7, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) onArchive?.(notification.id);
        }}
        whileDrag={{ cursor: "grabbing" }}
        className="relative flex cursor-grab items-start gap-3 bg-card px-4 py-3 active:cursor-grabbing"
      >
        <button
          type="button"
          onClick={() => onRead?.(notification.id)}
          className="flex flex-1 items-start gap-3 text-left"
        >
          <span className="relative mt-0.5 size-8 shrink-0">
            <span
              className="flex size-full items-center justify-center overflow-hidden rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: color }}
            >
              {notification.avatar ? (
                <img
                  src={notification.avatar}
                  alt={notification.actor}
                  className="size-full object-cover"
                />
              ) : (
                initials(notification.actor)
              )}
            </span>
            {notification.icon ? (
              <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-background text-muted-foreground ring-2 ring-card">
                {notification.icon}
              </span>
            ) : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-sm leading-snug text-foreground">
              <span className="font-medium">{notification.actor}</span>{" "}
              <span className="text-muted-foreground">
                {notification.action}
              </span>{" "}
              {notification.target ? (
                <span className="font-medium">{notification.target}</span>
              ) : null}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground tabular-nums">
              {notification.time}
            </span>
          </span>
        </button>
        {!notification.read ? (
          <span className="mt-2 size-2 shrink-0 rounded-full bg-primary">
            <span className="sr-only">Unread</span>
          </span>
        ) : null}
      </motion.div>
    </motion.li>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.268 21a2 2 0 0 0 3.464 0M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </svg>
  );
}

export { NotificationInbox };
