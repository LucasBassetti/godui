"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import * as React from "react";
import { createPortal } from "react-dom";

type MorphingDialogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  layoutId: string;
  reduceMotion: boolean;
};

const MorphingDialogContext =
  React.createContext<MorphingDialogContextValue | null>(null);

function useMorphingDialog() {
  const ctx = React.useContext(MorphingDialogContext);
  if (!ctx) {
    throw new Error(
      "MorphingDialog components must be used within <MorphingDialog>.",
    );
  }
  return ctx;
}

// Underdamped so the card settles into the modal with a soft, premium overshoot.
const MORPH_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 32,
  mass: 0.9,
};

export type MorphingDialogProps = {
  children: React.ReactNode;
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  /** Notified whenever the open state changes. */
  onOpenChange?: (open: boolean) => void;
};

/**
 * Provider that wires a trigger and content together with a shared `layoutId`
 * so the trigger physically morphs into the modal and back.
 */
function MorphingDialog({ children, open, onOpenChange }: MorphingDialogProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const layoutId = React.useId();
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isOpen = open ?? uncontrolled;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  const value = React.useMemo<MorphingDialogContextValue>(
    () => ({
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      layoutId: `morphing-dialog-${layoutId}`,
      reduceMotion,
    }),
    [isOpen, setOpen, layoutId, reduceMotion],
  );

  return (
    <MorphingDialogContext.Provider value={value}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

export type MorphingDialogTriggerProps = React.HTMLAttributes<HTMLDivElement>;

/** The collapsed card. Click (or Enter/Space) morphs it open. */
const MorphingDialogTrigger = React.forwardRef<
  HTMLDivElement,
  MorphingDialogTriggerProps
>(({ className, children, onClick, onKeyDown, ...props }, ref) => {
  const { open, layoutId, isOpen } = useMorphingDialog();
  return (
    <motion.div
      ref={ref}
      data-slot="morphing-dialog-trigger"
      layoutId={layoutId}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onClick={(e) => {
        onClick?.(e);
        open();
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      className={`cursor-pointer ${className ?? ""}`}
      {...(props as React.ComponentProps<typeof motion.div>)}
    >
      {children}
    </motion.div>
  );
});
MorphingDialogTrigger.displayName = "MorphingDialogTrigger";

export type MorphingDialogContentProps = React.HTMLAttributes<HTMLDivElement>;

/** The expanded modal. Mounts in a portal and morphs from the trigger. */
const MorphingDialogContent = React.forwardRef<
  HTMLDivElement,
  MorphingDialogContentProps
>(({ className, children, ...props }, ref) => {
  const { isOpen, close, layoutId, reduceMotion } = useMorphingDialog();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-modal grid place-items-center p-4">
          <motion.button
            type="button"
            aria-label="Dismiss dialog"
            data-slot="morphing-dialog-backdrop"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            ref={ref}
            data-slot="morphing-dialog-content"
            role="dialog"
            aria-modal="true"
            layoutId={layoutId}
            transition={reduceMotion ? { duration: 0 } : MORPH_SPRING}
            className={`relative z-raised overflow-hidden bg-card text-card-foreground shadow-2xl ${className ?? ""}`}
            {...(props as React.ComponentProps<typeof motion.div>)}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
});
MorphingDialogContent.displayName = "MorphingDialogContent";

export type MorphingDialogCloseProps =
  React.ButtonHTMLAttributes<HTMLButtonElement>;

/** A button that closes the dialog. Renders a default ✕ when given no children. */
const MorphingDialogClose = React.forwardRef<
  HTMLButtonElement,
  MorphingDialogCloseProps
>(({ className, children, onClick, ...props }, ref) => {
  const { close } = useMorphingDialog();
  return (
    <motion.button
      ref={ref}
      type="button"
      data-slot="morphing-dialog-close"
      aria-label="Close dialog"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.1 }}
      onClick={(e) => {
        onClick?.(e);
        close();
      }}
      className={`absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-background/70 text-foreground/70 [transition:background_150ms_ease,color_150ms_ease] hover:bg-background hover:text-foreground ${className ?? ""}`}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {children ?? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      )}
    </motion.button>
  );
});
MorphingDialogClose.displayName = "MorphingDialogClose";

export {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContent,
  MorphingDialogTrigger,
};
