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

// Segmented bar; the selected tab lifts into the magic-button 3D. `selected`,
// `variant`, and `rainbow` are known per-render, so their styling is resolved
// in JS — `group-*` variants cover only runtime hover / focus-visible state.
const CONTAINER_CLASS =
  "inline-flex items-stretch gap-2 rounded-xl bg-muted p-2 font-medium select-none [-webkit-tap-highlight-color:transparent]";

const ITEM_BASE =
  "group relative cursor-pointer border-none bg-transparent p-0 outline-none [transition:filter_600ms] [-webkit-tap-highlight-color:transparent] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none disabled:filter-none";

const EDGE_BASE =
  "absolute inset-0 rounded-xl [transition:opacity_250ms_ease] motion-reduce:[transition:none]";

const SHADOW_BASE =
  "absolute inset-0 rounded-xl translate-y-[2px] will-change-transform [transition:transform_600ms_cubic-bezier(0.3,0.7,0.4,1),opacity_250ms_ease] motion-reduce:[transition:none]";

// Resting transform AND colors are kept out of the base: the selected state
// sets its own (`-translate-y-[4px]`, `bg-primary`, …) and a same-specificity
// resting utility (`translate-y-0`, `bg-transparent`) would win the cascade —
// leaving the selected tab flat and transparent (rainbow edge showing through).
const FRONT_BASE =
  "relative block rounded-xl will-change-transform [transition:transform_600ms_cubic-bezier(0.3,0.7,0.4,1),color_250ms_ease,background_250ms_ease] motion-reduce:[transition:none]";

const RAINBOW_FILL =
  "[background-image:linear-gradient(90deg,var(--rainbow-1),var(--rainbow-5),var(--rainbow-3),var(--rainbow-4),var(--rainbow-2))] [background-size:200%_100%] animate-magic-rainbow motion-reduce:animate-none";

const SOLID_SHADOW_FILL = "bg-[hsl(0deg_0%_0%_/_0.25)] blur-[4px]";

const edgeVariant: Record<MagicTabVariant, string> = {
  default:
    "[background:linear-gradient(to_left,color-mix(in_srgb,var(--primary)_50%,black)_0%,color-mix(in_srgb,var(--primary)_75%,black)_8%,color-mix(in_srgb,var(--primary)_75%,black)_92%,color-mix(in_srgb,var(--primary)_50%,black)_100%)]",
  secondary:
    "[background:linear-gradient(to_left,color-mix(in_srgb,var(--secondary)_50%,black)_0%,color-mix(in_srgb,var(--secondary)_75%,black)_8%,color-mix(in_srgb,var(--secondary)_75%,black)_92%,color-mix(in_srgb,var(--secondary)_50%,black)_100%)]",
};

const frontVariantSelected: Record<MagicTabVariant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
};

// Unselected hover / focus-visible previews the selected color flat (no lift).
const frontVariantPreview: Record<MagicTabVariant, string> = {
  default:
    "group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:bg-primary group-focus-visible:text-primary-foreground",
  secondary:
    "group-hover:bg-secondary group-hover:text-secondary-foreground group-focus-visible:bg-secondary group-focus-visible:text-secondary-foreground",
};

const frontSize: Record<MagicTabSize, string> = {
  sm: "px-[var(--button-px-sm)] py-[var(--button-py-sm)] text-[length:var(--button-text-sm)] leading-[var(--button-leading-sm)]",
  md: "px-[var(--button-px-md)] py-[var(--button-py-md)] text-[length:var(--button-text-md)] leading-[var(--button-leading-md)]",
  lg: "px-[var(--button-px-lg)] py-[var(--button-py-lg)] text-[length:var(--button-text-lg)] leading-[var(--button-leading-lg)]",
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
        className={`${CONTAINER_CLASS} ${className ?? ""}`}
        {...props}
      >
        {items.map((item, index) => {
          const selected = item.value === selectedValue;

          // Selected: focus-visible lifts the tab (like magic-button hover);
          // pointer hover leaves it. Unselected: hover/focus previews the color.
          const itemFilter = selected
            ? "focus-visible:brightness-110 focus-visible:[transition:filter_250ms]"
            : "hover:brightness-110 focus-visible:brightness-110 hover:[transition:filter_250ms] focus-visible:[transition:filter_250ms]";

          const shadowFill =
            selected && rainbow
              ? `${RAINBOW_FILL} blur-[12px]`
              : SOLID_SHADOW_FILL;
          const shadowOpacity = selected
            ? rainbow
              ? "opacity-70"
              : "opacity-100"
            : "opacity-0";
          const shadowLift = selected
            ? "group-focus-visible:translate-y-[4px] group-focus-visible:[transition:transform_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]"
            : "";

          const edgeFill = selected
            ? `opacity-100 ${rainbow ? RAINBOW_FILL : edgeVariant[variant]}`
            : "opacity-0";

          const frontState = selected
            ? `-translate-y-[4px] ${frontVariantSelected[variant]} group-focus-visible:-translate-y-[6px] group-focus-visible:[transition:transform_250ms_cubic-bezier(0.3,0.7,0.4,1.5)]`
            : `bg-transparent text-muted-foreground ${frontVariantPreview[variant]}`;

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
              className={`${ITEM_BASE} ${itemFilter}`}
            >
              <span
                className={`${SHADOW_BASE} ${shadowFill} ${shadowOpacity} ${shadowLift}`}
                aria-hidden="true"
              />
              <span className={`${EDGE_BASE} ${edgeFill}`} aria-hidden="true" />
              <span
                data-size={size}
                className={`${FRONT_BASE} ${frontState} ${frontSize[size]}`}
              >
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
