"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { X } from "lucide-react";
import { type RefObject, useEffect, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/cn";
import { formatCode } from "@/lib/format-code";
import { useResizablePane } from "@/lib/use-resizable-pane";

/** Leave at least this much stage above the code, or the preview stops working. */
const MIN_STAGE_PX = 240;
const CODE_MIN = 180;
const CODE_DEFAULT = 320;

// Runs during the server render too, so it cannot assume a window.
const clampCode = (containerPx: number): [number, number] => {
  if (!Number.isFinite(containerPx)) return [CODE_MIN, CODE_DEFAULT];
  const max = Math.max(
    CODE_MIN,
    Math.min(containerPx * 0.6, containerPx - MIN_STAGE_PX),
  );
  return [CODE_MIN, max];
};

/**
 * Source for the active example, as a resizable bottom row of the stage frame
 * rather than a tab.
 *
 * Code and the thing it renders are the tightest pairing in these docs — a tab
 * forces you to hold one in your head while looking at the other. As a pane
 * they're on screen together, which is the whole point of a workbench.
 */
export function CodePane({
  open,
  onClose,
  code,
  lang = "tsx",
  containerRef,
}: {
  open: boolean;
  onClose: () => void;
  code: string;
  lang?: string;
  containerRef: RefObject<HTMLElement | null>;
}) {
  const [formatted, setFormatted] = useState(() => code.trim());

  const { separatorProps, dragging } = useResizablePane({
    axis: "y",
    cssVar: "--wb-code-user",
    storageKey: "codeH",
    defaultPx: CODE_DEFAULT,
    clamp: clampCode,
    // Handle is on the pane's top edge, so dragging up grows it.
    invert: true,
    containerRef,
    label: "Resize code panel",
  });

  useEffect(() => {
    let active = true;
    void formatCode(code, lang).then((next) => {
      if (active) setFormatted(next);
    });
    return () => {
      active = false;
    };
  }, [code, lang]);

  return (
    // <section>, not <div>: an aria-label on a generic element is dropped, so
    // the pane needs an implicit role to carry its name. A named <section> is
    // exposed as a region, which also makes it reachable by landmark nav.
    <section
      id="wb-code-pane"
      data-wb-pane
      aria-label="Example source"
      inert={!open}
      className="wb-code-pane relative flex min-h-0 flex-col border-fd-border border-t bg-[var(--code-block,var(--color-fd-card))]"
    >
      <div
        {...separatorProps}
        className={cn(
          "group absolute inset-x-0 -top-2 z-30 h-4 cursor-row-resize touch-none focus-visible:outline-none",
          !open && "pointer-events-none",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 top-1.5 h-px transition-colors group-hover:bg-fd-primary/60 group-focus-visible:bg-fd-primary",
            dragging ? "bg-fd-primary" : "bg-transparent",
          )}
        />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 border-fd-border/60 border-b px-3 py-1.5">
        <span className="font-medium font-mono text-fd-muted-foreground text-xs">
          {lang}
        </span>
        <div className="flex items-center gap-1">
          <CopyButton value={formatted} className="size-7 rounded-lg" />
          <button
            type="button"
            aria-label="Close code panel"
            title="Close code panel"
            onClick={onClose}
            className="inline-flex size-7 items-center justify-center rounded-lg text-fd-muted-foreground transition-colors hover:text-fd-foreground active:scale-95"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* fumadocs' CodeBlock is `overflow-hidden` with the scroller on its inner
          <pre> (which also carries `max-h-[600px]`). The pre therefore has to be
          the thing that fills the pane — sizing the wrapper instead clips the
          code and leaves its scrollbar below the fold. The flex chain that does
          it lives in globals.css under `.wb-code-pane .workbench-code`, because
          it has to reach through CodeBlock's internal markup. */}
      <div className="workbench-code min-h-0 flex-1 overflow-hidden">
        <DynamicCodeBlock
          lang={lang}
          code={formatted}
          codeblock={{
            allowCopy: false,
            className: cn(
              "my-0 rounded-none border-0 bg-transparent shadow-none",
            ),
          }}
        />
      </div>
    </section>
  );
}
