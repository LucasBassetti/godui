"use client";

import canvasConfetti, {
  type Options as ConfettiOptions,
} from "canvas-confetti";
import * as React from "react";

export type { ConfettiOptions };

export type ConfettiHandle = {
  /** Fire a burst. Options override the component defaults. */
  fire: (options?: ConfettiOptions) => void;
};

export type ConfettiButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    /** Confetti options applied to the burst on click. */
    options?: ConfettiOptions;
  };

const DEFAULTS: ConfettiOptions = {
  spread: 70,
  startVelocity: 45,
  particleCount: 120,
  origin: { y: 0.7 },
};

/**
 * Imperative confetti. Hold a ref and call `ref.current.fire()` — mirrors the
 * `toast()` ergonomics already used across GodUI.
 */
const Confetti = React.forwardRef<
  ConfettiHandle,
  { options?: ConfettiOptions }
>(({ options }, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      fire: (override?: ConfettiOptions) => {
        canvasConfetti({ ...DEFAULTS, ...options, ...override });
      },
    }),
    [options],
  );
  return null;
});
Confetti.displayName = "Confetti";

/** Convenience trigger: bursts from the button's position on click. */
const ConfettiButton = React.forwardRef<HTMLButtonElement, ConfettiButtonProps>(
  ({ options, onClick, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      canvasConfetti({ ...DEFAULTS, origin: { x, y }, ...options });
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        data-slot="confetti-button"
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
ConfettiButton.displayName = "ConfettiButton";

/** Direct imperative API for non-React call sites. */
function confetti(options?: ConfettiOptions) {
  canvasConfetti({ ...DEFAULTS, ...options });
}

export { Confetti, ConfettiButton, confetti };
