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

// Input size + padding. With a submit button the right padding grows to clear
// it. Two static records (the scanner can't see interpolated class names).
const frontSize: Record<MagicInputSize, string> = {
  sm: "py-[var(--button-py-sm)] pl-[var(--button-px-sm)] pr-[var(--button-px-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "py-[var(--button-py-md)] pl-[var(--button-px-md)] pr-[var(--button-px-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "py-[var(--button-py-lg)] pl-[var(--button-px-lg)] pr-[var(--button-px-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

const frontSizeWithButton: Record<MagicInputSize, string> = {
  sm: "py-[var(--button-py-sm)] pl-[var(--button-px-sm)] pr-[2.5rem] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "py-[var(--button-py-md)] pl-[var(--button-px-md)] pr-[3rem] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "py-[var(--button-py-lg)] pl-[var(--button-px-lg)] pr-[3.75rem] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
};

// Full literal (no interpolation): Tailwind's scanner can't resolve a `${var}`
// nested inside an arbitrary value, so the rainbow fill must be written out.
const RAINBOW_FOCUS_FILL =
  "group-focus-within:[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] group-focus-within:[background-size:200%_100%] group-focus-within:animate-magic-rainbow motion-reduce:group-focus-within:animate-none";

const edgeVariant: Record<MagicInputVariant, string> = {
  primary:
    "[background:linear-gradient(to_left,color-mix(in_srgb,var(--primary)_50%,black)_0%,color-mix(in_srgb,var(--primary)_75%,black)_8%,color-mix(in_srgb,var(--primary)_75%,black)_92%,color-mix(in_srgb,var(--primary)_50%,black)_100%)]",
  secondary:
    "[background:linear-gradient(to_left,color-mix(in_srgb,var(--secondary)_50%,black)_0%,color-mix(in_srgb,var(--secondary)_75%,black)_8%,color-mix(in_srgb,var(--secondary)_75%,black)_92%,color-mix(in_srgb,var(--secondary)_50%,black)_100%)]",
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
    className="animate-magic-input-spin [transform-origin:center] motion-reduce:animate-none"
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

    const hasStatus = !isIdle;
    const isSuccess = status === "success";

    // Edge + shadow double as the progress bar while a status is active. The
    // fill colour (--magic-fill) and the position/size/animation depend on the
    // sub-status; all of it is render-known, so it's resolved here.
    const magicFill = isSuccess
      ? "oklch(0.65 0.17 150)"
      : status === "error"
        ? "var(--destructive)"
        : "var(--primary)";

    const statusFill =
      isLoading && isDeterminate
        ? "[background-position:right_center] [background-size:var(--magic-progress,0%)_100%]"
        : isLoading
          ? "[background-image:linear-gradient(90deg,transparent,var(--magic-fill),transparent)] [background-position:right_center] [background-size:45%_100%] animate-magic-input-indeterminate"
          : "[background-color:var(--primary)] [background-position:left_center] [background-size:100%_100%] animate-magic-input-sweep";

    let shadowClass: string;
    let edgeClass: string;
    if (disabled) {
      shadowClass = "hidden";
      edgeClass = "hidden";
    } else if (hasStatus) {
      const fillTransition = armed
        ? "[transition:background-size_250ms_ease]"
        : "[transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1),opacity_250ms_ease]";
      shadowClass = `absolute inset-0 rounded-xl translate-y-[6px] opacity-75 blur-[12px] [background-color:transparent] [background-image:linear-gradient(90deg,var(--magic-fill),var(--magic-fill))] bg-no-repeat [will-change:translate] motion-reduce:[transition:none] motion-reduce:animate-none ${fillTransition} ${statusFill}`;
      const edgeTransition = armed
        ? "[transition:background-size_250ms_ease]"
        : "[transition:opacity_250ms_ease]";
      edgeClass = `absolute inset-0 rounded-xl opacity-100 [background-color:color-mix(in_srgb,var(--foreground)_14%,transparent)] [background-image:linear-gradient(90deg,var(--magic-fill),var(--magic-fill))] bg-no-repeat motion-reduce:[transition:none] motion-reduce:animate-none ${edgeTransition} ${statusFill}`;
    } else {
      // Idle: depth controls the resting 3D; focus-within reveals/deepens it;
      // rainbow swaps the edge + shadow fill while focused.
      const shadowDepth =
        depth === "always"
          ? "opacity-100 translate-y-[4px] group-focus-within:translate-y-[6px]"
          : "opacity-0 translate-y-0 group-focus-within:translate-y-[4px]";
      const shadowFocusOpacity =
        rainbow || depth === "always" ? "" : "group-focus-within:opacity-100";
      const shadowRainbow = rainbow
        ? `${RAINBOW_FOCUS_FILL} group-focus-within:blur-[12px] group-focus-within:opacity-70`
        : "";
      shadowClass = `absolute inset-0 rounded-xl bg-[hsl(0deg_0%_0%_/_0.25)] blur-[4px] [will-change:translate] [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1),opacity_250ms_ease] motion-reduce:[transition:none] motion-reduce:[animation:none] ${shadowDepth} ${shadowFocusOpacity} ${shadowRainbow}`;

      const edgeOpacity =
        depth === "always"
          ? "opacity-100"
          : "opacity-0 group-focus-within:opacity-100";
      const edgeRainbow = rainbow ? RAINBOW_FOCUS_FILL : "";
      edgeClass = `absolute inset-0 rounded-xl [transition:opacity_250ms_ease] motion-reduce:[transition:none] motion-reduce:[animation:none] ${edgeOpacity} ${edgeVariant[variant]} ${edgeRainbow}`;
    }

    const frontTransform = disabled
      ? "translate-y-0"
      : hasStatus
        ? "-translate-y-[4px]"
        : depth === "always"
          ? "-translate-y-[4px] group-focus-within:-translate-y-[6px] group-focus-within:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]"
          : "translate-y-0 group-focus-within:-translate-y-[4px] group-focus-within:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]";
    const frontText =
      isLoading || isSuccess
        ? "[color:color-mix(in_srgb,var(--foreground)_45%,transparent)] placeholder:[color:color-mix(in_srgb,var(--muted-foreground)_55%,transparent)]"
        : "text-foreground placeholder:text-muted-foreground";
    const frontClass = `relative block w-full box-border rounded-xl border border-border bg-background outline-none [font:inherit] [will-change:translate] [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1)] motion-reduce:[transition:none] group-focus-within:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${frontText} ${frontTransform} ${(showButton ? frontSizeWithButton : frontSize)[size]}`;

    const submitColor = isSuccess
      ? "[background:oklch(0.65_0.17_150)] text-[oklch(1_0_0)]"
      : status === "error"
        ? "[background:var(--destructive)] text-[oklch(1_0_0)]"
        : "bg-primary text-primary-foreground";
    const submitTransform = hasStatus
      ? "-translate-y-[4px]"
      : depth === "always"
        ? "-translate-y-[4px] group-focus-within:-translate-y-[6px] group-focus-within:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]"
        : "translate-y-0 group-focus-within:-translate-y-[4px] group-focus-within:[transition:translate_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]";
    const submitClass = `absolute top-[6px] right-[6px] bottom-[6px] z-[1] inline-flex aspect-square cursor-pointer items-center justify-center rounded-[calc(var(--radius-xl)-6px)] border-none p-0 text-[1.125rem] leading-none [transition:translate_600ms_cubic-bezier(0.3,0.7,0.4,1),filter_200ms_ease] [-webkit-tap-highlight-color:transparent] hover:brightness-110 active:brightness-95 focus-visible:[outline:2px_solid_var(--ring)] focus-visible:[outline-offset:2px] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:[transition:none] ${submitColor} ${submitTransform}`;

    // Morphing icons: all four stacked, the active one cross-fades + scales in.
    const ICON_BASE =
      "absolute inset-0 grid place-items-center [transition:opacity_220ms_ease,transform_220ms_cubic-bezier(0.3,0.7,0.4,1.4)] motion-reduce:[transition:none]";
    const iconClass = (active: boolean) =>
      active
        ? `${ICON_BASE} opacity-100 [transform:scale(1)_rotate(0deg)]`
        : `${ICON_BASE} opacity-0 [transform:scale(0.4)_rotate(-35deg)]`;

    return (
      <div
        data-slot="magic-input"
        data-variant={variant}
        data-depth={depth}
        data-rainbow={rainbow ? "true" : undefined}
        data-submit={showButton ? "true" : undefined}
        data-status={isIdle ? undefined : status}
        data-determinate={isDeterminate ? "true" : undefined}
        data-armed={armed ? "true" : undefined}
        className={`group relative inline-block rounded-xl [-webkit-tap-highlight-color:transparent] ${disabled ? "cursor-not-allowed" : ""} ${className ?? ""}`}
        style={
          {
            ...style,
            ...(clamped != null ? { "--magic-progress": `${clamped}%` } : {}),
            ...(hasStatus ? { "--magic-fill": magicFill } : {}),
          } as React.CSSProperties
        }
      >
        <span className={shadowClass} aria-hidden="true" />
        <span className={edgeClass} aria-hidden="true" />
        <input
          ref={innerRef}
          data-size={size}
          className={frontClass}
          disabled={disabled}
          readOnly={lock}
          aria-busy={isLoading || undefined}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {!isIdle ? (
          <span
            className="sr-only"
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
            className={submitClass}
            aria-label={submitLabel}
            disabled={disabled}
            onClick={onSubmit ? handleSubmitClick : undefined}
          >
            <span className={iconClass(isIdle)} data-icon="arrow" aria-hidden>
              <ArrowIcon />
            </span>
            <span className={iconClass(isLoading)} data-icon="ring" aria-hidden>
              {isLoading && !isDeterminate ? (
                <Spinner />
              ) : (
                <RingProgress value={isLoading ? (clamped as number) : 0} />
              )}
            </span>
            <span
              className={iconClass(isSuccess)}
              data-icon="check"
              aria-hidden
            >
              <CheckIcon />
            </span>
            <span
              className={iconClass(status === "error")}
              data-icon="x"
              aria-hidden
            >
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
