"use client";

// GodUI Menubar — mirrors shadcn/ui new-york-v4 components/ui/menubar.tsx (registry snapshot 2026-10-01).
// Motion: each menu and sub-menu grows from its trigger and drifts out of it on a spring (godui-popover-*);
// hopping between menus exits the old one while the new one enters. Check and radio indicators pop in from 50% — only when toggled, never when the menu opens. GPU-only.
// Additive: an exiting MenubarContent or MenubarSubContent (data-state=closed) ignores outside focus/presses, so it can't dismiss the next menu.

import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import { Menubar as MenubarPrimitive } from "radix-ui";
import * as React from "react";
import { useAnimateOnChange } from "@/hooks/use-animate-on-change";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { cn } from "@/lib/utils";

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        "flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />;
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />;
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />;
}

/** The radio group's value, so a radio item can tell when it became checked. */
const MenubarRadioValueContext = React.createContext<{
  value: string | undefined;
} | null>(null);

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarRadioValueContext.Provider value={{ value: props.value }}>
      <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
    </MenubarRadioValueContext.Provider>
  );
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ref,
  onInteractOutside,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const composedRef = useMergedRef(contentRef, ref);
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        ref={composedRef}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        onInteractOutside={(event) => {
          onInteractOutside?.(event);
          // Hopping: this menu stays mounted while it animates out, so focus
          // landing in (or a press on) the next menu would count as "outside"
          // and close the whole menubar. A menu that is already closing never
          // dismisses anything.
          if (contentRef.current?.dataset.state === "closed") {
            event.preventDefault();
          }
        }}
        className={cn(
          "z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:[--godui-enter-y:-0.25rem] data-[side=left]:[--godui-enter-x:0.25rem] data-[side=right]:[--godui-enter-x:-0.25rem] data-[side=top]:[--godui-enter-y:0.25rem] data-[state=open]:animate-godui-popover-in data-[state=closed]:animate-godui-popover-out",
          className,
        )}
        {...props}
      />
    </MenubarPortal>
  );
}

function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        className,
      )}
      {...props}
    />
  );
}

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  const animate = useAnimateOnChange(checked);
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-animate={animate || undefined}
      className={cn(
        "group/menubar-checkbox-item relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator className="[--godui-enter-scale:0.5] group-data-[animate=true]/menubar-checkbox-item:data-[state=checked]:animate-godui-fade-scale-in group-data-[animate=true]/menubar-checkbox-item:data-[state=indeterminate]:animate-godui-fade-scale-in">
          <CheckIcon className="size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  );
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  const group = React.useContext(MenubarRadioValueContext);
  const animate = useAnimateOnChange(
    group ? group.value === props.value : undefined,
  );
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      data-animate={animate || undefined}
      className={cn(
        "group/menubar-radio-item relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator className="[--godui-enter-scale:0.5] group-data-[animate=true]/menubar-radio-item:data-[state=checked]:animate-godui-fade-scale-in">
          <CircleIcon className="size-2 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  );
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />;
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-[inset]:pl-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto h-4 w-4" />
    </MenubarPrimitive.SubTrigger>
  );
}

function MenubarSubContent({
  className,
  ref,
  onInteractOutside,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const composedRef = useMergedRef(contentRef, ref);
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      ref={composedRef}
      onInteractOutside={(event) => {
        onInteractOutside?.(event);
        // Like MenubarContent: a sub-menu that is animating out never
        // dismisses anything (focus or a press in the next one is "outside").
        if (contentRef.current?.dataset.state === "closed") {
          event.preventDefault();
        }
      }}
      className={cn(
        "z-50 min-w-[8rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[side=bottom]:[--godui-enter-y:-0.25rem] data-[side=left]:[--godui-enter-x:0.25rem] data-[side=right]:[--godui-enter-x:-0.25rem] data-[side=top]:[--godui-enter-y:0.25rem] data-[state=open]:animate-godui-popover-in data-[state=closed]:animate-godui-popover-out",
        className,
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
