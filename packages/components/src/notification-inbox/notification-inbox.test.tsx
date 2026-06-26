import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NotificationInbox } from "./notification-inbox";

const notifications = [
  {
    id: "n1",
    actor: "Ana Reyes",
    action: "assigned you to",
    target: "Fix auth redirect",
    time: "2m",
    group: "Today",
  },
  {
    id: "n2",
    actor: "Marco Bell",
    action: "mentioned you in",
    target: "Design review",
    time: "1h",
    read: true,
    group: "Today",
  },
];

describe("NotificationInbox", () => {
  it("forwards ref to the container", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<NotificationInbox ref={ref} notifications={notifications} />);
    expect(ref.current?.getAttribute("data-slot")).toBe("notification-inbox");
  });

  it("shows the unread count", () => {
    render(<NotificationInbox notifications={notifications} />);
    // one unread (n1)
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders group headers and rows", () => {
    render(<NotificationInbox notifications={notifications} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Fix auth redirect")).toBeInTheDocument();
  });

  it("fires onMarkAllRead", () => {
    const onMarkAllRead = vi.fn();
    render(
      <NotificationInbox
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />,
    );
    fireEvent.click(screen.getByText("Mark all read"));
    expect(onMarkAllRead).toHaveBeenCalled();
  });

  it("renders an empty state when there are no notifications", () => {
    render(<NotificationInbox notifications={[]} />);
    expect(screen.getByText("You're all caught up")).toBeInTheDocument();
  });
});
