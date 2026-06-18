"use client";

import * as React from "react";

export type MagicTabVariant = "default" | "secondary";
export type MagicTabSize = "sm" | "md" | "lg";

export type MagicTabItem = {
  /** Unique value identifying the tab */
  value: string;
  /** Visible label */
  label: React.ReactNode;
  /** Disable this tab — not selectable or focusable */
  disabled?: boolean;
};

export type MagicTabProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  /** Tabs to render in the bar */
  items: MagicTabItem[];
  /** Controlled selected value */
  value?: string;
  /** Uncontrolled initial value (defaults to the first non-disabled item) */
  defaultValue?: string;
  /** Called when the selected tab changes */
  onValueChange?: (value: string) => void;
  variant?: MagicTabVariant;
  size?: MagicTabSize;
  /** Animate the selected tab's 3D edge and shadow with a flowing rainbow gradient */
  rainbow?: boolean;
};

const sizeClasses: Record<MagicTabSize, string> = {
  sm: "magic-tab-front--sm",
  md: "magic-tab-front--md",
  lg: "magic-tab-front--lg",
};

const firstEnabled = (items: MagicTabItem[]): string | undefined =>
  items.find((item) => !item.disabled)?.value;

const MagicTab = React.forwardRef<HTMLDivElement, MagicTabProps>(
  (
    {
      className,
      items,
      value,
      defaultValue,
      onValueChange,
      variant = "default",
      size = "md",
      rainbow = true,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState<
      string | undefined
    >(() => defaultValue ?? firstEnabled(items));

    const selectedValue = isControlled ? value : internalValue;

    const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    // Roving tabindex moves focus independently of selection (manual
    // activation): arrows move focus, Enter/Space commits the selection.
    const [focusValue, setFocusValue] = React.useState<string | undefined>(
      undefined,
    );
    const rovingValue = focusValue ?? selectedValue;

    const select = (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      if (next !== selectedValue) {
        onValueChange?.(next);
      }
    };

    const moveFocus = (next: string) => {
      setFocusValue(next);
      const domIndex = items.findIndex((item) => item.value === next);
      tabRefs.current[domIndex]?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const enabled = items.filter((item) => !item.disabled);
      if (enabled.length === 0) {
        onKeyDown?.(event);
        return;
      }

      const currentIndex = Math.max(
        0,
        enabled.findIndex((item) => item.value === rovingValue),
      );

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          moveFocus(enabled[(currentIndex + 1) % enabled.length].value);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          moveFocus(
            enabled[(currentIndex - 1 + enabled.length) % enabled.length].value,
          );
          break;
        case "Home":
          event.preventDefault();
          moveFocus(enabled[0].value);
          break;
        case "End":
          event.preventDefault();
          moveFocus(enabled[enabled.length - 1].value);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (rovingValue !== undefined) {
            select(rovingValue);
          }
          break;
      }

      onKeyDown?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
      // Tabbing away resets the roving tab-stop back to the selected tab.
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setFocusValue(undefined);
      }
    };

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        data-variant={variant}
        data-rainbow={rainbow ? "true" : undefined}
        data-size={size}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`magic-tab font-medium ${className ?? ""}`}
        {...props}
      >
        {items.map((item, index) => {
          const selected = item.value === selectedValue;
          return (
            <button
              key={item.value}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              disabled={item.disabled}
              data-selected={selected ? "true" : undefined}
              tabIndex={item.value === rovingValue ? 0 : -1}
              onClick={() => {
                setFocusValue(item.value);
                select(item.value);
              }}
              className="magic-tab-item"
            >
              <span className="magic-tab-shadow" aria-hidden="true" />
              <span className="magic-tab-edge" aria-hidden="true" />
              <span className={`magic-tab-front ${sizeClasses[size]}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  },
);
MagicTab.displayName = "MagicTab";

export { MagicTab };
