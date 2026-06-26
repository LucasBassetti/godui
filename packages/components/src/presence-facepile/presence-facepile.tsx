"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { initials, presenceColor } from "../lib/presence";

export type PresenceStatus = "active" | "idle" | "typing" | "offline";

export type PresenceUser = {
  id: string;
  name: string;
  avatar?: string;
  status?: PresenceStatus;
  color?: string;
};

export type PresenceFacepileProps = React.HTMLAttributes<HTMLDivElement> & {
  users: PresenceUser[];
  /** Max avatars before collapsing into a +N chip. */
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Show a status ring around each avatar. */
  showStatus?: boolean;
};

const SIZE: Record<NonNullable<PresenceFacepileProps["size"]>, string> = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
};

const STATUS_COLOR: Record<PresenceStatus, string> = {
  active: "oklch(0.72 0.16 145)",
  idle: "oklch(0.75 0.15 75)",
  typing: "var(--primary)",
  offline: "oklch(0.6 0 0)",
};

function Avatar({
  user,
  sizeClass,
  showStatus,
}: {
  user: PresenceUser;
  sizeClass: string;
  showStatus: boolean;
}) {
  const color = user.color ?? presenceColor(user.id);
  const status = user.status ?? "active";
  return (
    <span className="relative inline-block">
      <span
        className={`flex ${sizeClass} items-center justify-center overflow-hidden rounded-full font-semibold text-white ring-2 ring-background`}
        style={{ backgroundColor: color }}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="size-full object-cover"
          />
        ) : (
          initials(user.name)
        )}
      </span>
      {showStatus ? (
        status === "typing" ? (
          <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-px rounded-full bg-background px-0.5 py-1 shadow-sm">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1 rounded-full bg-primary motion-safe:animate-bounce"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </span>
        ) : (
          <span
            className="absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background"
            style={{ backgroundColor: STATUS_COLOR[status] }}
          />
        )
      ) : null}
    </span>
  );
}

const PresenceFacepile = React.forwardRef<
  HTMLDivElement,
  PresenceFacepileProps
>(
  (
    { users, max = 5, size = "md", showStatus = true, className, ...props },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const [open, setOpen] = React.useState(false);
    const visible = users.slice(0, max);
    const overflow = users.slice(max);
    const sizeClass = SIZE[size];

    return (
      <div
        ref={ref}
        data-slot="presence-facepile"
        className={`relative flex items-center ${className ?? ""}`}
        {...props}
      >
        <div className="flex items-center -space-x-2">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((user) => (
              <motion.div
                key={user.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, scale: 0.5, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 420, damping: 28 }}
                title={`${user.name}${user.status ? ` · ${user.status}` : ""}`}
                className="transition-transform hover:z-raised hover:-translate-y-0.5"
              >
                <Avatar
                  user={user}
                  sizeClass={sizeClass}
                  showStatus={showStatus}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {overflow.length > 0 ? (
            <motion.button
              type="button"
              layout={!reduce}
              onClick={() => setOpen((o) => !o)}
              aria-label={`${overflow.length} more`}
              aria-expanded={open}
              className={`relative z-raised flex ${sizeClass} items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground ring-2 ring-background transition-colors hover:bg-accent`}
            >
              +{overflow.length}
            </motion.button>
          ) : null}
        </div>

        <AnimatePresence>
          {open && overflow.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="absolute left-0 top-full z-popover mt-2 max-h-64 w-56 origin-top-left overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-xl"
            >
              {overflow.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5"
                >
                  <Avatar
                    user={user}
                    sizeClass={SIZE.sm}
                    showStatus={showStatus}
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {user.status ?? "active"}
                  </span>
                </div>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);
PresenceFacepile.displayName = "PresenceFacepile";

export { PresenceFacepile };
