"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type StepStatus = "pending" | "running" | "success" | "error";

export type AgentTimelineProps = React.HTMLAttributes<HTMLOListElement>;

const AgentTimeline = React.forwardRef<HTMLOListElement, AgentTimelineProps>(
  ({ className, children, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="agent-timeline"
      className={`flex flex-col ${className ?? ""}`}
      {...props}
    >
      {children}
    </ol>
  ),
);
AgentTimeline.displayName = "AgentTimeline";

export type AgentStepProps = Omit<
  React.HTMLAttributes<HTMLLIElement>,
  "title"
> & {
  status?: StepStatus;
  title: React.ReactNode;
  /** Optional sub-label (tool name, duration, …). */
  meta?: React.ReactNode;
  /** Collapsible body (reasoning text, tool I/O). */
  children?: React.ReactNode;
  defaultOpen?: boolean;
  /** Hide the connector below this step (use on the last item). */
  last?: boolean;
};

const STATUS_RING: Record<StepStatus, string> = {
  pending: "border-border bg-background text-muted-foreground",
  running: "border-primary bg-primary/10 text-primary",
  success: "border-primary bg-primary text-primary-foreground",
  error: "border-destructive bg-destructive text-white",
};

const CONNECTOR_FILL: Record<StepStatus, string> = {
  pending: "bg-border",
  running: "bg-gradient-to-b from-primary to-border",
  success: "bg-primary",
  error: "bg-destructive",
};

const AgentStep = React.forwardRef<HTMLLIElement, AgentStepProps>(
  (
    {
      status = "pending",
      title,
      meta,
      children,
      defaultOpen = false,
      last = false,
      className,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const [open, setOpen] = React.useState(defaultOpen);
    const hasBody = Boolean(children);

    return (
      <li
        ref={ref}
        data-slot="agent-step"
        data-status={status}
        className={`relative flex gap-3 pb-2 ${className ?? ""}`}
        {...props}
      >
        {/* Rail */}
        <div className="relative flex flex-col items-center">
          <span
            className={`relative z-raised flex size-6 shrink-0 items-center justify-center rounded-full border ${STATUS_RING[status]} transition-colors`}
          >
            {status === "running" ? (
              <span className="size-2.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
            ) : status === "success" ? (
              <CheckIcon className="size-3.5" />
            ) : status === "error" ? (
              <CloseIcon className="size-3.5" />
            ) : (
              <span className="size-1.5 rounded-full bg-current" />
            )}
            {status === "running" ? (
              <span className="absolute inset-0 animate-ping rounded-full border border-primary/50 motion-reduce:animate-none" />
            ) : null}
          </span>
          {!last ? (
            <span className="relative my-1 w-px flex-1 overflow-hidden rounded bg-border">
              <motion.span
                initial={false}
                animate={{
                  scaleY:
                    status === "success" || status === "error"
                      ? 1
                      : status === "running"
                        ? 0.5
                        : 0,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 320, damping: 32, mass: 0.9 }
                }
                className={`absolute inset-0 origin-top ${CONNECTOR_FILL[status]}`}
              />
            </span>
          ) : null}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 pb-2">
          <button
            type="button"
            disabled={!hasBody}
            aria-expanded={hasBody ? open : undefined}
            onClick={() => hasBody && setOpen((o) => !o)}
            className={`flex w-full items-center gap-2 rounded-md py-0.5 text-left ${hasBody ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
          >
            <span
              className={`truncate text-sm font-medium ${status === "error" ? "text-destructive" : "text-foreground"} ${status === "running" ? "text-muted-foreground motion-safe:animate-pulse" : ""}`}
            >
              {title}
            </span>
            {meta ? (
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {meta}
              </span>
            ) : null}
            {hasBody ? (
              <ChevronIcon
                className={`ml-auto size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
              />
            ) : null}
          </button>

          <AnimatePresence initial={false}>
            {hasBody && open ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 320, damping: 32, mass: 0.9 }
                }
                className="overflow-hidden"
              >
                <div className="mt-1.5 rounded-lg border border-border bg-muted/40 p-3 text-xs leading-5 text-muted-foreground">
                  {children}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </li>
    );
  },
);
AgentStep.displayName = "AgentStep";

type IconProps = { className?: string };
function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function CloseIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function ChevronIcon({ className }: IconProps) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export { AgentStep, AgentTimeline };
