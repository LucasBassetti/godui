"use client";

import * as React from "react";

export type MagicInputVariant = "primary" | "secondary";
export type MagicInputSize = "sm" | "md" | "lg";
export type MagicInputDepth = "focus" | "always";

export type MagicInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onSubmit"
> & {
  variant?: MagicInputVariant;
  size?: MagicInputSize;
  /** When the 3D depth shows: only while focused, or always */
  depth?: MagicInputDepth;
  /** Animate the 3D edge and shadow with a rainbow gradient while focused */
  rainbow?: boolean;
  /** Show a submit button with an arrow icon on the right side */
  submitButton?: boolean;
  /**
   * Called with the current value when the button is clicked or Enter is
   * pressed. Passing this also shows the button. Without it the button is
   * `type="submit"` so it submits an enclosing form.
   */
  onSubmit?: (value: string) => void;
  /** Accessible label for the submit button */
  submitLabel?: string;
};

const sizeClasses: Record<MagicInputSize, string> = {
  sm: "magic-input-front--sm",
  md: "magic-input-front--md",
  lg: "magic-input-front--lg",
};

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const MagicInput = React.forwardRef<HTMLInputElement, MagicInputProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      depth = "focus",
      rainbow = true,
      submitButton = false,
      onSubmit,
      submitLabel = "Submit",
      onKeyDown,
      disabled,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const showButton = submitButton || onSubmit != null;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (onSubmit && event.key === "Enter" && !event.defaultPrevented) {
        onSubmit(event.currentTarget.value);
      }
    };

    const handleSubmitClick = () => {
      onSubmit?.(innerRef.current?.value ?? "");
    };

    return (
      <div
        data-variant={variant}
        data-depth={depth}
        data-rainbow={rainbow ? "true" : undefined}
        data-submit={showButton ? "true" : undefined}
        className={`magic-input ${className ?? ""}`}
      >
        <span className="magic-input-shadow" aria-hidden="true" />
        <span className="magic-input-edge" aria-hidden="true" />
        <input
          ref={innerRef}
          className={`magic-input-front ${sizeClasses[size]}`}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {showButton ? (
          <button
            type={onSubmit ? "button" : "submit"}
            className="magic-input-submit"
            aria-label={submitLabel}
            disabled={disabled}
            onClick={onSubmit ? handleSubmitClick : undefined}
          >
            <ArrowIcon />
          </button>
        ) : null}
      </div>
    );
  },
);
MagicInput.displayName = "MagicInput";

export { MagicInput };
