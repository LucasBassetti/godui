"use client";

import * as React from "react";

export type MagicInputVariant = "primary" | "secondary";
export type MagicInputSize = "sm" | "md" | "lg";
export type MagicInputDepth = "focus" | "always";
export type MagicInputStatus = "idle" | "loading" | "success" | "error";

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
  /**
   * Submit lifecycle. `loading` runs the progress bar + spinner, `success` /
   * `error` flash a green / red sweep with a check / X. Fully controlled.
   */
  status?: MagicInputStatus;
  /**
   * 0–100. With `status="loading"` a value makes the bar determinate; omitting
   * it makes the bar indeterminate (a segment that bounces end to end).
   */
  progress?: number;
};

const sizeClasses: Record<MagicInputSize, string> = {
  sm: "magic-input-front--sm",
  md: "magic-input-front--md",
  lg: "magic-input-front--lg",
};

const RING_R = 9;
const RING_C = 2 * Math.PI * RING_R;

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

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

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const RingProgress = ({ value }: { value: number }) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r={RING_R}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
      strokeWidth={2.5}
    />
    <circle
      cx="12"
      cy="12"
      r={RING_R}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeDasharray={RING_C}
      strokeDashoffset={RING_C * (1 - clampPercent(value) / 100)}
      transform="rotate(-90 12 12)"
      style={{ transition: "stroke-dashoffset 250ms ease" }}
    />
  </svg>
);

const Spinner = () => (
  <svg
    className="magic-input-spinner"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r={RING_R}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.3}
      strokeWidth={2.5}
    />
    <circle
      cx="12"
      cy="12"
      r={RING_R}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeDasharray={`${RING_C * 0.28} ${RING_C}`}
    />
  </svg>
);

const MagicInput = React.forwardRef<HTMLInputElement, MagicInputProps>(
  (
    {
      className,
      style,
      variant = "primary",
      size = "md",
      depth = "focus",
      rainbow = true,
      submitButton = false,
      onSubmit,
      submitLabel = "Submit",
      status = "idle",
      progress,
      onKeyDown,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement);

    const showButton = submitButton || onSubmit != null;
    const isIdle = status === "idle";
    const isLoading = status === "loading";
    const isDeterminate = isLoading && progress != null;
    const clamped = progress != null ? clampPercent(progress) : undefined;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (
        isIdle &&
        onSubmit &&
        event.key === "Enter" &&
        !event.defaultPrevented
      ) {
        onSubmit(event.currentTarget.value);
      }
    };

    const handleSubmitClick = () => {
      if (!isIdle) return;
      onSubmit?.(innerRef.current?.value ?? "");
    };

    // Snap the fill to 0 on entering loading, then arm the smooth transition a
    // frame later so progress animates without the entry flashing from full.
    const [armed, setArmed] = React.useState(false);
    React.useEffect(() => {
      if (!isLoading) {
        setArmed(false);
        return;
      }
      setArmed(false);
      const id = requestAnimationFrame(() => setArmed(true));
      return () => cancelAnimationFrame(id);
    }, [isLoading]);

    // Lock the field while submitting / on success, but keep it interactive-
    // looking (3D + animation stay): readOnly instead of disabled.
    const lock = readOnly || isLoading || status === "success";

    return (
      <div
        data-variant={variant}
        data-depth={depth}
        data-rainbow={rainbow ? "true" : undefined}
        data-submit={showButton ? "true" : undefined}
        data-status={isIdle ? undefined : status}
        data-determinate={isDeterminate ? "true" : undefined}
        data-armed={armed ? "true" : undefined}
        className={`magic-input ${className ?? ""}`}
        style={
          clamped != null
            ? ({
                ...style,
                "--magic-progress": `${clamped}%`,
              } as React.CSSProperties)
            : style
        }
      >
        <span className="magic-input-shadow" aria-hidden="true" />
        <span className="magic-input-edge" aria-hidden="true" />
        <input
          ref={innerRef}
          className={`magic-input-front ${sizeClasses[size]}`}
          disabled={disabled}
          readOnly={lock}
          aria-busy={isLoading || undefined}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {!isIdle ? (
          <span
            className="magic-input-sr"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={isDeterminate ? clamped : undefined}
            aria-valuetext={
              status === "success"
                ? "Success"
                : status === "error"
                  ? "Error"
                  : isDeterminate
                    ? `${clamped}%`
                    : "Loading"
            }
          />
        ) : null}
        {showButton ? (
          <button
            type={onSubmit ? "button" : "submit"}
            className="magic-input-submit"
            aria-label={submitLabel}
            disabled={disabled}
            onClick={onSubmit ? handleSubmitClick : undefined}
          >
            <span
              className="magic-input-icon"
              data-icon="arrow"
              aria-hidden="true"
            >
              <ArrowIcon />
            </span>
            <span
              className="magic-input-icon"
              data-icon="ring"
              aria-hidden="true"
            >
              {isLoading && !isDeterminate ? (
                <Spinner />
              ) : (
                <RingProgress value={isLoading ? (clamped as number) : 0} />
              )}
            </span>
            <span
              className="magic-input-icon"
              data-icon="check"
              aria-hidden="true"
            >
              <CheckIcon />
            </span>
            <span className="magic-input-icon" data-icon="x" aria-hidden="true">
              <XIcon />
            </span>
          </button>
        ) : null}
      </div>
    );
  },
);
MagicInput.displayName = "MagicInput";

export { MagicInput };
