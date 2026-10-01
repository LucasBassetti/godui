"use client";

// GodUI Toggle Group — mirrors shadcn/ui new-york-v4 components/ui/toggle-group.tsx (registry snapshot 2026-10-01).
// Motion: items press on a spring (from Toggle). With type="single", one
// indicator slides to the pressed item (FLIP via useActiveIndicator); with
// type="multiple", each item keeps its own on background. Adds a
// `toggle-group-indicator` span for single groups. GPU-only.

import type { VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";
import { toggleVariants } from "@/components/ui/toggle";

import { useActiveIndicator } from "@/hooks/use-active-indicator";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
  }) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  // A single-select group behaves like a segmented control: one indicator
  // slides to the pressed item. Multiple selection has no single target.
  const single = props.type === "single" && !props.asChild;
  useActiveIndicator(rootRef, indicatorRef, {
    active: '[data-slot="toggle-group-item"][data-state="on"]',
    items: '[data-slot="toggle-group-item"]',
    enabled: single,
  });

  return (
    <ToggleGroupPrimitive.Root
      ref={setRootRef}
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      style={{ "--gap": spacing } as React.CSSProperties}
      className={cn(
        "group/toggle-group relative flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-[spacing=default]:data-[variant=outline]:shadow-xs",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing }}>
        {single ? (
          // Hidden until measured, so the first paint keeps shadcn's styling.
          <span
            ref={indicatorRef}
            data-slot="toggle-group-indicator"
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 hidden origin-top-left rounded-md bg-accent ease-spring-snappy group-data-[indicator=ready]/toggle-group:block"
          />
        ) : null}
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "relative w-auto min-w-0 shrink-0 px-3 focus:z-10 focus-visible:z-10",
        "data-[spacing=0]:rounded-none data-[spacing=0]:shadow-none data-[spacing=0]:first:rounded-l-md data-[spacing=0]:last:rounded-r-md data-[spacing=0]:data-[variant=outline]:border-l-0 data-[spacing=0]:data-[variant=outline]:first:border-l",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
