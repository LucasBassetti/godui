"use client";

// GodUI Collapsible — mirrors shadcn/ui new-york-v4 components/ui/collapsible.tsx (registry snapshot 2026-10-01).
// Motion: no height animation. The panel's height snaps; the Collapsible's
// following siblings (in its parent) FLIP from where they were; the panel
// slides in, and fades out before it collapses. GPU-only.

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import * as React from "react";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Signals the root that the panel mounted or unmounted, i.e. its height snapped. */
const CollapsibleFlipContext = React.createContext<(() => void) | null>(null);

function Collapsible({
  ref,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  // What moves when the panel snaps is the content *after* the Collapsible,
  // so the FLIP group is the root's parent; its children are the candidates.
  const parentRef = React.useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    parentRef.current = rootRef.current?.parentElement ?? null;
  });
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);
  useFlipGroup(parentRef, version, { selector: ":scope > *" });
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <CollapsibleFlipContext.Provider value={bump}>
      <CollapsiblePrimitive.Root
        ref={setRootRef}
        data-slot="collapsible"
        {...props}
      />
    </CollapsibleFlipContext.Provider>
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

/**
 * Rendered inside the panel. Radix mounts panel children only while open (or
 * while the exit fade plays), so mount/unmount marks the commit where the
 * height snaps — when the siblings below need to FLIP.
 */
function CollapsibleFlipSignal() {
  const bump = React.useContext(CollapsibleFlipContext);
  useIsoLayoutEffect(() => {
    bump?.();
    return () => bump?.();
  }, [bump]);
  return null;
}

function CollapsibleContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      className={cn(
        "data-[state=open]:animate-godui-slide-in-from-top data-[state=closed]:animate-godui-fade-out",
        className,
      )}
      {...props}
    >
      {/* asChild needs a single child, so it skips the signal (and the FLIP). */}
      {props.asChild ? (
        children
      ) : (
        <>
          <CollapsibleFlipSignal />
          {children}
        </>
      )}
    </CollapsiblePrimitive.CollapsibleContent>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
