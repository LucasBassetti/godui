"use client";

// GodUI Checkbox — mirrors shadcn/ui new-york-v4 components/ui/checkbox.tsx (registry snapshot 2026-10-01).
// Motion: checking floods the box with ink. The border snaps to the checked
// color, then a disc of the fill color grows from the center (scale) until the
// box's rounded clip squares it off: a dot that morphs into the filled box.
// The check is then drawn left to right: a clip window slides over it while
// the mark slides back by the same amount, so the stroke holds still and only
// its leading edge moves. The box dips on a spring. Unchecking drains it: the
// mark fades and the disc shrinks back to a dot. Fill and check colors come
// from the root's own (shadcn or caller) classes: the root's checked
// background isn't painted (background-clip: text, and it has no text), the
// indicator and disc inherit it. Every keyframe is gated on data-animate: it runs only after a change; a
// pre-checked box never animates on first paint. GPU-only.

import { CheckIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  onClickCapture,
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
  // Mirrors Radix's controllable state (controlled when `checked` is not
  // undefined) so the ink below knows when the box empties.
  const [uncontrolled, setUncontrolled] = React.useState(
    defaultChecked ?? false,
  );
  const on = (checked !== undefined ? checked : uncontrolled) !== false;

  // Once unchecked, the root's colors are the unchecked ones, so the draining
  // disc and fading mark would turn transparent at once. Keep the last checked
  // colors on the exiting indicator: read once checked, and again in the
  // capture phase of the click that unchecks, before Radix toggles (its
  // onCheckedChange runs after the commit, too late).
  const indicatorRef = React.useRef<HTMLSpanElement>(null);
  const ink = React.useRef<{ color: string; background: string } | null>(null);
  const readInk = React.useCallback(() => {
    const el = indicatorRef.current;
    if (!el || el.dataset.state === "unchecked") return;
    const style = getComputedStyle(el);
    ink.current = { color: style.color, background: style.backgroundColor };
  }, []);
  React.useLayoutEffect(() => {
    const el = indicatorRef.current;
    if (!el) return;
    if (on) {
      el.style.color = "";
      el.style.backgroundColor = "";
      readInk();
    } else if (ink.current) {
      el.style.color = ink.current.color;
      el.style.backgroundColor = ink.current.background;
    }
  }, [on, readInk]);

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      data-animate={animate || undefined}
      checked={checked}
      defaultChecked={defaultChecked}
      onClickCapture={(event) => {
        readInk();
        onClickCapture?.(event);
      }}
      onCheckedChange={(value) => {
        setAnimate(true);
        setUncontrolled(value);
        onCheckedChange?.(value);
      }}
      className={cn(
        // not-unchecked: the root's fill is carried by the indicator.
        "peer group/checkbox size-4 shrink-0 rounded-[4px] border border-input shadow-xs outline-none [--godui-pop-scale:0.9] not-data-[state=unchecked]:bg-clip-text focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[animate=true]:data-[state=checked]:animate-godui-pop data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary",
        className,
      )}
      {...props}
    >
      {/* Inherits the root's fill without painting it (background-clip:
          text), so the disc can inherit it in turn. It covers the border box
          (-m-px) with the root's radius and clips the disc there: clipped at
          the border's inner edge instead, the two antialias into a hairline
          seam. The hold keyframe keeps
          Presence from removing it until the ink has drained; isolate keeps
          its 1 → 0.99 opacity from adding a paint layer mid-way. */}
      <CheckboxPrimitive.Indicator
        ref={indicatorRef}
        data-slot="checkbox-indicator"
        className="isolate -m-px grid size-[calc(100%+2px)] place-items-center overflow-hidden rounded-[inherit] bg-inherit bg-clip-text text-current group-data-[animate=true]/checkbox:data-[state=unchecked]:animate-godui-checkbox-hold"
      >
        {/* The disc: a circle the box's diagonal wide (scale 1.42) at rest,
            squared off by the indicator's clip; it grows from a dot. */}
        <span className="size-full scale-[1.42] rounded-full bg-inherit [grid-area:1/1] group-data-[animate=true]/checkbox:group-data-[state=checked]/checkbox:animate-godui-checkbox-fill-in group-data-[animate=true]/checkbox:group-data-[state=unchecked]/checkbox:animate-godui-checkbox-fill-out" />
        {/* The window slides in from the left, the mark slides back: the
            stroke stays put and is uncovered left to right, the way a check
            is drawn. Spans, because Chrome won't composite translate on an
            <svg>. `relative`: the disc's scale gives it its own layer, which
            would otherwise paint over an in-flow mark at rest. */}
        <span className="relative flex overflow-hidden [grid-area:1/1] group-data-[animate=true]/checkbox:group-data-[state=checked]/checkbox:animate-godui-checkbox-draw group-data-[animate=true]/checkbox:group-data-[state=unchecked]/checkbox:animate-godui-checkbox-check-out">
          <span className="flex group-data-[animate=true]/checkbox:group-data-[state=checked]/checkbox:animate-godui-checkbox-ink">
            <CheckIcon className="size-3.5" />
          </span>
        </span>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
