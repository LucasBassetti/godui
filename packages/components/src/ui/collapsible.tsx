"use client";

// GodUI Collapsible — mirrors shadcn/ui new-york-v4 components/ui/collapsible.tsx (registry snapshot 2026-10-01).
// Motion: a height animation, faked on the compositor (the Accordion's
// engine, `useReveal`). The panel's height snaps; the panel box slides down
// from under what's above it while each of its children slides up by the
// same amount, so the content holds still and only the box's clip edge
// sweeps. The content after the Collapsible (in its parent, and in the root
// after the panel) rides that edge on the same spring and clock (FLIP). On
// close the panel leaves the flow at once (absolute, where it's drawn) and
// the edge sweeps back up while the content below rises. Every piece starts
// from where it's drawn, so reversing mid-way never jumps. If a parent
// centers it, the Collapsible's parent glides to its new spot too. A panel
// whose box paints (background, border, shadow) or holds loose text can't be
// split into a box and children: it fades instead, and the content after it
// still glides. Reduced motion: fades only. GPU-only.

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { useMergedRef } from "@/hooks/use-merged-ref";
import {
  contentOf,
  flowRoom,
  leaveFlow,
  type RevealTiming,
  sweepPanel,
  useReveal,
} from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** True when the box itself paints something a sweep would drag along. */
function paints(box: HTMLElement): boolean {
  const style = box.ownerDocument.defaultView?.getComputedStyle(box);
  if (!style) return false;
  const clear = (color: string) =>
    !color ||
    color === "transparent" ||
    /^rgba\(.*,\s*0\)$/.test(color) ||
    /\/\s*0\)$/.test(color);
  const border = ["Top", "Right", "Bottom", "Left"].some(
    (side) =>
      Number.parseFloat(
        style.getPropertyValue(`border-${side.toLowerCase()}-width`),
      ) > 0 &&
      !clear(style.getPropertyValue(`border-${side.toLowerCase()}-color`)),
  );
  const image = style.backgroundImage;
  const shadow = style.boxShadow;
  return (
    border ||
    !clear(style.backgroundColor) ||
    (!!image && image !== "none") ||
    (!!shadow && shadow !== "none")
  );
}

/**
 * Sweep the Collapsible's own panel when the root's state changed. The box
 * is the content element (with `asChild`, the child it renders); its element
 * children hold still. Loose text can't be counter-moved, and a box that
 * paints would slide its paint over the trigger: those fade instead.
 */
function sweepOwn(
  root: HTMLElement | null,
  changed: Map<HTMLElement, boolean>,
  t: RevealTiming,
) {
  const open = root ? changed.get(root) : undefined;
  const box = root ? contentOf(root) : null;
  if (!root || open === undefined || !box || box.hidden) return;
  const children = [...box.children] as HTMLElement[];
  const loose = [...box.childNodes].some(
    (node) => node.nodeType === 3 && node.textContent?.trim(),
  );
  const split = children.length > 0 && !loose && !paints(box);
  sweepPanel(
    {
      box,
      layers: split ? children : [],
      blocks: split ? children : [box],
      open,
      distance: open ? flowRoom(box, root) : leaveFlow(box, root),
    },
    t,
  );
}

function Collapsible({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  // What moves when the panel snaps is the content after it: the root's
  // later children and the Collapsible's later siblings (in its parent).
  const parentRef = React.useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    const parent = rootRef.current?.parentElement ?? null;
    // Directly inside another Collapsible: that one's own group moves these.
    parentRef.current =
      parent?.getAttribute("data-slot") === "collapsible" ? null : parent;
  });
  const [move, flip] = React.useReducer(
    (
      state: { version: number; ms?: number; ease?: string },
      next: { ms: number; ease: string },
    ) => ({ version: state.version + 1, ...next }),
    { version: 0 },
  );
  const clock = { duration: move.ms, easing: move.ease };
  useFlipGroup(parentRef, move.version, { selector: ":scope > *", ...clock });
  useFlipGroup(rootRef, move.version, {
    selector: ':scope > :not([data-slot="collapsible-content"])',
    ...clock,
  });
  // Any open state below the root (nested Collapsibles and Accordions too)
  // FLIPs that content in the click's task, before the snapped layout is
  // painted, and sweeps this root's panel on the same clock.
  useReveal(rootRef, {
    flip,
    sweep: (changed, t) => sweepOwn(rootRef.current, changed, t),
  });
  const setRootRef = useMergedRef(rootRef, ref);

  return (
    <CollapsiblePrimitive.Root
      ref={setRootRef}
      data-slot="collapsible"
      // `relative` anchors a closing panel once it leaves the flow; the
      // spring is shared by the clip edge and everything that rides it.
      className={cn("relative ease-spring-smooth", className)}
      {...props}
    />
  );
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      // While its edge sweeps, the box clips (overflow-clip: no new
      // formatting context, so margins don't shift) and lets the pointer
      // through to the trigger it overlaps; its children take it back. While
      // closing, a no-op hold keyframe keeps Radix from hiding it until the
      // edge has swept up.
      className={cn(
        "data-sweeping:pointer-events-none data-sweeping:overflow-clip data-sweeping:*:pointer-events-auto data-[state=closed]:animate-godui-reveal-hold",
        className,
      )}
      {...props}
    />
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
