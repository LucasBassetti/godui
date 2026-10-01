"use client";

// GodUI Accordion — mirrors shadcn/ui new-york-v4 components/ui/accordion.tsx (registry snapshot 2026-10-01).
// Motion: no height animation. A panel's height snaps; the items below FLIP
// (translate) from where they were; the panel slides in, and fades out before
// it collapses. Chevron rotates on a spring — via `transform`, because Chrome
// won't composite the individual `rotate` property on an <svg>. GPU-only.

import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import * as React from "react";
import { useFlipGroup } from "@/hooks/use-flip-group";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Signals the root that a panel mounted or unmounted, i.e. a height snapped. */
const AccordionFlipContext = React.createContext<(() => void) | null>(null);

function Accordion({
  ref,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [version, bump] = React.useReducer((n: number) => n + 1, 0);
  // Items whose position changed play an inverse translate back to rest.
  useFlipGroup(rootRef, version, {
    selector: ':scope > [data-slot="accordion-item"]',
  });
  const setRootRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <AccordionFlipContext.Provider value={bump}>
      <AccordionPrimitive.Root
        ref={setRootRef}
        data-slot="accordion"
        {...props}
      />
    </AccordionFlipContext.Provider>
  );
}

/**
 * Rendered inside the panel. Radix mounts panel children only while open (or
 * while the exit fade plays), so mount/unmount marks the exact commit where
 * the height snaps — that's when the items below need to FLIP.
 */
function AccordionFlipSignal() {
  const bump = React.useContext(AccordionFlipContext);
  useIsoLayoutEffect(() => {
    bump?.();
    return () => bump?.();
  }, [bump]);
  return null;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:[transform:rotate(180deg)]",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-[transform] duration-(--godui-duration-base) ease-spring-snappy motion-reduce:transition-none" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=open]:animate-godui-slide-in-from-top data-[state=closed]:animate-godui-fade-out"
      {...props}
    >
      <AccordionFlipSignal />
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
