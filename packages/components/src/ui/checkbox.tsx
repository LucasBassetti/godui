"use client";

// GodUI Checkbox — mirrors shadcn/ui new-york-v4 components/ui/checkbox.tsx (registry snapshot 2026-10-01).
// Motion: when checked, the box pops (scale dips and springs back) and the
// check wipes in from the left inside a clipped indicator (translate). Both
// run only after a change — a pre-checked box never animates on first paint.
// Fill and border snap. GPU-only.

import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  // Animate only state changes, not the initial render. User toggles flip it
  // in onCheckedChange; controlled changes are caught during render.
  const [animate, setAnimate] = React.useState(false);
  const [lastChecked, setLastChecked] = React.useState(checked);
  if (checked !== lastChecked) {
    setLastChecked(checked);
    setAnimate(true);
  }

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-animate={animate || undefined}
      checked={checked}
      onCheckedChange={(value) => {
        setAnimate(true);
        onCheckedChange?.(value);
      }}
      className={cn(
        "peer group/checkbox size-4 shrink-0 rounded-[4px] border border-input shadow-xs outline-none [--godui-pop-scale:0.85] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[animate=true]:data-[state=checked]:animate-godui-pop data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center overflow-hidden text-current"
      >
        {/* The check slides in from its own left edge inside the clipped
            indicator, so it reads as being drawn left to right. */}
        <span className="flex [--godui-duration-slow:var(--godui-duration-base)] group-data-[animate=true]/checkbox:[--godui-enter-distance:100%] group-data-[animate=true]/checkbox:animate-godui-slide-in-from-left">
          <CheckIcon className="size-3.5" />
        </span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
