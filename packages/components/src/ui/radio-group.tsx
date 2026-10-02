"use client";

// GodUI Radio Group — mirrors shadcn/ui new-york-v4 components/ui/radio-group.tsx (registry snapshot 2026-10-01).
// Motion: items press on a spring (scale); the selected dot grows in from 30%
// (godui-fade-scale-in) — only after the selection changes, never on first
// paint. GPU-only.

import { CircleIcon } from "lucide-react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";
import { useAnimateOnChange } from "@/hooks/use-animate-on-change";
import { cn } from "@/lib/utils";

/**
 * The group's current value, so an item can tell when it became checked.
 * `null` outside a GodUI RadioGroup: items there never pop.
 */
const RadioGroupValueContext = React.createContext<{
  value: string | null | undefined;
} | null>(null);

function RadioGroup({
  className,
  value,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  // Mirrors Radix's own controllable state (controlled when `value` is not
  // undefined) so items see uncontrolled selections too.
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const current = value !== undefined ? value : uncontrolled;
  return (
    <RadioGroupValueContext.Provider value={{ value: current }}>
      <RadioGroupPrimitive.Root
        data-slot="radio-group"
        className={cn("grid gap-3", className)}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          setUncontrolled(next);
          onValueChange?.(next);
        }}
        {...props}
      />
    </RadioGroupValueContext.Provider>
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  // Pop the dot only after this item's checked state changes (a click, arrow
  // key or controlled change) — a pre-selected item never animates on first
  // paint or remount. Same rule as Checkbox.
  const group = React.useContext(RadioGroupValueContext);
  const animate = useAnimateOnChange(
    group ? group.value === props.value : undefined,
  );

  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      data-animate={animate || undefined}
      className={cn(
        "group/radio-group-item aspect-square size-4 shrink-0 rounded-full border border-input text-primary shadow-xs outline-none transition-[scale] duration-(--godui-duration-base) ease-spring-bouncy active:scale-[0.9] motion-reduce:transition-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center [--godui-enter-scale:0.3] group-data-[animate=true]/radio-group-item:data-[state=checked]:animate-godui-fade-scale-in"
      >
        <CircleIcon className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 fill-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
