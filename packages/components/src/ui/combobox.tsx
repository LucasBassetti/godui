"use client";

// GodUI Combobox — mirrors shadcn/ui new-york-v4 components/ui/combobox.tsx (registry snapshot 2026-10-01).
// Built on Base UI, as shadcn's is. Motion: the popup grows from its anchor
// and drifts out of it on a spring (godui-popover-*); the selected check pops
// in; chips pop in, and when one is removed the chips after it FLIP into
// place. The check and chips pop only when added after their container
// mounted — never on first paint or when the popup opens. GPU-only.

import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

const Combobox = ComboboxPrimitive.Root;

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />;
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <ChevronDownIcon
        data-slot="combobox-trigger-icon"
        className="pointer-events-none size-4 text-muted-foreground"
      />
    </ComboboxPrimitive.Trigger>
  );
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={<InputGroupButton variant="ghost" size="icon-xs" />}
      className={cn(className)}
      {...props}
    >
      <XIcon className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  );
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  showClear?: boolean;
}) {
  return (
    <InputGroup className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            asChild
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          className={cn(
            "group/combobox-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:[--godui-enter-y:-0.25rem] data-[side=left]:[--godui-enter-x:0.25rem] data-[side=right]:[--godui-enter-x:-0.25rem] data-[side=top]:[--godui-enter-y:0.25rem] *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-godui-popover-in data-closed:animate-godui-popover-out",
            className,
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Whether the enclosing item (or chips container) has finished mounting. An
 * indicator or chip that mounts with it is part of the first paint and stays
 * still; one that mounts later was just selected and pops.
 */
function useMountedRef() {
  const mounted = React.useRef(false);
  useIsoLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

const ComboboxItemMountedContext =
  React.createContext<React.RefObject<boolean> | null>(null);

/** The check's box; pops only when selected after its item mounted. */
function ComboboxItemIndicatorBox(props: React.ComponentProps<"span">) {
  const itemMounted = React.useContext(ComboboxItemMountedContext);
  const [animate] = React.useState(() => itemMounted?.current ?? false);
  return <span data-animate={animate || undefined} {...props} />;
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  const mounted = useMountedRef();
  return (
    <ComboboxItemMountedContext.Provider value={mounted}>
      <ComboboxPrimitive.Item
        data-slot="combobox-item"
        className={cn(
          "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className,
        )}
        {...props}
      >
        {children}
        <ComboboxPrimitive.ItemIndicator
          data-slot="combobox-item-indicator"
          render={
            <ComboboxItemIndicatorBox className="pointer-events-none absolute right-2 flex size-4 items-center justify-center [--godui-enter-scale:0.5] data-[animate=true]:animate-godui-fade-scale-in" />
          }
        >
          <CheckIcon className="pointer-events-none size-4 pointer-coarse:size-5" />
        </ComboboxPrimitive.ItemIndicator>
      </ComboboxPrimitive.Item>
    </ComboboxItemMountedContext.Provider>
  );
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  );
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground pointer-coarse:px-3 pointer-coarse:py-2 pointer-coarse:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  );
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-empty/combobox-content:flex",
        className,
      )}
      {...props}
    />
  );
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

/**
 * Lets a chip signal the chips container's FLIP when it mounts or unmounts,
 * and tell whether it was added after the container mounted.
 */
const ComboboxChipsFlipContext = React.createContext<{
  bump: () => void;
  mounted: React.RefObject<boolean>;
} | null>(null);

function ComboboxChips({
  className,
  ref,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  const chipsRef = React.useRef<HTMLDivElement | null>(null);
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);
  // When a chip is removed (or added), the chips and input after it slide
  // from where they were instead of jumping.
  useFlipGroup(chipsRef, version, {
    selector: '[data-slot="combobox-chip"], [data-slot="combobox-chip-input"]',
  });
  const mounted = useMountedRef();
  const flip = React.useMemo(() => ({ bump, mounted }), [mounted]);
  // React 19: a callback ref may return its own cleanup; pass it through.
  const setChipsRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      chipsRef.current = node;
      if (typeof ref === "function") {
        const cleanup = ref(node);
        return () => {
          chipsRef.current = null;
          if (typeof cleanup === "function") cleanup();
          else ref(null);
        };
      }
      if (ref) ref.current = node;
      return () => {
        chipsRef.current = null;
        if (ref) ref.current = null;
      };
    },
    [ref],
  );
  return (
    <ComboboxChipsFlipContext.Provider value={flip}>
      <ComboboxPrimitive.Chips
        ref={setChipsRef}
        data-slot="combobox-chips"
        className={cn(
          "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-[3px] has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
          className,
        )}
        {...props}
      />
    </ComboboxChipsFlipContext.Provider>
  );
}

/** Bumps the chips container's FLIP signal on mount and unmount. */
function ComboboxChipFlipSignal() {
  const bump = React.useContext(ComboboxChipsFlipContext)?.bump;
  useIsoLayoutEffect(() => {
    bump?.();
    return () => bump?.();
  }, [bump]);
  return null;
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean;
}) {
  // Only chips added after the container mounted pop; the initial value's
  // chips are part of the first paint.
  const chips = React.useContext(ComboboxChipsFlipContext);
  const [animate] = React.useState(() => chips?.mounted.current ?? false);
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      data-animate={animate || undefined}
      className={cn(
        "data-[animate=true]:animate-godui-fade-scale-in flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
        className,
      )}
      {...props}
    >
      <ComboboxChipFlipSignal />
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="-ml-1 opacity-50 hover:opacity-100"
          data-slot="combobox-chip-remove"
        >
          <XIcon className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}

function ComboboxChipsInput({
  className,
  children,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  );
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null);
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
};
