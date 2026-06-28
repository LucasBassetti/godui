"use client";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import * as React from "react";

export type OTPInputStatus = "idle" | "error" | "success";

export type OTPInputProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /** Number of code cells. */
  length?: number;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Restrict accepted characters. `numeric` (default) or `alphanumeric`. */
  type?: "numeric" | "alphanumeric";
  /** Render the entered characters as dots. */
  mask?: boolean;
  /** Validation status — `error` shakes the row, `success` settles it. */
  status?: OTPInputStatus;
  disabled?: boolean;
  autoFocus?: boolean;
  /** Called on every change with the current value. */
  onChange?: (value: string) => void;
  /** Called once the final cell is filled. */
  onComplete?: (value: string) => void;
};

const CELL_BASE =
  "relative flex size-12 items-center justify-center rounded-lg border bg-background text-lg font-medium text-foreground tabular-nums [transition:border-color_150ms_ease,box-shadow_150ms_ease,transform_150ms_ease]";

function sanitize(raw: string, type: OTPInputProps["type"], length: number) {
  const pattern = type === "alphanumeric" ? /[^a-zA-Z0-9]/g : /[^0-9]/g;
  return raw.replace(pattern, "").slice(0, length);
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  (
    {
      length = 6,
      value: valueProp,
      defaultValue = "",
      type = "numeric",
      mask = false,
      status = "idle",
      disabled = false,
      autoFocus = false,
      onChange,
      onComplete,
      className,
      ...props
    },
    ref,
  ) => {
    const reduceMotion = useReducedMotion();
    const controls = useAnimationControls();
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = React.useState(() =>
      sanitize(defaultValue, type, length),
    );
    const value = sanitize(isControlled ? valueProp : internal, type, length);
    const [focused, setFocused] = React.useState(false);

    // Error → shake the row once; consumers flip status back to idle to re-arm.
    React.useEffect(() => {
      if (status === "error" && !reduceMotion) {
        controls.start({
          x: [0, -6, 6, -4, 4, 0],
          transition: { duration: 0.4, ease: "easeInOut" },
        });
      }
    }, [status, reduceMotion, controls]);

    const commit = (next: string) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
      if (next.length === length) onComplete?.(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      commit(sanitize(e.target.value, type, length));
    };

    // The active cell is where the next character lands (or the last when full).
    const activeIndex = Math.min(value.length, length - 1);

    return (
      <motion.div
        animate={controls}
        data-status={status}
        className={`inline-flex items-center gap-2 ${className ?? ""}`}
        onClick={() => inputRef.current?.focus()}
        {...(props as React.ComponentProps<typeof motion.div>)}
      >
        {Array.from({ length }).map((_, i) => {
          const char = value[i];
          const isActive = focused && i === activeIndex && !disabled;
          const filled = char !== undefined;
          const borderState =
            status === "error"
              ? "border-destructive"
              : status === "success"
                ? "border-primary"
                : isActive
                  ? "border-ring ring-2 ring-ring/30"
                  : filled
                    ? "border-foreground/30"
                    : "border-border";
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length cell grid
              key={i}
              data-active={isActive}
              data-filled={filled}
              className={`${CELL_BASE} ${borderState} ${
                disabled ? "opacity-50" : ""
              } ${isActive ? "scale-105" : ""}`}
            >
              {filled ? (
                mask ? (
                  <span className="size-2.5 rounded-full bg-foreground" />
                ) : (
                  <motion.span
                    initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {char}
                  </motion.span>
                )
              ) : isActive ? (
                <span className="h-6 w-px animate-pulse rounded-full bg-foreground" />
              ) : null}
            </div>
          );
        })}

        <input
          ref={inputRef}
          // biome-ignore lint/a11y/noAutofocus: opt-in via prop
          autoFocus={autoFocus}
          inputMode={type === "numeric" ? "numeric" : "text"}
          autoComplete="one-time-code"
          pattern={type === "numeric" ? "[0-9]*" : "[a-zA-Z0-9]*"}
          maxLength={length}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label="One-time code"
          className="absolute size-0 opacity-0"
        />
      </motion.div>
    );
  },
);
OTPInput.displayName = "OTPInput";

export { OTPInput };
