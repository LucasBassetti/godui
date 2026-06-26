"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";

export type Reaction = {
  emoji: string;
  count: number;
  /** Whether the current user has reacted. */
  reacted?: boolean;
  /** Names of reactors, shown in the hover title. */
  users?: string[];
};

export type ReactionsProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onToggle"
> & {
  reactions: Reaction[];
  /** Fired when a reaction pill is toggled. */
  onToggle?: (emoji: string) => void;
  /** Emoji offered in the picker. Picker hidden when empty/undefined. */
  options?: string[];
  /** Fired when a new emoji is chosen from the picker. */
  onAdd?: (emoji: string) => void;
};

const DEFAULT_OPTIONS = ["👍", "❤️", "🎉", "🚀", "😂", "👀", "🔥", "🙌"];
const PARTICLES = [0, 1, 2, 3, 4, 5];

const Reactions = React.forwardRef<HTMLDivElement, ReactionsProps>(
  (
    {
      reactions,
      onToggle,
      options = DEFAULT_OPTIONS,
      onAdd,
      className,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const [pickerOpen, setPickerOpen] = React.useState(false);
    const [burst, setBurst] = React.useState<string | null>(null);

    const toggle = (reaction: Reaction) => {
      if (!reaction.reacted && !reduce) {
        setBurst(reaction.emoji);
        setTimeout(() => setBurst(null), 600);
      }
      onToggle?.(reaction.emoji);
    };

    return (
      <div
        ref={ref}
        data-slot="reactions"
        className={`flex flex-wrap items-center gap-1.5 ${className ?? ""}`}
        {...props}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {reactions.map((reaction) => (
            <motion.button
              key={reaction.emoji}
              type="button"
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 500, damping: 26 }}
              onClick={() => toggle(reaction)}
              aria-pressed={reaction.reacted}
              title={reaction.users?.join(", ")}
              className={`relative inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm transition-colors ${
                reaction.reacted
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              <span className="leading-none">{reaction.emoji}</span>
              <span className="text-xs font-medium tabular-nums">
                {reaction.count}
              </span>
              {burst === reaction.emoji ? (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {PARTICLES.map((i) => {
                    const angle = (i / PARTICLES.length) * Math.PI * 2;
                    return (
                      <motion.span
                        key={i}
                        className="absolute text-xs"
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                        animate={{
                          opacity: 0,
                          x: Math.cos(angle) * 22,
                          y: Math.sin(angle) * 22,
                          scale: 1,
                        }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                      >
                        {reaction.emoji}
                      </motion.span>
                    );
                  })}
                </span>
              ) : null}
            </motion.button>
          ))}
        </AnimatePresence>

        {options.length > 0 ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setPickerOpen((o) => !o)}
              onBlur={() => setTimeout(() => setPickerOpen(false), 150)}
              aria-label="Add reaction"
              aria-expanded={pickerOpen}
              className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <SmileIcon className="size-4" />
            </button>
            <AnimatePresence>
              {pickerOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  className="absolute bottom-full left-0 z-popover mb-2 grid origin-bottom grid-cols-4 gap-0.5 rounded-xl border border-border bg-popover p-1.5 shadow-xl"
                >
                  {options.map((emoji, i) => (
                    <motion.button
                      key={emoji}
                      type="button"
                      initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduce ? 0 : i * 0.025 }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onAdd?.(emoji);
                        setPickerOpen(false);
                      }}
                      className="flex size-8 items-center justify-center rounded-lg text-lg transition-transform hover:scale-125 hover:bg-accent"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    );
  },
);
Reactions.displayName = "Reactions";

function SmileIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
    </svg>
  );
}

export { Reactions };
