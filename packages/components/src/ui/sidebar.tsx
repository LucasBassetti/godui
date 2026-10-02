"use client";

// GodUI Sidebar — mirrors shadcn/ui new-york-v4 components/ui/sidebar.tsx (registry snapshot 2026-10-01).
// Motion: no width animation. The gap and the container snap to their new
// widths and classes set each piece's new resting `translate`; what you see
// move is GPU-only, and all of it is one FLIP clock (WAAPI on the wrapper's
// spring and --godui-duration-base), so a reversal mid-way restarts every piece
// from where it's drawn and nothing parts:
// - offcanvas: the whole panel slides out/in;
// - icon: a `sidebar-surface` layer (the panel's background and border) slides
//   its edge to the icon rail while the box behind it has already snapped. The
//   floating card is cut in three (left cap, a middle that scales on x, right
//   cap that slides) so its corners, border and shadow never stretch;
// - the content beside the sidebar glides with the panel's edge. The wrapper
//   clips x overflow so the gliding content never adds a scrollbar, and lifts
//   that content above the panel while it moves, so labels that snap in before
//   the edge arrives are uncovered by the edge instead of drawn over the page;
// - inside the panel, rows that the icon layout moves (group labels sliding
//   up, the header button shrinking) glide there too; labels fade.
// Mobile is GodUI's Sheet. Reduced motion: everything snaps.

import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeftIcon } from "lucide-react";
import { Slot } from "radix-ui";
import * as React from "react";
import { flushSync } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { useMergedRef } from "@/hooks/use-merged-ref";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

/** What moves beside the sidebar: everything after it in the wrapper. */
const CONTENT_SELECTOR = ':scope > [data-slot="sidebar"] ~ *';
/**
 * What the icon layout moves inside the panel: group labels (they slide up
 * under the row above) and menu buttons (rows below a label or a shrinking
 * header button rise).
 */
const ROWS_SELECTOR =
  '[data-sidebar="group-label"], [data-sidebar="menu-button"]';

/**
 * A large button's padding snaps to 0 in icon mode, so its leading icon moves
 * 8px inside it: track the icon, glide the button. Moving the box (not the
 * icon inside it) keeps the icon from being clipped by the snapped box.
 */
function trackRow(el: HTMLElement): Element {
  return el.dataset.size === "lg" ? (el.firstElementChild ?? el) : el;
}

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * What moves in the panel when it collapses, for one sidebar in the wrapper.
 * Offcanvas: the whole container. Icon: the surface (the floating card's far
 * cap); on the right, the box grows leftwards, so the inner glides with the
 * surface's edge instead of jumping with the box's.
 */
function panelSelector(
  side: "left" | "right",
  variant: "sidebar" | "floating" | "inset",
  collapsible: "offcanvas" | "icon" | "none",
): string {
  const panel = `[data-slot="sidebar"][data-side="${side}"] > [data-slot="sidebar-container"]`;
  if (collapsible === "offcanvas") return panel;
  if (collapsible !== "icon") return ":not(*)";
  const surface = `${panel} > [data-slot="sidebar-surface"]`;
  const edge = variant === "floating" ? `${surface} > :last-child` : surface;
  return side === "right"
    ? `${edge}, ${panel} > [data-slot="sidebar-inner"]`
    : edge;
}

/** Running stretches of floating cards' middles. */
const STRETCHES = new WeakMap<Element, Animation>();

/**
 * The floating card's middle scales on x (0 in icon mode, from its outer
 * edge) while its far cap glides with the panel's FLIP: same frame, clock and
 * spring, from what's drawn, so the middle's end stays under the cap.
 */
