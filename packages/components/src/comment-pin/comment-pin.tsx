"use client";

import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { initials, presenceColor } from "../lib/presence";

export type Comment = {
  id: string;
  author: string;
  avatar?: string;
  body: string;
  time?: string;
};

export type CommentPinProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSubmit"
> & {
  /** Horizontal position as a percentage of the container (0–100). */
  x: number;
  /** Vertical position as a percentage of the container (0–100). */
  y: number;
  /** Thread comments. */
  comments?: Comment[];
  /** Pin face label — defaults to the first author's initials, else a dot. */
  label?: React.ReactNode;
  color?: string;
  resolved?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Show a reply field and fire on submit. */
  onReply?: (text: string) => void;
};

const CommentPin = React.forwardRef<HTMLDivElement, CommentPinProps>(
  (
    {
      x,
      y,
      comments = [],
      label,
      color,
      resolved = false,
      defaultOpen = false,
      open: controlledOpen,
      onOpenChange,
      onReply,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const isControlled = controlledOpen !== undefined;
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = isControlled ? controlledOpen : internalOpen;
    const [reply, setReply] = React.useState("");

    const setOpen = (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    const pinColor = color ?? presenceColor(comments[0]?.author ?? `${x},${y}`);
    const face = label ?? (comments[0] ? initials(comments[0].author) : null);

    return (
      <div
        ref={ref}
        data-slot="comment-pin"
        data-resolved={resolved ? "" : undefined}
        data-open={open ? "" : undefined}
        className={`absolute z-raised ${className ?? ""}`}
        style={{ left: `${x}%`, top: `${y}%`, ...style }}
        {...props}
      >
        <motion.button
          type="button"
          layout
          initial={{ scale: 0 }}
          animate={{ scale: resolved ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          onClick={() => setOpen(!open)}
          aria-label={resolved ? "Resolved comment" : "Open comment thread"}
          aria-expanded={open}
          className={`flex size-7 items-center justify-center rounded-full rounded-bl-sm text-xs font-semibold text-white shadow-md ring-2 ring-background transition-[filter,opacity] ${resolved ? "opacity-60 grayscale" : ""}`}
          style={{ backgroundColor: pinColor }}
        >
          {face ?? <span className="size-1.5 rounded-full bg-white" />}
        </motion.button>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              className="absolute left-0 top-9 z-popover w-72 origin-top-left overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
            >
              <div className="flex max-h-64 flex-col gap-3 overflow-y-auto p-3">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2.5">
                      <span
                        className="mt-0.5 flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-[10px] font-semibold text-white"
                        style={{
                          backgroundColor: presenceColor(comment.author),
                        }}
                      >
                        {comment.avatar ? (
                          <img
                            src={comment.avatar}
                            alt={comment.author}
                            className="size-full object-cover"
                          />
                        ) : (
                          initials(comment.author)
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="truncate text-xs font-medium text-foreground">
                            {comment.author}
                          </span>
                          {comment.time ? (
                            <span className="shrink-0 text-[10px] text-muted-foreground">
                              {comment.time}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm leading-snug text-foreground [overflow-wrap:anywhere]">
                          {comment.body}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {onReply ? (
                <form
                  className="flex items-center gap-2 border-t border-border p-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!reply.trim()) return;
                    onReply(reply.trim());
                    setReply("");
                  }}
                >
                  <input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Reply…"
                    aria-label="Reply"
                    className="min-w-0 flex-1 rounded-lg bg-muted px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="submit"
                    disabled={!reply.trim()}
                    aria-label="Send reply"
                    className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
                  >
                    <SendIcon className="size-4" />
                  </button>
                </form>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);
CommentPin.displayName = "CommentPin";

function SendIcon({ className }: { className?: string }) {
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
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
    </svg>
  );
}

export { CommentPin };
