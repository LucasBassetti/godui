"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type ConversationVariant = "bubbles" | "document" | "compact";
export type MessageRole = "user" | "assistant" | "system";

type ThreadContextValue = { variant: ConversationVariant };
const ThreadContext = React.createContext<ThreadContextValue>({
  variant: "bubbles",
});

export type ConversationThreadProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: ConversationVariant;
  /** Auto-stick to the newest message unless the user scrolls up. */
  autoScroll?: boolean;
};

const THREAD_BASE =
  "relative flex h-full flex-col gap-4 overflow-y-auto scroll-smooth px-4 py-4";

const ConversationThread = React.forwardRef<
  HTMLDivElement,
  ConversationThreadProps
>(
  (
    { variant = "bubbles", autoScroll = true, className, children, ...props },
    forwardedRef,
  ) => {
    const ref = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(
      forwardedRef,
      () => ref.current as HTMLDivElement,
    );
    const [pinned, setPinned] = React.useState(true);

    const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
      const el = ref.current;
      if (!el) return;
      if (typeof el.scrollTo === "function") {
        el.scrollTo({ top: el.scrollHeight, behavior });
      } else {
        el.scrollTop = el.scrollHeight;
      }
    }, []);

    // Stick to the bottom while pinned and content grows.
    const childCount = React.Children.count(children);
    // biome-ignore lint/correctness/useExhaustiveDependencies: re-pin when a message is added
    React.useEffect(() => {
      if (autoScroll && pinned) scrollToBottom("smooth");
    }, [childCount, autoScroll, pinned, scrollToBottom]);

    return (
      <ThreadContext.Provider value={{ variant }}>
        <div
          ref={ref}
          data-slot="conversation-thread"
          data-variant={variant}
          className={`${THREAD_BASE} ${className ?? ""}`}
          onScroll={(e) => {
            const el = e.currentTarget;
            const atBottom =
              el.scrollHeight - el.scrollTop - el.clientHeight < 48;
            setPinned(atBottom);
          }}
          {...props}
        >
          {children}
          <AnimatePresence>
            {!pinned ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                onClick={() => {
                  setPinned(true);
                  scrollToBottom("smooth");
                }}
                className="sticky bottom-2 left-1/2 z-raised inline-flex -translate-x-1/2 items-center gap-1.5 self-center rounded-full border border-border bg-popover px-3 py-1.5 text-xs font-medium text-foreground shadow-lg"
              >
                Jump to latest
                <ArrowDownIcon className="size-3.5" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </ThreadContext.Provider>
    );
  },
);
ConversationThread.displayName = "ConversationThread";

export type MessageAction = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export type ConversationMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  role: MessageRole;
  name?: string;
  avatar?: React.ReactNode;
  timestamp?: string;
  /** Hover actions (copy, regenerate, …) revealed on hover. */
  actions?: MessageAction[];
  /** Shows a blinking caret at the end while tokens stream in. */
  streaming?: boolean;
};

const BUBBLE_BY_ROLE: Record<MessageRole, string> = {
  user: "bg-primary text-primary-foreground",
  assistant: "bg-muted text-foreground",
  system: "bg-transparent text-muted-foreground italic",
};

const ConversationMessage = React.forwardRef<
  HTMLDivElement,
  ConversationMessageProps
>(
  (
    {
      role,
      name,
      avatar,
      timestamp,
      actions,
      streaming = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { variant } = React.useContext(ThreadContext);
    const reduce = useReducedMotion();
    const isUser = role === "user";
    const isDocument = variant === "document";
    const isCompact = variant === "compact";

    return (
      <motion.div
        ref={ref}
        layout={!reduce}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        data-slot="conversation-message"
        data-role={role}
        className={`group/msg flex gap-3 ${isUser && !isDocument ? "flex-row-reverse" : ""} ${isCompact ? "gap-2" : ""} ${className ?? ""}`}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {avatar ? (
          <div className="mt-0.5 size-7 shrink-0 overflow-hidden rounded-full bg-muted text-xs">
            {avatar}
          </div>
        ) : null}
        <div
          className={`flex min-w-0 flex-col gap-1 ${isUser && !isDocument ? "items-end" : "items-start"} ${isDocument ? "w-full" : "max-w-[80%]"}`}
        >
          {(name || timestamp) && !isCompact ? (
            <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
              {name ? (
                <span className="font-medium text-foreground">{name}</span>
              ) : null}
              {timestamp ? (
                <span className="tabular-nums">{timestamp}</span>
              ) : null}
            </div>
          ) : null}
          <div
            className={
              isDocument
                ? "w-full text-sm leading-7 text-foreground"
                : `rounded-2xl px-3.5 py-2 text-sm leading-6 shadow-2xs ${BUBBLE_BY_ROLE[role]} ${isUser ? "rounded-br-md" : "rounded-bl-md"}`
            }
          >
            <span className="[overflow-wrap:anywhere] whitespace-pre-wrap">
              {children}
              {streaming ? (
                <span className="ml-0.5 inline-block h-[1.05em] w-[2px] -translate-y-px animate-pulse bg-current align-middle motion-reduce:animate-none" />
              ) : null}
            </span>
          </div>
          {actions && actions.length > 0 ? (
            <div
              className={`flex gap-0.5 px-1 opacity-0 transition-opacity group-hover/msg:opacity-100 ${isUser && !isDocument ? "flex-row-reverse" : ""}`}
            >
              {actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  aria-label={action.label}
                  onClick={action.onClick}
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {action.icon}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  },
);
ConversationMessage.displayName = "ConversationMessage";

export type StreamingTextProps = {
  /** Full text to reveal token-by-token. */
  text: string;
  /** Characters revealed per tick. */
  chunk?: number;
  /** Milliseconds between ticks. */
  speed?: number;
  /** Fired once the full text is revealed. */
  onDone?: () => void;
};

/**
 * Reveals `text` progressively. Honors reduced-motion by showing it instantly.
 */
function StreamingText({
  text,
  chunk = 2,
  speed = 24,
  onDone,
}: StreamingTextProps) {
  const reduce = useReducedMotion();
  const [count, setCount] = React.useState(reduce ? text.length : 0);

  React.useEffect(() => {
    if (reduce) {
      setCount(text.length);
      onDone?.();
      return;
    }
    setCount(0);
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + chunk, text.length);
      setCount(current);
      if (current >= text.length) {
        clearInterval(id);
        onDone?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, chunk, speed, reduce, onDone]);

  return <>{text.slice(0, count)}</>;
}

type IconProps = { className?: string };
function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

export { ConversationMessage, ConversationThread, StreamingText };