function useFloatingStretch(
  innerRef: React.RefObject<HTMLElement | null>,
  state: "expanded" | "collapsed",
  active: boolean,
) {
  const last = React.useRef(state);
  useIsoLayoutEffect(() => {
    const before = last.current;
    last.current = state;
    const middle = innerRef.current?.parentElement?.querySelector<HTMLElement>(
      ':scope > [data-slot="sidebar-surface"] > :nth-child(2)',
    );
    const wrapper = innerRef.current?.closest<HTMLElement>(
      '[data-slot="sidebar-wrapper"]',
    );
    const view = middle?.ownerDocument.defaultView;
    if (!active || before === state || !middle || !wrapper || !view) return;
    if (typeof middle.animate !== "function") return;
    const running = STRETCHES.get(middle);
    const to = state === "collapsed" ? 0 : 1;
    let from = 1 - to;
    if (running) {
      from = Number.parseFloat(view.getComputedStyle(middle).scale) || 0;
      running.cancel();
      STRETCHES.delete(middle);
    }
    if (view.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const style = view.getComputedStyle(wrapper);
    const animation = middle.animate(
      [{ scale: `${from} 1` }, { scale: `${to} 1` }],
      {
        duration: toMs(style.getPropertyValue("--godui-duration-base")),
        easing: style.transitionTimingFunction,
      },
    );
    STRETCHES.set(middle, animation);
    animation.onfinish = () => {
      if (STRETCHES.get(middle) === animation) STRETCHES.delete(middle);
    };
  }, [innerRef, state, active]);
}

/** A CSS time (`260ms`, `0.3s`) in milliseconds; 260 when unset or invalid. */
function toMs(value: string | undefined, fallback = 260): number {
  const n = Number.parseFloat(value ?? "");
  if (!Number.isFinite(n)) return fallback;
  return /\ds\s*$/.test(value ?? "") ? n * 1000 : n;
}

/**
 * How far into its run an animation can be and still count as started by
 * this move: the effect that reads them runs in the same task as the toggle,
 * or a frame or so later for a non-discrete update.
 */
const FRESH_MS = 100;

/**
 * Which way the sidebar is moving (null at rest and on first paint). Set in
 * the same render as the new state, so CSS keyed on it applies in the commit
 * that snaps the layout. Cleared when the move's last animation in the
 * wrapper ends (the glides, or a sub-menu's fade-in, which is keyed on this
 * flag), so the clear lands in the frame the motion ends and cuts nothing —
 * or, if one never ends (paused), one `--godui-duration-slow` after the
 * longest of them should have.
 */
function useMoving(
  ref: React.RefObject<HTMLElement | null>,
  state: "expanded" | "collapsed",
) {
  const [last, setLast] = React.useState(state);
  const [moving, setMoving] = React.useState<"expanding" | "collapsing" | null>(
    null,
  );
  if (last !== state) {
    setLast(state);
    setMoving(state === "expanded" ? "expanding" : "collapsing");
  }
  React.useEffect(() => {
    const wrapper = ref.current;
    const view = wrapper?.ownerDocument.defaultView;
    if (!moving || !wrapper || !view) return;
    let live = true;
    // Committed synchronously, in the frame the motion ends: the wrapper's
    // clip and the lift go with the glides' own last layout, not a frame later.
    const clear = () => {
      if (live) flushSync(() => setMoving(null));
    };
    // The animations this move started: the glides (created in the layout
    // effect before this one) and a sub-menu's fade-in (started by the flag).
    // They're fresh — still at their start. One already running in the page
    // content (a long entrance) isn't the sidebar's to wait for, and a looping
    // one (a skeleton's shimmer) never ends.
    const started = (wrapper.getAnimations?.({ subtree: true }) ?? []).flatMap(
      (animation) => {
        const timing = animation.effect?.getComputedTiming();
        const end = Number(timing?.endTime ?? Number.NaN);
        if (!Number.isFinite(end)) return [];
        if (Number(animation.currentTime ?? 0) > FRESH_MS) return [];
        const rate = animation.playbackRate;
        const left = end - Number(timing?.localTime ?? 0);
        return [{ animation, remaining: rate > 0 ? left / rate : left }];
      },
    );
    const running = started.map(({ animation }) => animation);
    const token = (name: string, fallback: number) =>
      toMs(view.getComputedStyle(wrapper).getPropertyValue(name), fallback);
    let timer: number | undefined;
    if (running.length > 0) {
      // Settled, not fulfilled: one cancelled along the way (a reversal, a
      // row re-glided by a Collapsible) still lets the flag clear. After a
      // reversal the new run owns the flag (`live`).
      Promise.allSettled(running.map((animation) => animation.finished)).then(
        clear,
      );
      // A paused animation (your CSS, a stalled tab) must not hold the clip
      // and lift: give up one slow token after the longest one should have
      // ended. Read off the animations themselves, so a retuned (or slowed)
      // clock still runs to its end.
      const remaining = Math.max(...started.map((run) => run.remaining));
      timer = view.setTimeout(
        clear,
        remaining + token("--godui-duration-slow", 380),
      );
    } else {
      timer = view.setTimeout(clear, token("--godui-duration-base", 260));
    }
    return () => {
      live = false;
      if (timer !== undefined) view.clearTimeout(timer);
    };
  }, [ref, moving]);
  return moving;
}

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      // biome-ignore lint/suspicious/noDocumentCookie: shadcn persists the state in a cookie.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen]);

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? "expanded" : "collapsed";

  // The content beside the sidebar keeps its old position for one frame and
  // glides to the new one on the panel's spring and clock (read off this
  // wrapper's `ease-spring-smooth` and `--godui-duration-base`).
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  useFlipGroup(wrapperRef, state, { selector: CONTENT_SELECTOR });
  const moving = useMoving(wrapperRef, state);
  const setWrapperRef = useMergedRef(wrapperRef, ref);

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          ref={setWrapperRef}
          data-slot="sidebar-wrapper"
          data-moving={moving ?? undefined}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar",
            // While it glides, the content is drawn past the right edge: clip
            // x then (only then, so wide content still scrolls the page at
            // rest) rather than flash a scrollbar. It's also lifted above the
            // panel; z-20 deliberately pairs with shadcn's own z-10 container.
            "ease-spring-smooth data-moving:overflow-x-clip [&[data-moving]>[data-slot=sidebar]~*]:z-20",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/**
 * The panel's background and border, drawn behind its content. Offcanvas, it
 * rides along with the container. In icon mode it slides its edge to the rail
 * (the box behind it has already snapped). The floating card is a left cap, a
 * middle that scales on x (from its left) and a right cap that slides, so the
 * rounded corners, border and shadow are never stretched; the middle's right
 * edge and the cap's left edge move by the same amount every frame.
 */
function SidebarSurface({
  side,
  variant,
}: {
  side: "left" | "right";
  variant: "sidebar" | "floating" | "inset";
}) {
  if (variant !== "floating") {
    return (
      <div
        data-slot="sidebar-surface"
        className={cn(
          // -z-10: behind the inner, inside the container's own (z-10)
          // stacking context.
          "pointer-events-none absolute inset-y-0 -z-10 w-(--sidebar-width) bg-sidebar group-data-[side=left]:left-0 group-data-[side=right]:right-0",
          "group-data-[collapsible=icon]:group-data-[side=left]:-translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon))] group-data-[collapsible=icon]:group-data-[side=right]:translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon))]",
          "group-data-[variant=sidebar]:group-data-[side=left]:border-r group-data-[variant=sidebar]:group-data-[side=right]:border-l",
        )}
      />
    );
  }

  const piece =
    "absolute inset-y-0 border-y border-sidebar-border bg-sidebar shadow-sm";
  return (
    <div
      data-slot="sidebar-surface"
      className="pointer-events-none absolute inset-y-2 -z-10 w-[calc(var(--sidebar-width)-(--spacing(4)))] group-data-[side=left]:left-2 group-data-[side=right]:right-2"
    >
      {/* The collapsed card minus its right cap; never moves. */}
      <div
        className={cn(
          piece,
          "w-[calc(var(--sidebar-width-icon)+2px-(--spacing(4)))]",
          side === "left"
            ? "left-0 rounded-l-lg border-l [clip-path:inset(-1rem_0_-1rem_-1rem)]"
            : "right-0 rounded-r-lg border-r [clip-path:inset(-1rem_-1rem_-1rem_0)]",
        )}
      />
      {/* The stretch between; 2px longer than the gap so no seam opens. */}
      <div
        className={cn(
          piece,
          "[clip-path:inset(-1rem_0)] group-data-[collapsible=icon]:scale-x-0",
          side === "left"
            ? "right-[calc(--spacing(4)-2px)] left-[calc(var(--sidebar-width-icon)+2px-(--spacing(4)))] origin-left"
            : "right-[calc(var(--sidebar-width-icon)+2px-(--spacing(4)))] left-[calc(--spacing(4)-2px)] origin-right",
        )}
      />
      {/* The far edge with its corners; slides with the middle's end. */}
      <div
        className={cn(
          piece,
          "w-4",
          side === "left"
            ? "right-0 rounded-r-lg border-r [clip-path:inset(-1rem_-1rem_-1rem_0)] group-data-[collapsible=icon]:-translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon)-(--spacing(4))-2px)]"
            : "left-0 rounded-l-lg border-l [clip-path:inset(-1rem_0_-1rem_-1rem)] group-data-[collapsible=icon]:translate-x-[calc(var(--sidebar-width)-var(--sidebar-width-icon)-(--spacing(4))-2px)]",
        )}
      />
    </div>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
  // Rows the icon layout moves glide there on the panel's clock (measured in
  // the inner, so a move of the whole panel doesn't count).
  const innerRef = React.useRef<HTMLDivElement | null>(null);
  useFlipGroup(innerRef, state, {
    selector: ROWS_SELECTOR,
    measure: trackRow,
  });
  // The panel's moving pieces glide to their new rest (set by classes) with
  // the same FLIP, clock and spring as the content beside the sidebar, all
  // measured against the wrapper (it doesn't move). Reversed mid-way, every
  // piece restarts from where it's drawn, so edge and content never part.
  const frameRef = React.useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    frameRef.current =
      innerRef.current?.closest<HTMLElement>('[data-slot="sidebar-wrapper"]') ??
      null;
  });
  useFlipGroup(frameRef, state, {
    selector: panelSelector(side, variant, collapsible),
  });
  useFloatingStretch(
    innerRef,
    state,
    variant === "floating" && collapsible === "icon",
  );

  if (collapsible === "none") {
    return (
      <div
        ref={ref}
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        ref={ref}
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex",
          side === "left" ? "left-0" : "right-0",
          "group-data-[collapsible=offcanvas]:group-data-[side=left]:-translate-x-full group-data-[collapsible=offcanvas]:group-data-[side=right]:translate-x-full",
          // Sub-menus hidden in icon mode come back as the panel expands: the
          // rows below glide down to make room first, then they fade in (no
          // text drawn over a passing row).
          collapsible === "icon" &&
            "in-data-[moving=expanding]:[&_[data-sidebar=menu-sub]]:animate-godui-fade-in in-data-[moving=expanding]:[&_[data-sidebar=menu-sub]]:[--godui-duration-base:var(--godui-duration-fast)] in-data-[moving=expanding]:[&_[data-sidebar=menu-sub]]:[animation-delay:var(--godui-duration-fast)] motion-reduce:[&_[data-sidebar=menu-sub]]:animate-none",
          // Adjust the padding for floating and inset variants.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : // The border is drawn by the surface; a clear one keeps shadcn's box.
              "border-transparent group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <SidebarSurface side={side} variant={variant} />
        <div
          ref={innerRef}
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          // Transparent: the surface behind it is the background. The floating
          // card's border moved to the surface; a clear one keeps the inset.
          className="flex h-full w-full flex-col ease-spring-smooth group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-transparent"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("size-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-[translate] duration-(--godui-duration-base) ease-spring-smooth group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border motion-reduce:transition-none sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        // Lifted above a floating panel while it moves, it also covers the
        // gutter beside the card, where labels snapped in at full width would
        // otherwise peek out before the card's edge reaches them.
        "md:peer-data-[variant=floating]:in-data-[moving]:before:absolute md:peer-data-[variant=floating]:in-data-[moving]:before:inset-y-0 md:peer-data-[variant=floating]:in-data-[moving]:before:right-full md:peer-data-[variant=floating]:in-data-[moving]:before:w-1.5 md:peer-data-[variant=floating]:in-data-[moving]:before:bg-inherit",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        // The margin snaps; the label (and the rows under it) glide up with
        // the panel's FLIP while it fades.
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[opacity] duration-(--godui-duration-fast) ease-linear focus-visible:ring-2 motion-reduce:transition-none [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  // Width, height and padding snap to the icon layout; the button glides to
  // its new row with the panel's FLIP.
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        // Coming back from icon mode it fades in (see the Sidebar container).
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
